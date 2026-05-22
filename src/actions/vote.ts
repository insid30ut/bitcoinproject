'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createVote({
  amountUsd,
  txId,
  type,
  voterPaymail,
  postId,
  commentId
}: {
  amountUsd: number;
  txId: string;
  type: 'upvalue' | 'downvalue';
  voterPaymail: string;
  postId?: string;
  commentId?: string;
}) {
  if (!postId && !commentId) {
    return { success: false, error: 'Must provide either postId or commentId' };
  }

  try {
    const vote = await prisma.vote.create({
      data: {
        amountUsd,
        txId,
        type,
        voterPaymail,
        postId: postId || null,
        commentId: commentId || null,
      },
    });

    if (postId) {
      revalidatePath(`/p/${postId}`);
    } else if (commentId) {
      // Need to find the associated post to revalidate its path
      const comment = await prisma.comment.findUnique({ where: { id: commentId } });
      if (comment) revalidatePath(`/p/${comment.postId}`);
    }
    
    return { success: true, voteId: vote.id };
  } catch (error: any) {
    console.error('Failed to create vote:', error);
    return { success: false, error: 'Failed to create vote' };
  }
}
