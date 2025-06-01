import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to diagnose environment and SSL issues
 * This can be accessed at /api/debug
 */
export async function GET(request: NextRequest) {
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
    isPreview: process.env.VERCEL_ENV === 'preview' || false,
    cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
    previewMode: request.cookies.get('preview-mode')?.value || 'not set'
  };

  // Return diagnostic information
  return NextResponse.json({ 
    message: 'Diagnostic information', 
    environment: envInfo,
    timestamp: new Date().toISOString(),
    note: 'This endpoint is for debugging purposes only'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}