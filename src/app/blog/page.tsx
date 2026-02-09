import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "How to Ace Your Next Technical Interview in 2026",
      excerpt: "A comprehensive guide to preparing for technical interviews at top tech companies, from data structures to system design.",
      date: "Feb 5, 2026",
      category: "Interview Tips",
      readTime: "8 min read",
      emoji: "🎯",
    },
    {
      title: "The Rise of AI-Powered Interview Preparation",
      excerpt: "How artificial intelligence is revolutionizing the way engineers prepare for job interviews and why it matters.",
      date: "Jan 28, 2026",
      category: "AI & Technology",
      readTime: "6 min read",
      emoji: "🤖",
    },
    {
      title: "System Design Interview: Complete Guide",
      excerpt: "Everything you need to know about system design interviews, from URL shorteners to distributed databases.",
      date: "Jan 20, 2026",
      category: "System Design",
      readTime: "12 min read",
      emoji: "🏗️",
    },
    {
      title: "Top 10 JavaScript Interview Questions in 2026",
      excerpt: "The most commonly asked JavaScript questions at top tech companies, with detailed explanations and code examples.",
      date: "Jan 15, 2026",
      category: "JavaScript",
      readTime: "10 min read",
      emoji: "📜",
    },
    {
      title: "From Bootcamp to FAANG: Success Stories",
      excerpt: "Real stories from engineers who went from coding bootcamps to landing offers at top tech companies using our platform.",
      date: "Jan 8, 2026",
      category: "Success Stories",
      readTime: "5 min read",
      emoji: "⭐",
    },
    {
      title: "Data Structures Every Developer Must Know",
      excerpt: "A deep dive into essential data structures — arrays, linked lists, trees, graphs, and when to use each one.",
      date: "Dec 30, 2025",
      category: "DSA",
      readTime: "15 min read",
      emoji: "🧮",
    },
  ];

  return (
    <div className="min-h-screen gradient-bg relative overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <span className="text-xl font-bold text-white">InterviewAI</span>
          </Link>
          <Link href="/" className="text-white/70 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-orange-300 mb-6">
            <span>📝</span> Blog
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Latest <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">Articles</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Tips, guides, and insights to help you prepare for your next technical interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <article key={idx} className="glass-strong rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{post.emoji}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">{post.category}</span>
                  <span className="text-white/40 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{post.title}</h3>
                <p className="text-white/50 text-sm mb-4">{post.excerpt}</p>
                <div className="text-white/40 text-xs">{post.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
