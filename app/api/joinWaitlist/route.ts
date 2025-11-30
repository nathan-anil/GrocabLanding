import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDB } from '@/lib/firebase';
import { validateEmail } from '@/lib/validators';

/**
 * Rate limiting configuration
 * In production, consider using a proper rate limiting library like:
 * - @upstash/ratelimit (Redis-based)
 * - Vercel Edge Config
 * - Or implement IP-based rate limiting
 */
const RATE_LIMIT = {
  maxRequests: 5, // Max requests per window
  windowMs: 60 * 1000, // 1 minute window
};

// Simple in-memory rate limit store (resets on server restart)
// For production, use Redis or a persistent store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiting check
 * @param identifier - IP address or user identifier
 * @returns true if request is allowed, false if rate limited
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback to a default identifier
  return 'unknown';
}

/**
 * POST /api/joinWaitlist
 * 
 * Handles email waitlist signups:
 * - Validates email format
 * - Checks for duplicates
 * - Saves to Firestore
 * - Implements rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body. Expected JSON.',
        },
        { status: 400 }
      );
    }

    const { email, excitedFeature } = body;

    // Validate email
    const validation = validateEmail(email);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'Invalid email address',
        },
        { status: 400 }
      );
    }

    const normalizedEmail = validation.data!;

    // Get Firestore instance
    const db = getFirestoreDB();
    const waitlistCollection = db.collection('waitlist');

    // Check for duplicate email
    const existingDoc = await waitlistCollection
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existingDoc.empty) {
      // Email already exists, but return success to prevent email enumeration
      return NextResponse.json(
        {
          success: true,
          message: "You're already on the list!",
        },
        { status: 200 }
      );
    }

    // Save to Firestore
    const now = new Date();
    const waitlistData: {
      email: string;
      createdAt: Date;
      createdAtTimestamp: number;
      excitedFeature?: string;
    } = {
      email: normalizedEmail,
      createdAt: now,
      createdAtTimestamp: now.getTime(),
    };

    // Add excitedFeature if provided
    if (excitedFeature && typeof excitedFeature === 'string' && excitedFeature.trim()) {
      waitlistData.excitedFeature = excitedFeature.trim();
    }

    await waitlistCollection.add(waitlistData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "You're on the list!",
      },
      { status: 200 }
    );
  } catch (error) {
    // Always log full error details for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    };
    
    console.error('Error in /api/joinWaitlist:', errorDetails);
    
    // Check for common Firebase errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide more helpful error messages
    let userFriendlyError = 'An error occurred. Please try again later.';
    
    if (errorMessage.includes('Missing Firebase Admin SDK credentials')) {
      userFriendlyError = 'Server configuration error. Please contact support.';
      console.error('Firebase credentials missing in production!');
    } else if (errorMessage.includes('Failed to initialize Firebase Admin SDK')) {
      userFriendlyError = 'Server configuration error. Please contact support.';
      console.error('Firebase initialization failed:', errorDetails);
    } else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('permission')) {
      userFriendlyError = 'Permission error. Please contact support.';
      console.error('Firebase permission error:', errorDetails);
    } else if (process.env.NODE_ENV === 'development') {
      userFriendlyError = `Development Error: ${errorMessage}`;
    }

    return NextResponse.json(
      {
        success: false,
        error: userFriendlyError,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

