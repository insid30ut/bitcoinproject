import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handCashConnect } from '@/lib/handcash';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('handcash_auth_token')?.value;

  if (!authToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const account = handCashConnect.getAccountFromAuthToken(authToken);
    const profile = await account.profile.getCurrentProfile();
    
    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching HandCash profile:', error);
    // If token is invalid or expired, clear it
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete('handcash_auth_token');
    return response;
  }
}
