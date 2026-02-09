import Link from "next/link";

export default function APIDocsPage() {
  const endpoints = [
    { method: "POST", path: "/api/v1/assessments", description: "Create a new assessment for a candidate" },
    { method: "GET", path: "/api/v1/assessments/:id", description: "Get assessment details and results" },
    { method: "POST", path: "/api/v1/candidates", description: "Register a new candidate" },
    { method: "GET", path: "/api/v1/candidates/:id/results", description: "Get candidate's assessment results" },
    { method: "POST", path: "/api/v1/questions", description: "Create custom question pools" },
    { method: "GET", path: "/api/v1/analytics", description: "Get hiring analytics and insights" },
    { method: "POST", path: "/api/v1/webhooks", description: "Configure webhook notifications" },
    { method: "GET", path: "/api/v1/templates", description: "List available assessment templates" },
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
            <span>🔌</span> API Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Developer <span className="text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">API</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Integrate InterviewAI into your hiring workflow with our powerful REST API.
          </p>
        </div>

        {/* Quick Start */}
        <div className="glass-strong rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <p className="text-white/60 mb-6">Authenticate your requests with your API key in the header:</p>
          <div className="bg-black/40 rounded-xl p-6 font-mono text-sm border border-white/10">
            <div className="text-purple-400">curl -X POST https://api.interviewai.com/v1/assessments \</div>
            <div className="text-white/60">  -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</div>
            <div className="text-white/60">  -H &quot;Content-Type: application/json&quot; \</div>
            <div className="text-green-400">  -d &apos;{`{"candidate_id": "abc123", "template": "senior-react"}`}&apos;</div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="glass-strong rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  endpoint.method === "GET" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-white/80 font-mono text-sm">{endpoint.path}</code>
                <span className="text-white/50 text-sm ml-auto hidden md:block">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="glass-strong rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { plan: "Free", limit: "100 req/day", color: "text-white/60" },
              { plan: "Pro", limit: "10,000 req/day", color: "text-purple-400" },
              { plan: "Enterprise", limit: "Unlimited", color: "text-cyan-400" },
            ].map((tier, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-xl text-center">
                <div className={`text-lg font-bold ${tier.color}`}>{tier.plan}</div>
                <div className="text-white/50 text-sm">{tier.limit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all inline-flex items-center gap-2">
            Get API Key →
          </Link>
        </div>
      </div>
    </div>
  );
}
