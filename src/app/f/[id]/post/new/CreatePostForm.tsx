'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { usePayment } from '@/hooks/usePayment';
import { createPost } from '@/actions/post';

export default function CreatePostForm({ forumId, forumName, creatorPaymail, appWallet }: any) {
  const router = useRouter();
  const { walletType, userProfile, connectHandcash, connectYours } = useWallet();
  const { executePayment } = usePayment();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletType || !userProfile) return;
    
    setIsSubmitting(true);
    try {
      const paymentRes = await executePayment(0.05, [
        { destination: appWallet, percentage: 15 },
        { destination: creatorPaymail, percentage: 85 }
      ], `Post in ${forumName}`);

      const result = await createPost({
        title,
        content,
        forumId,
        txId: paymentRes?.transactionId || paymentRes?.txId || 'mock-tx-id',
        authorPaymail: userProfile.paymail,
      });

      if (result.success) {
        router.push(`/p/${result.postId}`);
      }
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!walletType) {
    return (
      <div className="card w-full bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body text-center">
          <h2 className="card-title text-2xl mx-auto mb-4 font-black">Wallet Required</h2>
          <p className="mb-6 text-base-content/70">Connect a BSV wallet to post. Cost: $0.05</p>
          <button onClick={connectHandcash} className="btn btn-primary w-full rounded-full">Connect HandCash</button>
          <button onClick={connectYours} className="btn btn-secondary w-full mt-3 rounded-full">Connect Yours Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => router.back()} className="btn btn-ghost mb-6">← Back to Forum</button>
      <h1 className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">New Post</h1>
      
      <div className="card bg-base-100 shadow-2xl border border-base-content/10">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-4">
              <label className="label"><span className="label-text font-bold">Title</span></label>
              <input 
                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="input input-bordered input-lg w-full bg-base-200 focus:bg-base-100 transition-colors" 
              />
            </div>
            <div className="form-control w-full mb-8">
              <label className="label"><span className="label-text font-bold">Content</span></label>
              <textarea 
                required value={content} onChange={e => setContent(e.target.value)}
                className="textarea textarea-bordered h-48 bg-base-200 focus:bg-base-100 transition-colors text-base" 
              ></textarea>
            </div>

            <div className="bg-base-200/50 p-6 rounded-2xl mb-8 border border-base-content/10">
              <h3 className="text-lg font-bold mb-3">Transaction Split ($0.05)</h3>
              <div className="flex justify-between items-center text-sm text-base-content/60 mb-2">
                <span>App Treasury (15%)</span>
                <span className="font-mono bg-base-300 px-2 py-1 rounded">{appWallet.substring(0,8)}...</span>
              </div>
              <div className="flex justify-between items-center text-sm text-base-content/60">
                <span>Forum Creator (85%)</span>
                <span className="font-mono bg-base-300 px-2 py-1 rounded">{creatorPaymail}</span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full rounded-full shadow-lg hover:-translate-y-0.5 transition-all shadow-primary/20 hover:shadow-primary/40">
              {isSubmitting ? <span className="loading loading-spinner"></span> : 'Pay $0.05 & Publish'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
