import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handCashConfig, Connect } from '@/lib/handcash';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('handcash_auth_token')?.value;

  if (!authToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const client = handCashConfig.getAccountClient(authToken) as any;
    const { data: profile } = await Connect.getCurrentUserProfile({ client });
    
    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching HandCash profile:', error);
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete('handcash_auth_token');
    return response;
  }
}
