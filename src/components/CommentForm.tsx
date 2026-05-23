'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { usePayment } from '@/hooks/usePayment';
import { createComment } from '@/actions/comment';

export default function CommentForm({ 
  postId, 
  authorPaymail, 
  appWallet,
  parentCommentId
}: { 
  postId: string; 
  authorPaymail: string; 
  appWallet: string;
  parentCommentId?: string;
}) {
  const { walletType, userProfile } = useWallet();
  const { executePayment } = usePayment();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletType || !userProfile) {
      alert('Please connect your wallet to comment.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const paymentRes = await executePayment(0.05, [
        { destination: appWallet, percentage: 15 },
        { destination: authorPaymail, percentage: 85 }
      ], parentCommentId ? 'Reply to comment' : 'Comment on post');

      const result = await createComment({
        content,
        postId,
        parentCommentId,
        txId: paymentRes?.transactionId || paymentRes?.txId || 'mock-tx-id',
        authorPaymail: userProfile.paymail,
      });

      if (result.success) {
        setContent('');
      }
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-control">
        <textarea 
          required 
          value={content} 
          onChange={e => setContent(e.target.value)}
          placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
          className="textarea textarea-bordered bg-base-200 focus:bg-base-100 transition-colors w-full" 
        ></textarea>
      </div>
      <div className="flex justify-end mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting || !content.trim()} 
          className="btn btn-primary btn-sm rounded-full shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : `Pay $0.05 & ${parentCommentId ? 'Reply' : 'Comment'}`}
        </button>
      </div>
    </form>
  );
}
