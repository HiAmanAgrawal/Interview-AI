import Link from "next/link";

export default function CompaniesPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 mb-6">
            <span>🏢</span> For Companies
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Hire the <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">Best Talent</span> Faster
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Stop wasting time on unqualified candidates. Our AI-powered platform helps you identify top engineering talent with technical assessments that actually work.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: "70%", label: "Faster Hiring", icon: "⚡" },
            { value: "3x", label: "Better Retention", icon: "📈" },
            { value: "500+", label: "Companies Trust Us", icon: "🏆" },
            { value: "50K+", label: "Candidates Assessed", icon: "👥" },
          ].map((stat, idx) => (
            <div key={idx} className="glass-strong rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-8 mb-16">
          {[
            {
              title: "AI-Powered Assessments",
              description: "Create custom technical assessments tailored to your job requirements. Our AI evaluates candidates consistently and fairly.",
              points: ["Custom question pools for your tech stack", "Automated scoring with detailed rubrics", "Anti-cheating measures & proctoring", "Real-time candidate performance insights"],
              icon: "📝",
            },
            {
              title: "Candidate Pipeline Management",
              description: "Track candidates through your entire hiring funnel with our integrated pipeline management system.",
              points: ["Visual kanban-style pipeline", "Automated status updates", "Team collaboration & notes", "Email integration & scheduling"],
              icon: "📊",
            },
            {
              title: "Seamless Integrations",
              description: "Connect with your existing HR tools and workflows for a unified hiring experience.",
              points: ["ATS integrations (Greenhouse, Lever, etc.)", "Calendar sync (Google, Outlook)", "Slack & Teams notifications", "REST API for custom workflows"],
              icon: "🔗",
            },
          ].map((feature, idx) => (
            <div key={idx} className="glass-strong rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-white/80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="text-center mb-16">
          <div className="text-white/40 text-sm mb-8">Trusted by engineering teams at</div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Airbnb"].map((company, idx) => (
              <div key={idx} className="text-white/30 text-xl font-bold hover:text-white/50 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your hiring?</h2>
            <p className="text-white/60 mb-8">Get started with a free pilot program for your team.</p>
            <div className="flex justify-center gap-4">
              <Link href="/contact" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all">
                Start Free Pilot
              </Link>
              <Link href="/contact" className="px-8 py-4 glass text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
