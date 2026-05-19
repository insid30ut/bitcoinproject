import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authToken = searchParams.get('authToken');

  if (!authToken) {
    return NextResponse.redirect(new URL('/?error=missing_auth_token', request.url));
  }

  const cookieStore = await cookies();
  const returnTo = cookieStore.get('handcash_return_to')?.value || '/';

  // Set the authToken in an HttpOnly cookie
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  
  response.cookies.set({
    name: 'handcash_auth_token',
    value: authToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  response.cookies.delete('handcash_return_to');

  return response;
}
