import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ForumPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { comments: true, votes: true } }
        }
      }
    }
  });

  if (!forum) return notFound();

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Forum Header */}
      <div className="bg-base-100 border-b border-base-content/10 pt-16 pb-12 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link href="/" className="text-sm font-semibold text-primary hover:underline mb-4 inline-block">
              ← Back to all forums
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-3">{forum.name}</h1>
            <p className="text-lg text-base-content/70 max-w-2xl">{forum.description}</p>
            <div className="mt-4 flex gap-4 text-sm font-mono text-base-content/50">
              <span className="bg-base-200 px-3 py-1 rounded-full border border-base-content/5">
                Owner: {forum.creatorPaymail}
              </span>
            </div>
          </div>
          
          <Link href={`/f/${forum.id}/post/new`} className="btn btn-primary rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 whitespace-nowrap">
            + New Post ($0.05)
          </Link>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {forum.posts.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/5 shadow-sm">
            <h3 className="text-2xl font-bold mb-2">No Posts Yet</h3>
            <p className="text-base-content/60 mb-6">Start the conversation by publishing the first post.</p>
            <Link href={`/f/${forum.id}/post/new`} className="btn btn-secondary rounded-full">
              Publish First Post ($0.05)
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {forum.posts.map(post => (
              <Link key={post.id} href={`/p/${post.id}`} className="block group">
                <div className="card bg-base-100 shadow-sm hover:shadow-md border border-base-content/5 transition-all">
                  <div className="card-body p-6 flex flex-row gap-6 items-start">
                    {/* Votes Mock Area */}
                    <div className="flex flex-col items-center gap-2 bg-base-200 p-2 rounded-xl">
                      <button className="text-base-content/40 hover:text-success transition-colors">▲</button>
                      <span className="font-bold font-mono text-sm">{post._count.votes}</span>
                      <button className="text-base-content/40 hover:text-error transition-colors">▼</button>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-base-content/60 line-clamp-2 text-sm mb-4">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs font-mono text-base-content/50">
                        <span>By {post.authorPaymail}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post._count.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
