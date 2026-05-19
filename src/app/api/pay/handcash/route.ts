import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handCashConnect } from '@/lib/handcash';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('handcash_auth_token')?.value;

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payments, description } = await request.json();
    
    // Create account instance using user's token
    const account = handCashConnect.getAccountFromAuthToken(authToken);

    // Execute the payment
    const paymentResult = await account.wallet.pay({
      payments,
      description: description || 'Forum Payment',
    });

    return NextResponse.json({ success: true, transactionId: paymentResult.transactionId }, { status: 200 });
  } catch (error: any) {
    console.error('Handcash payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment failed' }, { status: 500 });
  }
}
