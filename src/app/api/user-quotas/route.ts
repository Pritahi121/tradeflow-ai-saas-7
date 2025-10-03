import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userQuotas } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

    // Try to find existing quota record
    const existingQuota = await db.select()
      .from(userQuotas)
      .where(eq(userQuotas.userId, user.id))
      .limit(1);

    if (existingQuota.length > 0) {
      return NextResponse.json(existingQuota[0]);
    }

    // Create default quota record if doesn't exist
    const defaultQuota = await db.insert(userQuotas)
      .values({
        userId: user.id,
        monthlyQuota: 10,
        remainingCredits: 10,
        monthlyCredits: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(defaultQuota[0]);
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
    const { monthlyQuota, remainingCredits, monthlyCredits } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (monthlyQuota !== undefined && (typeof monthlyQuota !== 'number' || monthlyQuota < 0)) {
      return NextResponse.json({ 
        error: "Monthly quota must be a non-negative number",
        code: "INVALID_MONTHLY_QUOTA" 
      }, { status: 400 });
    }

    if (remainingCredits !== undefined && (typeof remainingCredits !== 'number' || remainingCredits < 0)) {
      return NextResponse.json({ 
        error: "Remaining credits must be a non-negative number",
        code: "INVALID_REMAINING_CREDITS" 
      }, { status: 400 });
    }

    if (monthlyCredits !== undefined && (typeof monthlyCredits !== 'number' || monthlyCredits < 0)) {
      return NextResponse.json({ 
        error: "Monthly credits must be a non-negative number",
        code: "INVALID_MONTHLY_CREDITS" 
      }, { status: 400 });
    }

    // Check if quota record exists for upsert logic
    const existingQuota = await db.select()
      .from(userQuotas)
      .where(eq(userQuotas.userId, user.id))
      .limit(1);

    if (existingQuota.length > 0) {
      // Update existing record
      const updateData: any = { updatedAt: new Date().toISOString() };
      
      if (monthlyQuota !== undefined) updateData.monthlyQuota = monthlyQuota;
      if (remainingCredits !== undefined) updateData.remainingCredits = remainingCredits;
      if (monthlyCredits !== undefined) updateData.monthlyCredits = monthlyCredits;

      const updated = await db.update(userQuotas)
        .set(updateData)
        .where(eq(userQuotas.userId, user.id))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Create new record
      const newQuota = await db.insert(userQuotas)
        .values({
          userId: user.id,
          monthlyQuota: monthlyQuota ?? 10,
          remainingCredits: remainingCredits ?? 10,
          monthlyCredits: monthlyCredits ?? 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returning();

      return NextResponse.json(newQuota[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}