import { prisma } from '@/lib/prisma';
import { getAppConfig } from '@/actions/forum';
import { notFound } from 'next/navigation';
import CreatePostForm from './CreatePostForm';

export default async function NewPostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const forum = await prisma.forum.findUnique({ where: { id } });
  if (!forum) return notFound();

  const config = await getAppConfig();

  return (
    <div className="min-h-screen bg-base-200 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <CreatePostForm 
          forumId={forum.id} 
          forumName={forum.name} 
          creatorPaymail={forum.creatorPaymail} 
          appWallet={config.appWallet} 
        />
      </div>
    </div>
  );
}
