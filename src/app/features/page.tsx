import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: "🧠",
      title: "Adaptive AI Intelligence",
      description: "Our AI analyzes your responses in real-time, adjusting question difficulty and providing personalized guidance based on your performance. It learns your strengths and weaknesses to create the most effective practice sessions.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: "💻",
      title: "Interactive Code Editor",
      description: "Write, run, and debug code in our built-in editor with syntax highlighting and real-time execution. Supports JavaScript, TypeScript, Python, and SQL with instant feedback.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: "🎨",
      title: "System Design Whiteboard",
      description: "Sketch architectures, draw diagrams, and explain your system designs with our intuitive digital whiteboard. Perfect for practicing system design interviews.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: "⏱️",
      title: "Stress Timer Mode",
      description: "Practice under pressure with our stress timer that simulates real interview conditions. Visual warnings help you manage your time effectively during practice sessions.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: "💡",
      title: "Smart Hints System",
      description: "When you're stuck, get contextual hints that guide you toward the solution without giving away the answer. Available in Practice mode to accelerate your learning.",
      gradient: "from-yellow-500 to-amber-600",
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics. Identify weak areas with topic-by-topic breakdowns, view accuracy trends, and watch yourself improve over time.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: "🎤",
      title: "Voice Input Support",
      description: "Use the built-in microphone to dictate your answers just like in a real interview. Practice articulating your thoughts clearly and confidently.",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: "🔗",
      title: "Match Following Questions",
      description: "Interactive matching exercises that test your understanding of concept relationships. Drag and connect items to demonstrate deep knowledge.",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      icon: "🔒",
      title: "Fullscreen Proctored Mode",
      description: "Interview mode includes fullscreen proctoring with tab-switch detection, simulating real online assessment environments used by top companies.",
      gradient: "from-red-500 to-pink-600",
    },
  ];

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

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-purple-300 mb-6">
            <span>✨</span> Features
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Everything You Need to <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Succeed</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with proven interview techniques to give you the best preparation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/practice" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all inline-flex items-center gap-2">
            Try It Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
