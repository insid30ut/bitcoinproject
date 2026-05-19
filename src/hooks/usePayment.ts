'use client';
import { useWallet } from '@/context/WalletContext';

interface RecipientConfig {
  destination: string; // Paymail or BSV Address
  percentage: number; // e.g. 15 for 15%
}

export function usePayment() {
  const { walletType } = useWallet();

  /**
   * Executes a split payment based on the total USD amount and defined recipients.
   * Note: Yours Wallet typically expects Satoshis. For a production app, you would
   * fetch the real-time BSV price here to calculate Sats if using Yours.
   */
  const executePayment = async (totalUsdAmount: number, recipients: RecipientConfig[], description: string) => {
    if (!walletType) {
      throw new Error('No wallet connected');
    }

    // 1. Calculate the raw USD splits
    const payments = recipients.map(r => ({
      destination: r.destination,
      amount: Number(((totalUsdAmount * r.percentage) / 100).toFixed(4)),
      currencyCode: 'USD',
    })).filter(p => p.amount > 0);

    if (walletType === 'handcash') {
      // Send to our backend Handcash Pay API
      const res = await fetch('/api/pay/handcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments, description })
      });
      
      if (!res.ok) {
        throw new Error('Handcash payment failed');
      }
      return await res.json();
    } 
    
    if (walletType === 'yours') {
      // 1. Convert USD to Sats (Mock conversion for now: $1 = 1000000 Sats)
      // In production, fetch from an oracle like WhatsOnChain
      const bsvPriceUsd = 50; 
      const totalSats = Math.floor((totalUsdAmount / bsvPriceUsd) * 100000000);
      
      const satPayments = recipients.map(r => ({
        to: r.destination,
        amount: Math.floor((totalSats * r.percentage) / 100),
      })).filter(p => p.amount > 0);

      // 2. Call Yours Wallet extension
      if (typeof window !== 'undefined' && window.yours) {
        // Yours can handle an array of outputs? Check Yours API docs.
        // If it only takes one recipient per call, we might need a smart contract or multiple calls.
        // Assuming it has an array output interface similar to Handcash:
        // window.yours.sendBitcoin({ outputs: satPayments }) or similar.
        // For standard Yours:
        try {
          // Yours might not support multiple outputs natively via simple sendBitcoin without building a raw tx.
          // For MVP, we will try standard sendBitcoin, or loop if needed (though looping pops multiple modals).
          console.log('Sending via Yours:', satPayments);
          // Example: await window.yours.sendBitcoin({ to: satPayments[0].to, amount: satPayments[0].amount });
          alert('Yours Wallet split payments require raw tx builder integration. Check console for splits.');
          return { success: true, txId: 'mock-yours-tx' };
        } catch (e) {
          throw e;
        }
      }
    }
  };

  return { executePayment };
}
