'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(data: { title: string, content: string, forumId: string, txId: string, authorPaymail: string }) {
  // Ensure the user exists in DB
  let user = await prisma.user.findUnique({ where: { paymail: data.authorPaymail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        paymail: data.authorPaymail,
        handle: data.authorPaymail.split('@')[0] || 'Unknown',
        wallet: 'handcash',
      }
    });
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      forumId: data.forumId,
      authorPaymail: user.paymail,
      postFeeTxId: data.txId,
    }
  });

  revalidatePath(`/f/${data.forumId}`);
  return { success: true, postId: post.id };
}
