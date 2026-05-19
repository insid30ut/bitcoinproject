'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { usePayment } from '@/hooks/usePayment';
import { createForum, getAppConfig } from '@/actions/forum';

export default function CreateForumPage() {
  const router = useRouter();
  const { walletType, userProfile, connectHandcash, connectYours } = useWallet();
  const { executePayment } = usePayment();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appWallet, setAppWallet] = useState('');

  useEffect(() => {
    getAppConfig().then(config => setAppWallet(config.appWallet));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletType || !userProfile) return;
    
    setIsSubmitting(true);
    try {
      // Execute Payment: $0.50 -> 100% App Wallet
      const paymentRes = await executePayment(0.50, [
        { destination: appWallet, percentage: 100 }
      ], `Create Forum: ${name}`);

      // Create Forum in DB
      const result = await createForum({
        name,
        description,
        txId: paymentRes.transactionId || paymentRes.txId || 'mock-tx-id',
        creatorPaymail: userProfile.paymail,
      });

      if (result.success) {
        router.push(`/f/${result.forumId}`);
      }
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!walletType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl border border-base-content/10">
          <div className="card-body text-center items-center">
            <h2 className="card-title text-2xl mb-4 font-black">Wallet Required</h2>
            <p className="mb-6 text-base-content/70">Connect a BSV wallet to pay the $0.50 forum creation fee.</p>
            <button onClick={connectHandcash} className="btn btn-primary w-full rounded-full">Connect HandCash</button>
            <button onClick={connectYours} className="btn btn-secondary w-full mt-3 rounded-full">Connect Yours Wallet</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="btn btn-ghost mb-6">← Back</button>
        <h1 className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Create a New Forum</h1>
        
        <div className="card bg-base-100 shadow-2xl border border-base-content/10">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">Forum Name</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BSV Developers" 
                  className="input input-bordered input-lg w-full bg-base-200 focus:bg-base-100 transition-colors" 
                />
              </div>

              <div className="form-control w-full mb-8">
                <label className="label">
                  <span className="label-text font-bold">Description</span>
                </label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered h-32 text-base bg-base-200 focus:bg-base-100 transition-colors" 
                  placeholder="What is this community about?"
                ></textarea>
              </div>

              <div className="bg-base-200/50 p-6 rounded-2xl mb-8 border border-base-content/10">
                <h3 className="text-lg font-bold mb-2">Transaction Details</h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base-content/80">Forum Creation Fee</span>
                  <span className="font-mono font-bold text-xl text-primary">$0.50</span>
                </div>
                <div className="flex justify-between items-center text-sm text-base-content/50">
                  <span>Recipient</span>
                  <span className="font-mono bg-base-300 px-2 py-1 rounded">App Treasury ({appWallet.substring(0,8)}...)</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary btn-lg w-full rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Pay $0.50 & Create Forum'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
