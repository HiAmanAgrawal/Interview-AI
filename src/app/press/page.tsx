import Link from "next/link";

export default function PressPage() {
  const pressItems = [
    { outlet: "TechCrunch", title: "InterviewAI raises $15M to democratize tech interview prep", date: "Jan 2026" },
    { outlet: "The Verge", title: "This AI tool is changing how engineers prepare for job interviews", date: "Dec 2025" },
    { outlet: "Forbes", title: "Top 10 EdTech startups to watch in 2026", date: "Nov 2025" },
    { outlet: "Wired", title: "The future of hiring: How AI is replacing mock interviews", date: "Oct 2025" },
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
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-yellow-300 mb-6">
            <span>📰</span> Press
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            In the <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">News</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Read what the media is saying about InterviewAI.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {pressItems.map((item, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 hover:scale-[1.02] transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-yellow-400 text-sm font-bold">{item.outlet}</span>
                  <h3 className="text-lg text-white mt-1 group-hover:text-yellow-300 transition-colors">{item.title}</h3>
                </div>
                <span className="text-white/40 text-sm hidden md:block">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Press Inquiries</h2>
          <p className="text-white/60 mb-4">
            For press inquiries, please contact us at
          </p>
          <span className="text-purple-400 text-lg font-medium">press@interviewai.com</span>
        </div>
      </div>
    </div>
  );
}
