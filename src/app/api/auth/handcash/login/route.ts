import { NextResponse } from 'next/server';
import { handCashConfig } from '@/lib/handcash';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get('returnTo') || '/';

    const url = handCashConfig.getRedirectionUrl();
    const response = NextResponse.redirect(url);
    
    // Store where we should return to after login
    response.cookies.set({
      name: 'handcash_return_to',
      value: returnTo,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10, // 10 mins
    });
    
    return response;
  } catch (err) {
    console.error('HandCash redirect error:', err);
    return NextResponse.json({ error: 'Failed to generate redirect URL' }, { status: 500 });
  }
}
