import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handCashConfig, Connect } from '@/lib/handcash';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('handcash_auth_token')?.value;

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payments, description } = await request.json();
    
    const client = handCashConfig.getAccountClient(authToken) as any;

    const { data: paymentResult } = await Connect.pay({
      client,
      body: {
        instrumentCurrencyCode: 'BSV',
        denominationCurrencyCode: 'USD',
        receivers: payments,
        note: description || 'Forum Payment',
      }
    });

    return NextResponse.json({ success: true, transactionId: paymentResult?.transactionId }, { status: 200 });
  } catch (error: any) {
    console.error('Handcash payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment failed' }, { status: 500 });
  }
}
