import Link from "next/link";

export default function CareersPage() {
  const openings = [
    { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "ML / AI Engineer", team: "AI Research", location: "San Francisco", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
    { title: "DevOps Engineer", team: "Infrastructure", location: "Remote", type: "Full-time" },
    { title: "Technical Content Writer", team: "Content", location: "Remote", type: "Contract" },
    { title: "Customer Success Manager", team: "Support", location: "New York", type: "Full-time" },
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

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-green-300 mb-6">
            <span>🚀</span> Join Us
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Build the Future of <span className="text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">Hiring</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Join our team and help millions of engineers land their dream jobs.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: "🌍", title: "Remote-First" },
            { icon: "💰", title: "Competitive Pay" },
            { icon: "🏥", title: "Full Benefits" },
            { icon: "📚", title: "Learning Budget" },
          ].map((perk, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{perk.icon}</div>
              <div className="text-white/80 text-sm font-medium">{perk.title}</div>
            </div>
          ))}
        </div>

        {/* Openings */}
        <div className="glass-strong rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div>
                  <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">{job.title}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-white/50 text-sm">{job.team}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">{job.location}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">{job.type}</span>
                  </div>
                </div>
                <span className="text-purple-400 text-sm mt-2 md:mt-0">Apply →</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/50">
            Don&apos;t see your role? Email us at <span className="text-purple-400">careers@interviewai.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
