import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  // Fetch forums from DB
  const forums = await prisma.forum.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content">
      {/* Header Area */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/70 border-b border-base-content/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            BSV Forums
          </h1>
          <div className="flex items-center gap-6">
            <Link href="/about" className="font-semibold text-base-content/70 hover:text-primary transition-colors">
              Tokenomics
            </Link>
            <Link href="/forums/create" className="btn btn-primary rounded-full px-6 shadow-lg hover:shadow-primary/50 transition-all">
              + Create Forum
            </Link>
            {/* Wallet button will go here */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">Discover Communities</h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Join the micropayment revolution. Create and engage in forums where value flows directly to the creators and contributors.
          </p>
        </div>

        {/* Forum Grid */}
        {forums.length === 0 ? (
          <div className="text-center py-20 bg-base-100/50 rounded-3xl border border-base-content/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-2">No Forums Yet</h3>
            <p className="text-base-content/60 mb-6">Be the first to create a community and start earning!</p>
            <Link href="/forums/create" className="btn btn-secondary rounded-full">
              Create the First Forum ($0.50)
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forums.map((forum) => (
              <Link key={forum.id} href={`/f/${forum.id}`} className="block group">
                <div className="card bg-base-100/80 backdrop-blur-lg border border-base-content/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="card-body relative z-10">
                    <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
                      {forum.name}
                    </h2>
                    <p className="text-base-content/70 my-2 line-clamp-3">
                      {forum.description}
                    </p>
                    <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-content/10">
                      <div className="badge badge-outline">{forum._count.posts} posts</div>
                      <span className="text-sm text-base-content/50">
                        {new Date(forum.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
