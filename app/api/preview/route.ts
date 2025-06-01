import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to enable preview mode and diagnose environment issues
 * This can be accessed at /api/preview?secret=YOUR_SECRET_TOKEN
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  // This is the preview secret you should set in your environment variables
  // For development, you can hardcode it here, but in production use an environment variable
  const previewSecret = process.env.PREVIEW_SECRET || 'your-preview-secret';
  
  // Collect environment information for debugging
  const envInfo = {
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? 'set' : 'not set',
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? 'set' : 'not set',
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ? 'set' : 'not set',
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'not set',
    headers: Object.fromEntries(request.headers.entries()),
    host: request.headers.get('host') || 'unknown',
    url: request.url,
    isPreview: process.env.VERCEL_ENV === 'preview' || false
  };

  // If the secret doesn't match, return diagnostic information but don't enable preview
  if (secret !== previewSecret) {
    return NextResponse.json({ 
      message: 'Invalid token. Preview mode not enabled.', 
      environment: envInfo,
      note: 'To enable preview mode, use the correct secret token'
    }, {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  // Set environment variables for preview mode
  process.env.CONTENTFUL_PREVIEW_MODE = 'true';
  
  // Get the path to redirect to from the query string
  const path = searchParams.get('path') || '/';
  
  // Create response and set cookies
  const response = NextResponse.redirect(new URL(path, request.url));
  
  // Set preview mode cookie
  response.cookies.set('preview-mode', 'true', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
  });
  
  // Add diagnostic information to the response headers
  response.headers.set('X-Preview-Mode', 'enabled');
  response.headers.set('X-Environment', process.env.VERCEL_ENV || 'unknown');
  
  return response;
}

/**
 * API route to disable preview mode
 * This can be accessed at /api/preview/clear
 */
export async function POST(request: NextRequest) {
  // Clear the preview mode cookie
  const response = NextResponse.redirect(new URL('/', request.url));
  
  response.cookies.delete('preview-mode');
  
  return response;
}