import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/70 border-b border-base-content/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">BSV Forums</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="font-semibold text-primary underline underline-offset-8">
              Tokenomics
            </Link>
            <Link href="/forums/create" className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
              + Create Forum
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            The Value-Driven <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Community Economy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 leading-relaxed font-light">
            We believe that high-quality discussions hold inherent value. BSV Forums leverages the power of Bitcoin SV microtransactions to financially reward forum creators, active posters, and insightful commenters directly. No ads, no data selling—just pure value exchange.
          </p>
        </div>
      </section>

      {/* Tokenomics Breakdown */}
      <section className="py-20 bg-base-100 border-y border-base-content/5 shadow-inner relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Platform Tokenomics</h2>
            <p className="text-lg text-base-content/60">Every interaction has a cost, and every contribution earns a reward.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Create Forum */}
            <div className="card bg-base-200 shadow-xl border border-primary/20 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-primary">Create a Forum</h3>
                <div className="text-4xl font-mono font-black mb-6">$0.50</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-primary font-bold">100%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    A flat fee to combat spam and stake your claim as a community owner.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <div className="card bg-base-200 shadow-xl border border-secondary/20 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-secondary">Publish a Post</h3>
                <div className="text-4xl font-mono font-black mb-6">$0.05</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Forum Creator</span>
                    <span className="badge badge-secondary font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-ghost font-bold">15%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    Publishing costs a micro-fee, heavily rewarding the creator who built and moderated the space.
                  </p>
                </div>
              </div>
            </div>

            {/* Comment/Reply */}
            <div className="card bg-base-200 shadow-xl border border-accent/20 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-accent">Comment / Reply</h3>
                <div className="text-4xl font-mono font-black mb-6">$0.05</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Forum Creator</span>
                    <span className="badge badge-accent font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-ghost font-bold">15%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    Engaging in the discussion supports the health and ownership of the forum.
                  </p>
                </div>
              </div>
            </div>

            {/* Upvalue Post/Comment */}
            <div className="card bg-gradient-to-br from-success/10 to-base-200 shadow-xl border border-success/30 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-success">Upvalue (Content)</h3>
                <div className="text-4xl font-mono font-black mb-6">Custom</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Content Author</span>
                    <span className="badge badge-success font-bold">80%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Forum Creator</span>
                    <span className="badge badge-outline font-bold">10%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-ghost font-bold">10%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    Did someone post something brilliant? Reward them directly. The bulk of the value flows straight to the author.
                  </p>
                </div>
              </div>
            </div>

            {/* Upvalue Forum */}
            <div className="card bg-gradient-to-br from-info/10 to-base-200 shadow-xl border border-info/30 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-info">Upvalue (Forum)</h3>
                <div className="text-4xl font-mono font-black mb-6">Custom</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Forum Creator</span>
                    <span className="badge badge-info font-bold">90%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-ghost font-bold">10%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    Donate directly to the creator of a community that you find exceptionally valuable.
                  </p>
                </div>
              </div>
            </div>

            {/* Downvalue */}
            <div className="card bg-gradient-to-br from-error/10 to-base-200 shadow-xl border border-error/30 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-2 text-error">Downvalue (Any)</h3>
                <div className="text-4xl font-mono font-black mb-6">Custom</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">App Treasury</span>
                    <span className="badge badge-error font-bold">75%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-base-content/70">Escrow Wallet</span>
                    <span className="badge badge-outline font-bold">25%</span>
                  </div>
                  <div className="divider my-0"></div>
                  <p className="text-xs text-base-content/50 mt-4 leading-relaxed">
                    Disagreement has a cost. Funds are diverted away from the ecosystem and placed into a neutral escrow.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-base-content/50">
        <p className="font-mono text-sm">Powered by HandCash & Bitcoin SV.</p>
      </footer>
    </div>
  );
}
