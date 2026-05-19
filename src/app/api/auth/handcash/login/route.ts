import { NextResponse } from 'next/server';
import { handCashConnect } from '@/lib/handcash';

export async function GET() {
  try {
    const url = handCashConnect.getRedirectionUrl();
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('HandCash redirect error:', err);
    return NextResponse.json({ error: 'Failed to generate redirect URL' }, { status: 500 });
  }
}
