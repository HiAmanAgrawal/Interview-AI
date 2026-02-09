import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does InterviewAI work?",
      a: "InterviewAI uses advanced AI to simulate realistic technical interviews. Choose your track (Frontend, Backend, DSA, or System Design), set your difficulty level, and start practicing. Our AI adapts to your responses in real-time.",
    },
    {
      q: "Is the platform free to use?",
      a: "We offer a free tier with 3 practice sessions per month. Pro and Enterprise plans unlock unlimited sessions, advanced analytics, and more features.",
    },
    {
      q: "What programming languages are supported?",
      a: "Our code editor supports JavaScript, TypeScript, Python, and SQL. We're actively working on adding more languages including Java, Go, and Rust.",
    },
    {
      q: "How is my data stored?",
      a: "All data is encrypted at rest and in transit. We never share your interview data with potential employers without your explicit consent. See our Privacy Policy for more details.",
    },
    {
      q: "Can I use InterviewAI on mobile?",
      a: "InterviewAI is optimized for desktop browsers to provide the best coding experience. We recommend using Chrome, Firefox, or Edge on a laptop or desktop computer.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period.",
    },
  ];

  const categories = [
    { icon: "🚀", title: "Getting Started", desc: "Learn the basics of using InterviewAI" },
    { icon: "💻", title: "Code Editor", desc: "Tips for the built-in code editor" },
    { icon: "🧠", title: "AI Features", desc: "How to get the most from our AI" },
    { icon: "💳", title: "Billing", desc: "Payment and subscription help" },
    { icon: "🔒", title: "Account", desc: "Manage your account settings" },
    { icon: "🐛", title: "Report a Bug", desc: "Found something? Let us know" },
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

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 mb-6">
            <span>💡</span> Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How Can We <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Help?</span>
          </h1>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer text-center">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-white font-medium mb-1">{cat.title}</h3>
              <p className="text-white/50 text-sm">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/50 mb-4">Still need help?</p>
          <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:scale-105 transition-all inline-flex items-center gap-2">
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
