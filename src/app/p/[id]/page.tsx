import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostVoteButtons from '@/components/PostVoteButtons';
import CommentForm from '@/components/CommentForm';

// Recursive component to render comments and their replies
function CommentThread({ comment, appWallet }: { comment: any, appWallet: string }) {
  const voteDiff = comment.votes.reduce((acc: number, v: any) => acc + (v.type === 'upvalue' ? 1 : -1), 0);

  return (
    <div className="mt-4 flex flex-row gap-4">
      <PostVoteButtons 
        commentId={comment.id} 
        authorPaymail={comment.authorPaymail} 
        appWallet={appWallet} 
        initialVotes={voteDiff} 
      />
      <div className="flex-1 bg-base-100 border border-base-content/10 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono text-base-content/50 mb-2">
          <span className="font-bold text-primary">{comment.authorPaymail}</span>
          <span>•</span>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-base-content/80 text-sm whitespace-pre-wrap mb-4">
          {comment.content}
        </p>
        
        <details className="group">
          <summary className="text-xs font-semibold text-base-content/50 cursor-pointer hover:text-base-content/80 transition-colors list-none flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            Reply
          </summary>
          <div className="mt-2 pl-2 border-l-2 border-base-content/10">
            <CommentForm 
              postId={comment.postId} 
              authorPaymail={comment.authorPaymail} 
              appWallet={appWallet} 
              parentCommentId={comment.id}
            />
          </div>
        </details>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 pl-4 border-l-2 border-base-content/5">
            {comment.replies.map((reply: any) => (
              <CommentThread key={reply.id} comment={reply} appWallet={appWallet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      forum: true,
      votes: true,
      comments: {
        include: {
          votes: true,
          replies: {
            include: {
              votes: true,
              replies: { include: { votes: true, replies: true } } // Support deep nesting
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!post) return notFound();

  const appWallet = process.env.APP_WALLET_PAYMAIL || 'app@handcash.io';
  const postVoteDiff = post.votes.reduce((acc, v) => acc + (v.type === 'upvalue' ? 1 : -1), 0);
  
  // Filter top-level comments (those without a parent)
  const topLevelComments = post.comments.filter(c => !c.parentCommentId);

  return (
    <div className="min-h-screen bg-base-200 text-base-content pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link href={`/f/${post.forumId}`} className="text-sm font-semibold text-primary hover:underline mb-6 inline-block">
          ← Back to {post.forum.name}
        </Link>
        
        {/* Main Post Card */}
        <div className="card bg-base-100 shadow-xl border border-base-content/10 mb-12">
          <div className="card-body p-6 md:p-10 flex flex-row gap-6 md:gap-8 items-start">
            <div className="mt-2">
              <PostVoteButtons 
                postId={post.id} 
                authorPaymail={post.authorPaymail} 
                appWallet={appWallet} 
                initialVotes={postVoteDiff} 
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm font-mono text-base-content/50 mb-8 pb-6 border-b border-base-content/10">
                <span className="bg-base-200 px-3 py-1 rounded-full border border-base-content/5 text-base-content/80">
                  By {post.authorPaymail}
                </span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="prose prose-lg max-w-none text-base-content/80 whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pl-0 md:pl-20">
          <h2 className="text-2xl font-bold mb-6">Comments ({post.comments.length})</h2>
          
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/10 mb-10">
            <h3 className="font-bold text-lg mb-2">Leave a comment</h3>
            <CommentForm postId={post.id} authorPaymail={post.authorPaymail} appWallet={appWallet} />
          </div>

          <div className="flex flex-col gap-2">
            {topLevelComments.length === 0 ? (
              <p className="text-base-content/50 italic py-8 text-center bg-base-200/50 rounded-xl">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              topLevelComments.map(comment => (
                <CommentThread key={comment.id} comment={comment} appWallet={appWallet} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
