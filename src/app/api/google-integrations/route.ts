import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { googleIntegrations } from '@/db/schema';
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

    const integration = await db.select({
      id: googleIntegrations.id,
      userId: googleIntegrations.userId,
      isActive: googleIntegrations.isActive,
      createdAt: googleIntegrations.createdAt,
      updatedAt: googleIntegrations.updatedAt,
    })
      .from(googleIntegrations)
      .where(eq(googleIntegrations.userId, user.id))
      .limit(1);

    if (integration.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(integration[0]);
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
    const { accessToken, refreshToken, isActive } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!accessToken) {
      return NextResponse.json({ 
        error: "Access token is required",
        code: "MISSING_ACCESS_TOKEN" 
      }, { status: 400 });
    }

    if (!refreshToken) {
      return NextResponse.json({ 
        error: "Refresh token is required",
        code: "MISSING_REFRESH_TOKEN" 
      }, { status: 400 });
    }

    // Check if integration already exists
    const existingIntegration = await db.select()
      .from(googleIntegrations)
      .where(eq(googleIntegrations.userId, user.id))
      .limit(1);

    const now = new Date().toISOString();
    
    if (existingIntegration.length > 0) {
      // Update existing integration
      const updated = await db.update(googleIntegrations)
        .set({
          accessToken: accessToken.trim(),
          refreshToken: refreshToken.trim(),
          isActive: isActive !== undefined ? isActive : false,
          updatedAt: now
        })
        .where(eq(googleIntegrations.userId, user.id))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Create new integration
      const newIntegration = await db.insert(googleIntegrations)
        .values({
          userId: user.id,
          accessToken: accessToken.trim(),
          refreshToken: refreshToken.trim(),
          isActive: isActive !== undefined ? isActive : false,
          createdAt: now,
          updatedAt: now
        })
        .returning();

      return NextResponse.json(newIntegration[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}