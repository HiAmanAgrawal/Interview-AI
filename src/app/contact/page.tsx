import Link from "next/link";

export default function ContactPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-pink-300 mb-6">
            <span>💬</span> Contact
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">Touch</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "📧", title: "Email", info: "support@interviewai.com", desc: "We respond within 24 hours" },
            { icon: "💬", title: "Live Chat", info: "Available 24/7", desc: "Talk to our support team" },
            { icon: "🐦", title: "Twitter", info: "@interviewai", desc: "DMs are open" },
          ].map((item, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-white font-medium mb-1">{item.title}</h3>
              <div className="text-purple-400 text-sm">{item.info}</div>
              <div className="text-white/40 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-8">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Email</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Subject</label>
              <input type="text" placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Message</label>
              <textarea rows={5} placeholder="Tell us more..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none" />
            </div>
            <button type="button" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
