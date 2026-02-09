import Link from "next/link";

export default function StatusPage() {
  const services = [
    { name: "API", status: "operational", uptime: "99.99%" },
    { name: "Web Application", status: "operational", uptime: "99.98%" },
    { name: "AI Engine", status: "operational", uptime: "99.95%" },
    { name: "Code Execution", status: "operational", uptime: "99.97%" },
    { name: "Authentication", status: "operational", uptime: "99.99%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "CDN / Static Assets", status: "operational", uptime: "99.99%" },
    { name: "Webhooks", status: "operational", uptime: "99.96%" },
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

      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> All Systems Operational
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            System <span className="text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">Status</span>
          </h1>
        </div>

        <div className="glass-strong rounded-3xl p-8 mb-8">
          <div className="space-y-4">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-sm hidden md:block">{service.uptime} uptime</span>
                  <span className="text-green-400 text-sm font-medium capitalize">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Past Incidents</h2>
          <div className="space-y-4">
            <div className="text-white/40 text-sm text-center py-8">
              No incidents reported in the last 90 days.
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/40 text-sm">
          Last updated: February 9, 2026 at 12:00 UTC
        </div>
      </div>
    </div>
  );
}
