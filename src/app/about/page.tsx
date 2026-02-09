import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-x-hidden">
      {/* Header */}
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
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-purple-300 mb-6">
            <span>🏢</span> About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Mission</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We&apos;re on a mission to democratize technical interview preparation using the power of AI.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              InterviewAI was born from a simple observation: preparing for technical interviews shouldn&apos;t require expensive coaching or insider connections. 
              Our team of engineers, AI researchers, and education specialists built a platform that gives every aspiring developer access to world-class interview preparation.
            </p>
            <p className="text-white/70 leading-relaxed">
              Founded in 2024, we&apos;ve helped over 50,000 engineers practice and prepare for their dream roles at top tech companies. 
              Our adaptive AI technology ensures that every practice session is tailored to your skill level, helping you grow stronger with every question.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Our Vision", description: "A world where every talented developer can showcase their skills and land their dream job, regardless of background." },
              { icon: "💡", title: "Our Approach", description: "We combine cutting-edge AI with proven pedagogical methods to create an adaptive learning experience that evolves with you." },
              { icon: "🤝", title: "Our Values", description: "Accessibility, fairness, and continuous improvement drive everything we build. We believe in meritocracy in tech hiring." },
            ].map((item, idx) => (
              <div key={idx} className="glass-strong rounded-2xl p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6">Our Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Alex Rivera", role: "CEO & Co-Founder", emoji: "👨‍💻" },
                { name: "Priya Patel", role: "CTO & Co-Founder", emoji: "👩‍💻" },
                { name: "Marcus Chen", role: "Head of AI", emoji: "🧑‍🔬" },
                { name: "Sarah Kim", role: "Head of Product", emoji: "👩‍🎨" },
              ].map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-3">
                    {member.emoji}
                  </div>
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-white/50 text-sm">{member.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Engineers Helped" },
              { value: "95%", label: "Success Rate" },
              { value: "500+", label: "Companies Trust Us" },
              { value: "24/7", label: "AI Availability" },
            ].map((stat, idx) => (
              <div key={idx} className="glass-strong rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
