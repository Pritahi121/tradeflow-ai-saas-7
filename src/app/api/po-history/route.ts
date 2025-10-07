import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { poHistory } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = session.user;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(poHistory)
        .where(and(eq(poHistory.id, parseInt(id)), eq(poHistory.userId, user.id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with search and pagination
    let query = db.select().from(poHistory).where(eq(poHistory.userId, user.id));

    if (search) {
      const searchCondition = or(
        like(poHistory.poNumber, `%${search}%`),
        like(poHistory.description, `%${search}%`)
      );
      
      query = query.where(and(eq(poHistory.userId, user.id), searchCondition));
    }

    const results = await query
      .orderBy(desc(poHistory.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = session.user;
    const requestBody = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { poNumber, description, amount, status } = requestBody;

    // Validate required fields
    if (!poNumber) {
      return NextResponse.json({ 
        error: "PO Number is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!amount && amount !== 0) {
      return NextResponse.json({ 
        error: "Amount is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate amount is a positive number
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    
    const insertData = {
      userId: user.id,
      poNumber: poNumber.trim(),
      description: description?.trim() || null,
      amount: parseFloat(amount),
      status: status || 'completed',
      createdAt: now,
      updatedAt: now
    };

    const newRecord = await db.insert(poHistory)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if record exists and belongs to user
    const existingRecord = await db.select()
      .from(poHistory)
      .where(and(eq(poHistory.id, parseInt(id)), eq(poHistory.userId, user.id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const { poNumber, description, amount, status } = requestBody;
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (poNumber !== undefined) {
      if (!poNumber) {
        return NextResponse.json({ 
          error: "PO Number cannot be empty",
          code: "INVALID_FIELD" 
        }, { status: 400 });
      }
      updates.poNumber = poNumber.trim();
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (amount !== undefined) {
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return NextResponse.json({ 
          error: "Amount must be a positive number",
          code: "INVALID_AMOUNT" 
        }, { status: 400 });
      }
      updates.amount = parseFloat(amount);
    }

    if (status !== undefined) {
      updates.status = status;
    }

    const updated = await db.update(poHistory)
      .set(updates)
      .where(and(eq(poHistory.id, parseInt(id)), eq(poHistory.userId, user.id)))
      .returning();

    return NextResponse.json(updated[0]);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists and belongs to user
    const existingRecord = await db.select()
      .from(poHistory)
      .where(and(eq(poHistory.id, parseInt(id)), eq(poHistory.userId, user.id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const deleted = await db.delete(poHistory)
      .where(and(eq(poHistory.id, parseInt(id)), eq(poHistory.userId, user.id)))
      .returning();

    return NextResponse.json({ 
      message: 'PO history record deleted successfully',
      record: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}