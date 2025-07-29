import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For now, return a simple response with the user ID
  // In a real app, you'd fetch user details from the database
  return NextResponse.json({ 
    user: { 
      id: userId 
    } 
  });
}