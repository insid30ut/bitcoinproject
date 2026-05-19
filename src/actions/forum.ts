'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAppConfig() {
  return {
    appWallet: process.env.APP_WALLET_PAYMAIL || '1A7LhdUBbiZEjXERnbvUmccyXxNwecGTYh',
    escrowWallet: process.env.ESCROW_WALLET_PAYMAIL || 'escrow@handcash.io',
  };
}

export async function createForum(data: { name: string, description: string, txId: string, creatorPaymail: string }) {
  // Ensure the user exists in DB
  let user = await prisma.user.findUnique({ where: { paymail: data.creatorPaymail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        paymail: data.creatorPaymail,
        handle: data.creatorPaymail.split('@')[0] || 'Unknown',
        wallet: 'handcash',
      }
    });
  }

  // Create the forum
  const forum = await prisma.forum.create({
    data: {
      name: data.name,
      description: data.description,
      creatorPaymail: user.paymail,
      creationFeeTxId: data.txId,
    }
  });

  revalidatePath('/');
  return { success: true, forumId: forum.id };
}
