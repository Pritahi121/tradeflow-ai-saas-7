import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq, like, and, or, desc, count } from 'drizzle-orm';
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

      const client = await db.select()
        .from(clients)
        .where(and(eq(clients.id, parseInt(id)), eq(clients.userId, user.id)))
        .limit(1);

      if (client.length === 0) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      return NextResponse.json(client[0]);
    }

    // List with search and pagination
    let query = db.select().from(clients).where(eq(clients.userId, user.id));

    if (search) {
      const searchCondition = or(
        like(clients.name, `%${search}%`),
        like(clients.company, `%${search}%`),
        like(clients.email, `%${search}%`)
      );
      
      query = db.select()
        .from(clients)
        .where(and(eq(clients.userId, user.id), searchCondition));
    }

    const results = await query
      .orderBy(desc(clients.createdAt))
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
    const { name, company, email, phone } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Generate clientId - get the next number
    const lastClient = await db.select({ clientId: clients.clientId })
      .from(clients)
      .where(eq(clients.userId, user.id))
      .orderBy(desc(clients.id))
      .limit(1);

    let nextNumber = 1;
    if (lastClient.length > 0 && lastClient[0].clientId) {
      const match = lastClient[0].clientId.match(/CLIENT_(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const clientId = `CLIENT_${nextNumber.toString().padStart(3, '0')}`;

    // Sanitize inputs
    const sanitizedData = {
      clientId,
      userId: user.id,
      name: name.trim(),
      company: company ? company.trim() : null,
      email: email ? email.trim().toLowerCase() : null,
      phone: phone ? phone.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newClient = await db.insert(clients)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newClient[0], { status: 201 });

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
    const { name, company, email, phone } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if client exists and belongs to user
    const existingClient = await db.select()
      .from(clients)
      .where(and(eq(clients.id, parseInt(id)), eq(clients.userId, user.id)))
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Validate required fields
    if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json({ 
        error: "Name cannot be empty",
        code: "INVALID_FIELD" 
      }, { status: 400 });
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (company !== undefined) updateData.company = company ? company.trim() : null;
    if (email !== undefined) updateData.email = email ? email.trim().toLowerCase() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    const updatedClient = await db.update(clients)
      .set(updateData)
      .where(and(eq(clients.id, parseInt(id)), eq(clients.userId, user.id)))
      .returning();

    if (updatedClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(updatedClient[0]);

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

    // Check if client exists and belongs to user before deleting
    const existingClient = await db.select()
      .from(clients)
      .where(and(eq(clients.id, parseInt(id)), eq(clients.userId, user.id)))
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const deletedClient = await db.delete(clients)
      .where(and(eq(clients.id, parseInt(id)), eq(clients.userId, user.id)))
      .returning();

    if (deletedClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Client deleted successfully',
      deletedClient: deletedClient[0] 
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}