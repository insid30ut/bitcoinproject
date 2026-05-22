'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createComment({
  content,
  postId,
  authorPaymail,
  txId,
  parentCommentId
}: {
  content: string;
  postId: string;
  authorPaymail: string;
  txId: string;
  parentCommentId?: string;
}) {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorPaymail,
        commentFeeTxId: txId,
        parentCommentId: parentCommentId || null,
      },
    });

    revalidatePath(`/p/${postId}`);
    return { success: true, commentId: comment.id };
  } catch (error: any) {
    console.error('Failed to create comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }
}
