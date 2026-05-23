'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { usePayment } from '@/hooks/usePayment';
import { createVote } from '@/actions/vote';

interface PostVoteButtonsProps {
  postId?: string;
  commentId?: string;
  authorPaymail: string;
  appWallet: string;
  initialVotes: number;
}

export default function PostVoteButtons({ 
  postId, 
  commentId, 
  authorPaymail, 
  appWallet, 
  initialVotes 
}: PostVoteButtonsProps) {
  const { walletType, userProfile, connectHandcash } = useWallet();
  const { executePayment } = usePayment();
  const [isVoting, setIsVoting] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState(initialVotes);

  const handleVote = async (type: 'upvalue' | 'downvalue') => {
    if (!walletType || !userProfile) {
      alert('Please connect your wallet to vote.');
      return;
    }

    setIsVoting(true);
    try {
      const paymentRes = await executePayment(0.05, [
        { destination: appWallet, percentage: 15 },
        { destination: authorPaymail, percentage: 85 }
      ], `Vote on ${postId ? 'post' : 'comment'}`);

      const result = await createVote({
        amountUsd: 0.05,
        txId: paymentRes?.transactionId || paymentRes?.txId || 'mock-tx-id',
        type,
        voterPaymail: userProfile.paymail,
        postId,
        commentId,
      });

      if (result.success) {
        setOptimisticVotes(prev => type === 'upvalue' ? prev + 1 : prev - 1);
      }
    } catch (err: any) {
      alert(`Vote failed: ${err.message}`);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 bg-base-200/50 p-2 rounded-xl border border-base-content/5">
      <button 
        onClick={() => handleVote('upvalue')}
        disabled={isVoting}
        className="text-base-content/40 hover:text-success transition-colors disabled:opacity-50"
      >
        ▲
      </button>
      <span className="font-bold font-mono text-sm">{optimisticVotes}</span>
      <button 
        onClick={() => handleVote('downvalue')}
        disabled={isVoting}
        className="text-base-content/40 hover:text-error transition-colors disabled:opacity-50"
      >
        ▼
      </button>
    </div>
  );
}
