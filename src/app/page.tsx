"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

type InterviewRole = "frontend" | "backend" | "dsa" | "system-design";
type Difficulty = "easy" | "medium" | "hard" | "expert";
type InterviewMode = "landing" | "setup" | "interview" | "feedback";
type PerformanceLevel = "struggling" | "average" | "excellent";

interface Question {
  id: string;
  type: "mcq" | "coding" | "whiteboard" | "theory";
  question: string;
  options?: string[];
  difficulty: Difficulty;
  hint?: string;
}

interface InterviewState {
  role: InterviewRole | null;
  difficulty: Difficulty;
  mode: InterviewMode;
  currentQuestion: number;
  score: number;
  performance: PerformanceLevel;
  timeRemaining: number;
  showHints: boolean;
  showExplanation: boolean;
  activeComponents: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const roleConfig = {
  frontend: {
    icon: "🎨",
    label: "Frontend",
    description: "React, Vue, CSS, JavaScript",
    color: "from-cyan-500 to-blue-600",
    glowColor: "glow-cyan",
  },
  backend: {
    icon: "⚙️",
    label: "Backend",
    description: "Django, Node.js, APIs, Databases",
    color: "from-purple-500 to-violet-600",
    glowColor: "glow-purple",
  },
  dsa: {
    icon: "🧮",
    label: "DSA",
    description: "Algorithms, Data Structures",
    color: "from-green-500 to-emerald-600",
    glowColor: "glow-cyan",
  },
  "system-design": {
    icon: "🏗️",
    label: "System Design",
    description: "Architecture, Scalability",
    color: "from-pink-500 to-rose-600",
    glowColor: "glow-pink",
  },
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-green-500", emoji: "🌱" },
  medium: { label: "Medium", color: "bg-yellow-500", emoji: "🔥" },
  hard: { label: "Hard", color: "bg-orange-500", emoji: "💀" },
  expert: { label: "Expert", color: "bg-red-500", emoji: "👹" },
};

const sampleQuestions: Record<InterviewRole, Question[]> = {
  frontend: [
    {
      id: "fe1",
      type: "mcq",
      question: "What is the virtual DOM in React?",
      options: [
        "A copy of the real DOM",
        "A lightweight JS representation of the DOM",
        "A browser API",
        "A CSS framework",
      ],
      difficulty: "easy",
      hint: "Think about how React optimizes rendering...",
    },
    {
      id: "fe2",
      type: "coding",
      question:
        "Implement a debounce function that delays invoking a function until after wait milliseconds.",
      difficulty: "medium",
      hint: "You'll need setTimeout and clearTimeout",
    },
  ],
  backend: [
    {
      id: "be1",
      type: "mcq",
      question: "What is Django's ORM?",
      options: [
        "Object-Relational Mapping",
        "Online Resource Manager",
        "Output Render Module",
        "Operation Runtime Manager",
      ],
      difficulty: "easy",
      hint: "It maps Python objects to database tables...",
    },
    {
      id: "be2",
      type: "coding",
      question: "Write a REST API endpoint to handle user authentication.",
      difficulty: "medium",
      hint: "Consider using JWT tokens for authentication",
    },
  ],
  dsa: [
    {
      id: "dsa1",
      type: "coding",
      question: "Implement a function to reverse a linked list.",
      difficulty: "medium",
      hint: "Use three pointers: prev, current, and next",
    },
    {
      id: "dsa2",
      type: "whiteboard",
      question: "Design an algorithm to find the kth largest element in an array.",
      difficulty: "hard",
      hint: "Consider using a min-heap of size k",
    },
  ],
  "system-design": [
    {
      id: "sd1",
      type: "whiteboard",
      question: "Design a URL shortening service like bit.ly",
      difficulty: "medium",
      hint: "Think about hashing, database schema, and caching",
    },
    {
      id: "sd2",
      type: "theory",
      question: "Explain CAP theorem and its implications in distributed systems.",
      difficulty: "hard",
      hint: "Consistency, Availability, Partition tolerance - pick two!",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-3xl animate-blob" />
    <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-500/15 to-transparent blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
    <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
    
    <div 
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />
    
    {/* Static particles with fixed positions to avoid hydration mismatch */}
    {[
      { left: 10, top: 20, delay: 0, duration: 9 },
      { left: 25, top: 65, delay: 2, duration: 10 },
      { left: 40, top: 30, delay: 4, duration: 8 },
      { left: 55, top: 80, delay: 1, duration: 11 },
      { left: 70, top: 45, delay: 3, duration: 9 },
      { left: 85, top: 15, delay: 5, duration: 10 },
      { left: 15, top: 75, delay: 6, duration: 8 },
      { left: 30, top: 50, delay: 2, duration: 12 },
      { left: 60, top: 25, delay: 4, duration: 9 },
      { left: 80, top: 70, delay: 7, duration: 10 },
      { left: 5, top: 40, delay: 1, duration: 11 },
      { left: 45, top: 90, delay: 3, duration: 8 },
      { left: 75, top: 35, delay: 5, duration: 9 },
      { left: 90, top: 60, delay: 0, duration: 10 },
      { left: 20, top: 85, delay: 6, duration: 11 },
      { left: 50, top: 10, delay: 2, duration: 8 },
      { left: 65, top: 55, delay: 4, duration: 12 },
      { left: 35, top: 95, delay: 7, duration: 9 },
      { left: 95, top: 5, delay: 1, duration: 10 },
      { left: 8, top: 48, delay: 3, duration: 11 },
    ].map((particle, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/30 rounded-full particle"
        style={{
          left: `${particle.left}%`,
          top: `${particle.top}%`,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
        }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Header = ({ onStartClick }: { onStartClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "glass-strong py-3" : "py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xl">🎯</span>
          </div>
          <span className="text-xl font-bold text-white">InterviewAI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</a>
          <a href="#demo" className="text-white/70 hover:text-white transition-colors">Demo</a>
          <a href="#companies" className="text-white/70 hover:text-white transition-colors">For Companies</a>
          <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="text-white/70 hover:text-white transition-colors hidden sm:block">
            Sign In
          </button>
          <button 
            onClick={onStartClick}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

const HeroSection = ({ onStartClick }: { onStartClick: () => void }) => (
  <section className="min-h-screen flex items-center justify-center pt-20 px-6">
    <div className="max-w-6xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-white/60 mb-8 animate-slide-up">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        AI-Powered Mock Interviews
        <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded-full text-xs ml-2">New</span>
      </div>
      
      {/* Main heading */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Ace Your Next
        </span>
        <br />
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Tech Interview
        </span>
      </h1>
      
      {/* Subheading */}
      <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "200ms" }}>
        Practice with an AI that <span className="text-white/80">adapts to your skill level</span> in real-time. 
        Get personalized feedback, hints when you&apos;re stuck, and track your progress to interview success.
      </p>
      
      {/* CTA Buttons */}
      <div className="flex flex-col items-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/practice"
            className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            📚 Practice Mode
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a 
            href="/test"
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            📝 Take a Test
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a 
            href="/interview"
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg animate-pulse-glow hover:scale-105 transition-all flex items-center gap-2"
          >
            🎯 Start Interview
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <a 
          href="/chat"
          className="px-6 py-3 glass text-white/70 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
        >
          💬 Free Chat with AI
        </a>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
        {[
          { value: "50K+", label: "Interviews Completed" },
          { value: "95%", label: "Success Rate" },
          { value: "4.9", label: "User Rating" },
          { value: "24/7", label: "AI Availability" },
        ].map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="mt-16 animate-bounce">
        <div className="w-8 h-12 mx-auto rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ═══════════════════════════════════════════════════════════════════════════

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  const features = [
    {
      icon: "🧠",
      title: "Adaptive AI Intelligence",
      description: "Our AI analyzes your responses in real-time, adjusting question difficulty and providing personalized guidance based on your performance.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: "💻",
      title: "Interactive Code Editor",
      description: "Write, run, and debug code in our built-in editor with syntax highlighting, auto-completion, and real-time execution.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: "🎨",
      title: "System Design Whiteboard",
      description: "Sketch architectures, draw diagrams, and explain your system designs with our intuitive digital whiteboard.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: "⏱️",
      title: "Stress Timer Mode",
      description: "Practice under pressure with our stress timer that simulates real interview conditions and helps you manage time effectively.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: "💡",
      title: "Smart Hints System",
      description: "When you're stuck, get contextual hints that guide you toward the solution without giving away the answer.",
      gradient: "from-yellow-500 to-amber-600",
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics, identify weak areas, and watch yourself improve over time.",
      gradient: "from-green-500 to-emerald-600",
    },
  ];
  
  return (
    <section id="features" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-purple-300 mb-6">
            <span>✨</span> Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Succeed</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with proven interview techniques to give you the best preparation experience.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`glass-strong rounded-3xl p-8 card-hover transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS SECTION
// ═══════════════════════════════════════════════════════════════════════════

const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  const steps = [
    {
      step: "01",
      title: "Choose Your Track",
      description: "Select from Frontend, Backend, DSA, or System Design interviews tailored to your target role.",
      icon: "🎯",
    },
    {
      step: "02",
      title: "Set Your Level",
      description: "Pick a difficulty that matches your experience - from beginner-friendly to expert challenges.",
      icon: "📊",
    },
    {
      step: "03",
      title: "Start Practicing",
      description: "Dive into realistic interview questions with our adaptive AI interviewer guiding you through.",
      icon: "🚀",
    },
    {
      step: "04",
      title: "Get Feedback",
      description: "Receive instant, detailed feedback on your answers and track your improvement over time.",
      icon: "⭐",
    },
  ];
  
  return (
    <section id="how-it-works" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-cyan-300 mb-6">
            <span>🔄</span> Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">Works</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Get started in minutes with our streamlined process designed for busy professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
              )}
              
              <div className="glass-strong rounded-3xl p-8 text-center relative z-10">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-purple-400 font-mono text-sm mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/50">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE DEMO SECTION
// ═══════════════════════════════════════════════════════════════════════════

const DemoSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [activeDemo, setActiveDemo] = useState<"editor" | "mcq" | "whiteboard" | "feedback">("editor");
  
  return (
    <section id="demo" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-pink-300 mb-6">
            <span>🎮</span> Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See It In <span className="text-transparent bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text">Action</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Explore the different components that make our platform powerful.
          </p>
        </div>
        
        {/* Demo tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {[
            { id: "editor", label: "Code Editor", icon: "💻" },
            { id: "mcq", label: "MCQ Panel", icon: "📝" },
            { id: "whiteboard", label: "Whiteboard", icon: "🎨" },
            { id: "feedback", label: "AI Feedback", icon: "🤖" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDemo(tab.id as typeof activeDemo)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeDemo === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "glass text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Demo content */}
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {activeDemo === "editor" && <DemoCodeEditor />}
          {activeDemo === "mcq" && <DemoMCQ />}
          {activeDemo === "whiteboard" && <DemoWhiteboard />}
          {activeDemo === "feedback" && <DemoFeedback />}
        </div>
      </div>
    </section>
  );
};

// Demo Components
const DemoCodeEditor = () => (
  <div className="glass-strong rounded-3xl overflow-hidden max-w-4xl mx-auto">
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-white/50 text-sm font-mono">solution.js</span>
      </div>
      <div className="flex gap-2">
        <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg">▶ Run</div>
        <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-lg">Submit</div>
      </div>
    </div>
    <div className="p-6 bg-white/5 border-b border-white/10">
      <p className="text-white/80">Implement a function that returns the nth Fibonacci number.</p>
    </div>
    <div className="p-6 font-mono text-sm">
      <div className="text-white/30">1  </div>
      <div><span className="text-purple-400">function</span> <span className="text-cyan-400">fibonacci</span><span className="text-white">(n) {"{"}</span></div>
      <div className="text-white/30">2  </div>
      <div><span className="text-white/50">  // Base cases</span></div>
      <div className="text-white/30">3  </div>
      <div><span className="text-purple-400">  if</span> <span className="text-white">(n {"<="} 1) </span><span className="text-purple-400">return</span><span className="text-white"> n;</span></div>
      <div className="text-white/30">4  </div>
      <div className="code-highlight pl-2"><span className="text-purple-400">  return</span> <span className="text-cyan-400">fibonacci</span><span className="text-white">(n - 1) + </span><span className="text-cyan-400">fibonacci</span><span className="text-white">(n - 2);</span></div>
      <div className="text-white/30">5  </div>
      <div><span className="text-white">{"}"}</span></div>
    </div>
    <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-green-400 text-sm">All test cases passed!</span>
    </div>
  </div>
);

const DemoMCQ = () => (
  <div className="glass-strong rounded-3xl p-8 max-w-2xl mx-auto">
    <div className="flex gap-3 mb-6">
      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">MCQ</span>
      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">🔥 Medium</span>
    </div>
    <h3 className="text-xl text-white mb-6">What is the time complexity of binary search?</h3>
    <div className="space-y-3">
      {["O(n)", "O(log n)", "O(n²)", "O(1)"].map((opt, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
            idx === 1 ? "bg-green-500/20 border-2 border-green-500/50" : "bg-white/5 border-2 border-transparent hover:bg-white/10"
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            idx === 1 ? "bg-green-500 text-white" : "bg-white/10 text-white/60"
          }`}>
            {String.fromCharCode(65 + idx)}
          </div>
          <span className="text-white/90">{opt}</span>
          {idx === 1 && <span className="ml-auto text-green-400">✓ Correct!</span>}
        </div>
      ))}
    </div>
  </div>
);

const DemoWhiteboard = () => (
  <div className="glass-strong rounded-3xl overflow-hidden max-w-4xl mx-auto">
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <span className="text-xl">🎨</span>
        <span className="text-white/70">System Design Whiteboard</span>
      </div>
      <div className="flex gap-2">
        {["⬜", "🔵", "🟢", "🟡", "🔴"].map((c, i) => (
          <div key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">{c}</div>
        ))}
      </div>
    </div>
    <div className="p-6 bg-white/5 border-b border-white/10">
      <p className="text-white/80">Design a URL shortening service like bit.ly</p>
    </div>
    <div className="h-80 relative p-8">
      {/* Simulated diagram */}
      <div className="absolute top-8 left-8 glass px-4 py-2 rounded-lg text-cyan-400 text-sm">Client</div>
      <div className="absolute top-8 left-32 w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 top-12" />
      <div className="absolute top-8 left-48 glass px-4 py-2 rounded-lg text-purple-400 text-sm">Load Balancer</div>
      <div className="absolute top-24 left-48 h-12 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 left-64" />
      <div className="absolute top-40 left-32 glass px-4 py-2 rounded-lg text-pink-400 text-sm">API Server 1</div>
      <div className="absolute top-40 left-64 glass px-4 py-2 rounded-lg text-pink-400 text-sm">API Server 2</div>
      <div className="absolute top-64 left-48 glass px-4 py-2 rounded-lg text-green-400 text-sm">Database</div>
      <div className="absolute top-64 right-24 glass px-4 py-2 rounded-lg text-yellow-400 text-sm">Cache (Redis)</div>
    </div>
  </div>
);

const DemoFeedback = () => (
  <div className="glass-strong rounded-3xl p-8 max-w-2xl mx-auto">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
        🤖
      </div>
      <div>
        <div className="text-white font-medium">AI Interviewer</div>
        <div className="text-white/50 text-sm">Analyzing your response...</div>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <span>✓</span>
          <span className="font-medium">Strengths</span>
        </div>
        <ul className="text-white/70 text-sm space-y-1 ml-6">
          <li>• Good understanding of recursion</li>
          <li>• Correct base case handling</li>
          <li>• Clean code structure</li>
        </ul>
      </div>
      
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <span>!</span>
          <span className="font-medium">Areas to Improve</span>
        </div>
        <ul className="text-white/70 text-sm space-y-1 ml-6">
          <li>• Consider memoization for O(n) time complexity</li>
          <li>• Could use iterative approach to save stack space</li>
        </ul>
      </div>
      
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <span>💡</span>
          <span className="font-medium">Suggestion</span>
        </div>
        <p className="text-white/70 text-sm ml-6">
          Try implementing dynamic programming with a bottom-up approach to achieve O(n) time and O(1) space complexity.
        </p>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION
// ═══════════════════════════════════════════════════════════════════════════

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  const testimonials = [
    {
      quote: "This platform helped me land my dream job at Google. The adaptive difficulty really pushed me to improve.",
      author: "Sarah Chen",
      role: "Software Engineer @ Google",
      avatar: "👩‍💻",
    },
    {
      quote: "The real-time feedback is incredible. It's like having a senior engineer mentor available 24/7.",
      author: "James Wilson",
      role: "Full Stack Developer @ Meta",
      avatar: "👨‍💼",
    },
    {
      quote: "I went from failing interviews to getting multiple offers. The system design whiteboard is a game-changer.",
      author: "Priya Sharma",
      role: "Backend Engineer @ Amazon",
      avatar: "👩‍🔬",
    },
  ];
  
  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-yellow-300 mb-6">
            <span>⭐</span> Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">Engineers</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className={`glass-strong rounded-3xl p-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="text-4xl mb-4">{t.avatar}</div>
              <p className="text-white/70 mb-6 italic">&quot;{t.quote}&quot;</p>
              <div>
                <div className="text-white font-medium">{t.author}</div>
                <div className="text-white/50 text-sm">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FOR COMPANIES SECTION
// ═══════════════════════════════════════════════════════════════════════════

const ForCompaniesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<"assess" | "track" | "integrate">("assess");
  
  const features = {
    assess: {
      title: "AI-Powered Assessments",
      description: "Create custom technical assessments tailored to your job requirements. Our AI evaluates candidates consistently and fairly.",
      points: [
        "Custom question pools for your tech stack",
        "Automated scoring with detailed rubrics",
        "Anti-cheating measures & proctoring",
        "Real-time candidate performance insights",
      ],
      demo: (
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Assessment: Senior React Developer</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Live</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-xs text-white/50">Candidates</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">78%</div>
              <div className="text-xs text-white/50">Avg Score</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">23</div>
              <div className="text-xs text-white/50">Shortlisted</div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Alex Thompson", score: 94, status: "Excellent" },
              { name: "Maria Garcia", score: 87, status: "Strong" },
              { name: "John Smith", score: 72, status: "Average" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-white/80 text-sm">{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className={`text-sm ${c.score > 85 ? "text-green-400" : c.score > 70 ? "text-yellow-400" : "text-orange-400"}`}>
                    {c.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    track: {
      title: "Candidate Pipeline",
      description: "Track candidates through your entire hiring funnel with our integrated pipeline management system.",
      points: [
        "Visual kanban-style pipeline",
        "Automated status updates",
        "Team collaboration & notes",
        "Email integration & scheduling",
      ],
      demo: (
        <div className="glass rounded-2xl p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[
              { stage: "Applied", count: 45, color: "bg-gray-500" },
              { stage: "Screening", count: 28, color: "bg-blue-500" },
              { stage: "Technical", count: 12, color: "bg-purple-500" },
              { stage: "Final", count: 5, color: "bg-pink-500" },
              { stage: "Offer", count: 2, color: "bg-green-500" },
            ].map((stage, i) => (
              <div key={i} className="min-w-[140px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-white/70 text-sm">{stage.stage}</span>
                  <span className="text-white/40 text-xs">({stage.count})</span>
                </div>
                <div className="space-y-2">
                  {[...Array(Math.min(stage.count, 3))].map((_, j) => (
                    <div key={j} className="glass rounded-lg p-3">
                      <div className="w-full h-2 bg-white/10 rounded mb-2" />
                      <div className="w-2/3 h-2 bg-white/5 rounded" />
                    </div>
                  ))}
                  {stage.count > 3 && (
                    <div className="text-center text-white/30 text-xs py-2">
                      +{stage.count - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    integrate: {
      title: "Seamless Integrations",
      description: "Connect with your existing HR tools and workflows for a unified hiring experience.",
      points: [
        "ATS integrations (Greenhouse, Lever, etc.)",
        "Calendar sync (Google, Outlook)",
        "Slack & Teams notifications",
        "REST API for custom workflows",
      ],
      demo: (
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Greenhouse", icon: "🌱", connected: true },
              { name: "Lever", icon: "🔧", connected: true },
              { name: "Slack", icon: "💬", connected: true },
              { name: "Google Cal", icon: "📅", connected: true },
              { name: "Workday", icon: "📊", connected: false },
              { name: "LinkedIn", icon: "💼", connected: false },
              { name: "Teams", icon: "👥", connected: true },
              { name: "Zapier", icon: "⚡", connected: false },
            ].map((app, i) => (
              <div key={i} className={`glass rounded-xl p-4 text-center relative ${app.connected ? "" : "opacity-60"}`}>
                <div className="text-3xl mb-2">{app.icon}</div>
                <div className="text-white/80 text-sm">{app.name}</div>
                {app.connected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">✓</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-xl font-mono text-sm">
            <div className="text-purple-400">POST /api/v1/assessments</div>
            <div className="text-white/50 mt-1">{"{"} &quot;candidate_id&quot;: &quot;abc123&quot;, &quot;template&quot;: &quot;senior-react&quot; {"}"}</div>
          </div>
        </div>
      ),
    },
  };
  
  return (
    <section id="companies" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 mb-6">
            <span>🏢</span> For Hiring Teams
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hire the <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">Best Talent</span> Faster
          </h2>
          <p className="text-xl text-white/50 max-w-3xl mx-auto">
            Stop wasting time on unqualified candidates. Our AI-powered platform helps you identify top engineering talent with technical assessments that actually work.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "100ms" }}>
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
        
        {/* Feature tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "200ms" }}>
          {[
            { id: "assess", label: "Assess Candidates", icon: "📝" },
            { id: "track", label: "Track Pipeline", icon: "📊" },
            { id: "integrate", label: "Integrations", icon: "🔗" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  : "glass text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Feature content */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "300ms" }}>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">{features[activeTab].title}</h3>
            <p className="text-lg text-white/60">{features[activeTab].description}</p>
            <ul className="space-y-4">
              {features[activeTab].points.map((point, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-all">
                Request Demo
              </button>
              <button className="px-6 py-3 glass text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                View Pricing
              </button>
            </div>
          </div>
          <div>
            {features[activeTab].demo}
          </div>
        </div>
        
        {/* Trusted by logos */}
        <div className={`mt-20 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>
          <div className="text-center text-white/40 text-sm mb-8">Trusted by engineering teams at</div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Airbnb"].map((company, idx) => (
              <div key={idx} className="text-white/30 text-xl font-bold hover:text-white/50 transition-colors cursor-default">
                {company}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className={`mt-20 glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "500ms" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to transform your hiring?</h3>
              <p className="text-white/60">Get started with a free pilot program for your team.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all whitespace-nowrap">
                Start Free Pilot
              </button>
              <button className="px-8 py-4 glass text-white rounded-xl font-medium hover:bg-white/10 transition-all whitespace-nowrap">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRICING SECTION
// ═══════════════════════════════════════════════════════════════════════════

const PricingSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <section id="pricing" className="py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-green-300 mb-6">
            <span>💰</span> Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">Transparent</span> Pricing
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className={`glass-strong rounded-3xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-white/50">/mo</span></div>
            <ul className="space-y-3 mb-8">
              {["5 interviews/month", "Basic feedback", "MCQ questions only", "Community support"].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 glass rounded-xl text-white font-medium hover:bg-white/10 transition-all">
              Get Started
            </button>
          </div>
          
          {/* Pro */}
          <div className={`gradient-border rounded-3xl p-8 relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "150ms" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-medium">
              Most Popular
            </div>
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-white mb-6">$19<span className="text-lg text-white/50">/mo</span></div>
            <ul className="space-y-3 mb-8">
              {["Unlimited interviews", "AI feedback & hints", "All question types", "Code editor & whiteboard", "Progress analytics", "Priority support"].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-all">
              Start Free Trial
            </button>
          </div>
          
          {/* Enterprise */}
          <div className={`glass-strong rounded-3xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "300ms" }}>
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
            <div className="text-4xl font-bold text-white mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              {["Everything in Pro", "Custom question pools", "Team management", "API access", "SSO integration", "Dedicated support"].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 glass rounded-xl text-white font-medium hover:bg-white/10 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════

const CTASection = ({ onStartClick }: { onStartClick: () => void }) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <section className="py-32 px-6" ref={ref}>
      <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="glass-strong rounded-3xl p-12 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Join thousands of engineers who have landed their dream jobs with our AI-powered interview preparation.
            </p>
            <button 
              onClick={onStartClick}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-2xl font-semibold text-xl animate-pulse-glow hover:scale-105 transition-all"
            >
              Start Practicing Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Footer = () => (
  <footer className="py-16 px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <span className="text-xl font-bold text-white">InterviewAI</span>
          </div>
          <p className="text-white/50 mb-6 max-w-xs">
            AI-powered mock interviews to help you land your dream tech job.
          </p>
          <div className="flex gap-4">
            {["𝕏", "in", "📘", "📸"].map((icon, i) => (
              <div key={i} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">
                {icon}
              </div>
            ))}
          </div>
        </div>
        
        {/* Links */}
        {[
          { title: "Product", links: ["Features", "For Companies", "Pricing", "API"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
          { title: "Support", links: ["Help Center", "Contact", "Status", "Terms"] },
        ].map((col, idx) => (
          <div key={idx}>
            <h4 className="text-white font-medium mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-white/50 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/50 text-sm">
          © 2026 InterviewAI. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-white/50 hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW COMPONENTS (kept from before)
// ═══════════════════════════════════════════════════════════════════════════

const NeuralLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-spin-slow" />
      <div 
        className="absolute inset-2 rounded-full animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, transparent, oklch(0.7 0.2 280), transparent)",
          animationDirection: "reverse",
          animationDuration: "2s",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-purple-400 rounded-full neural-node"
              style={{ transform: `rotate(${i * 72}deg) translateY(-12px)` }}
            />
          ))}
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
    <p className="text-lg animate-thinking-gradient font-medium">{text}</p>
  </div>
);

const StressTimer = ({ timeRemaining, totalTime = 300 }: { timeRemaining: number; totalTime?: number }) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isWarning = percentage <= 30 && percentage > 10;
  const isDanger = percentage <= 10;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  return (
    <div className={`relative glass-strong rounded-2xl p-4 overflow-hidden ${isWarning ? "timer-warning" : ""} ${isDanger ? "timer-danger border-2 border-red-500/50" : ""}`}>
      <div className="absolute inset-0 opacity-20">
        <div className={`h-full transition-all duration-1000 ease-linear ${isDanger ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-purple-500"}`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="relative flex items-center gap-3">
        <div className={`text-2xl ${isDanger ? "animate-pulse" : ""}`}>{isDanger ? "⏰" : isWarning ? "⚡" : "🕐"}</div>
        <div>
          <div className={`text-3xl font-mono font-bold tabular-nums ${isDanger ? "text-red-400" : isWarning ? "text-yellow-400" : "text-white"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider">{isDanger ? "Hurry up!" : isWarning ? "Time running low" : "Time remaining"}</div>
        </div>
      </div>
    </div>
  );
};

const CodeEditor = ({ question, onSubmit }: { question: Question; onSubmit: (code: string) => void }) => {
  const [code, setCode] = useState(`// Write your solution here\nfunction solution() {\n  \n}`);
  const [isRunning, setIsRunning] = useState(false);
  
  return (
    <div className="glass-strong rounded-2xl overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm text-white/50 ml-2">solution.js</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setIsRunning(true); setTimeout(() => setIsRunning(false), 2000); }} disabled={isRunning} className="px-4 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-all flex items-center gap-2">
            {isRunning ? <><div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />Running...</> : <>▶ Run</>}
          </button>
          <button onClick={() => onSubmit(code)} className="px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition-all">Submit</button>
        </div>
      </div>
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <p className="text-white/80 text-sm">{question.question}</p>
      </div>
      <div className="p-4">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-64 bg-transparent code-editor text-white/90 resize-none focus:outline-none" spellCheck={false} />
      </div>
    </div>
  );
};

const MCQPanel = ({ question, onAnswer }: { question: Question; onAnswer: (answer: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  return (
    <div className="glass-strong rounded-2xl p-6 animate-slide-up">
      <div className="flex items-start gap-3 mb-6">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">MCQ</span>
        <span className={`px-3 py-1 ${difficultyConfig[question.difficulty].color}/20 text-xs font-medium rounded-full`}>{difficultyConfig[question.difficulty].emoji} {difficultyConfig[question.difficulty].label}</span>
      </div>
      <h3 className="text-xl font-medium text-white mb-6">{question.question}</h3>
      <div className="space-y-3">
        {question.options?.map((option, idx) => (
          <button key={idx} onClick={() => !isSubmitted && setSelected(idx)} className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${selected === idx ? "bg-purple-500/30 border-2 border-purple-500/50 scale-[1.02]" : "bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/20"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selected === idx ? "bg-purple-500 text-white" : "bg-white/10 text-white/60"}`}>{String.fromCharCode(65 + idx)}</div>
              <span className="text-white/90">{option}</span>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { if (selected !== null) { setIsSubmitted(true); setTimeout(() => { onAnswer(selected); setSelected(null); setIsSubmitted(false); }, 1500); }}} disabled={selected === null || isSubmitted} className={`mt-6 w-full py-3 rounded-xl font-medium transition-all ${selected !== null && !isSubmitted ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
        {isSubmitted ? "Submitting..." : "Submit Answer"}
      </button>
    </div>
  );
};

const Whiteboard = ({ question }: { question: Question }) => (
  <div className="glass-strong rounded-2xl overflow-hidden animate-slide-up">
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-3"><span className="text-lg">🎨</span><span className="text-white/70">Whiteboard</span></div>
      <div className="flex gap-2">
        {["⬜", "🔴", "🔵", "🟢", "🟡"].map((color, idx) => (<button key={idx} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">{color}</button>))}
        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 text-sm rounded-lg transition-all">Clear</button>
      </div>
    </div>
    <div className="px-4 py-3 bg-white/5 border-b border-white/10"><p className="text-white/80 text-sm">{question.question}</p></div>
    <div className="h-80 bg-white/5 cursor-crosshair relative">
      <div className="absolute inset-0 flex items-center justify-center text-white/20">
        <div className="text-center"><div className="text-4xl mb-2">✏️</div><p>Click and drag to draw</p></div>
      </div>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
    </div>
  </div>
);

const HintCard = ({ hint, onDismiss }: { hint: string; onDismiss: () => void }) => (
  <div className="glass rounded-2xl p-4 border-l-4 border-yellow-500 animate-slide-in-right">
    <div className="flex items-start gap-3">
      <span className="text-2xl">💡</span>
      <div className="flex-1"><h4 className="text-yellow-400 font-medium mb-1">Hint</h4><p className="text-white/70 text-sm">{hint}</p></div>
      <button onClick={onDismiss} className="text-white/40 hover:text-white/60 transition-colors">✕</button>
    </div>
  </div>
);

const FeedbackSidebar = ({ score, performance, questionsAnswered }: { score: number; performance: PerformanceLevel; questionsAnswered: number }) => {
  const performanceConfig = { struggling: { emoji: "😰", label: "Keep Going!", color: "text-orange-400" }, average: { emoji: "😊", label: "Good Progress", color: "text-blue-400" }, excellent: { emoji: "🌟", label: "Excellent!", color: "text-green-400" } };
  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6 animate-slide-in-right">
      <div className="text-center"><div className="text-5xl mb-2">{performanceConfig[performance].emoji}</div><div className={`text-lg font-medium ${performanceConfig[performance].color}`}>{performanceConfig[performance].label}</div></div>
      <div className="glass rounded-xl p-4"><div className="text-sm text-white/50 mb-1">Current Score</div><div className="text-3xl font-bold text-white">{score}</div></div>
      <div><div className="flex justify-between text-sm mb-2"><span className="text-white/50">Questions</span><span className="text-white">{questionsAnswered}/5</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 progress-bar" style={{ width: `${(questionsAnswered / 5) * 100}%` }} /></div></div>
      <div className="grid grid-cols-2 gap-3"><div className="glass rounded-xl p-3 text-center"><div className="text-2xl font-bold text-green-400">85%</div><div className="text-xs text-white/50">Accuracy</div></div><div className="glass rounded-xl p-3 text-center"><div className="text-2xl font-bold text-cyan-400">2:30</div><div className="text-xs text-white/50">Avg Time</div></div></div>
      <div className="pt-4 border-t border-white/10"><h4 className="text-sm text-white/50 mb-3">AI Suggestions</h4><div className="space-y-2"><div className="flex items-center gap-2 text-sm text-white/70"><span className="text-green-400">✓</span>Good problem breakdown</div><div className="flex items-center gap-2 text-sm text-white/70"><span className="text-yellow-400">!</span>Consider edge cases</div></div></div>
    </div>
  );
};

const RoleCard = ({ role, isSelected, onClick }: { role: InterviewRole; isSelected: boolean; onClick: () => void }) => {
  const config = roleConfig[role];
  return (
    <button onClick={onClick} className={`relative p-6 rounded-2xl text-left transition-all duration-500 card-hover ${isSelected ? `gradient-border ${config.glowColor}` : "glass hover:bg-white/10"}`}>
      <div className="relative z-10">
        <div className="text-4xl mb-4">{config.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{config.label}</h3>
        <p className="text-white/50 text-sm">{config.description}</p>
        {isSelected && <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-success"><span className="text-white text-sm">✓</span></div>}
      </div>
    </button>
  );
};

const DifficultySelector = ({ selected, onChange }: { selected: Difficulty; onChange: (d: Difficulty) => void }) => (
  <div className="flex gap-3 flex-wrap">
    {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => (
      <button key={diff} onClick={() => onChange(diff)} className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selected === diff ? `${difficultyConfig[diff].color} text-white scale-105` : "glass text-white/70 hover:text-white hover:bg-white/10"}`}>
        <span className="mr-2">{difficultyConfig[diff].emoji}</span>{difficultyConfig[diff].label}
      </button>
    ))}
  </div>
);

const AIMessage = ({ message }: { message: string }) => (
  <div className="flex gap-3 animate-slide-up">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0"><span className="text-lg">🤖</span></div>
    <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-md"><p className="text-white/90">{message}</p></div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SETUP SCREEN
// ═══════════════════════════════════════════════════════════════════════════

const SetupScreen = ({ state, onRoleSelect, onDifficultyChange, onStart, onBack }: { state: InterviewState; onRoleSelect: (role: InterviewRole) => void; onDifficultyChange: (d: Difficulty) => void; onStart: () => void; onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8">
    <div className="max-w-4xl w-full space-y-12">
      <button onClick={onBack} className="glass px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">← Back to Home</button>
      
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Configure Your Interview</h1>
        <p className="text-xl text-white/50">Customize your practice session to match your goals.</p>
      </div>
      
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xl font-medium text-white/80">Choose your interview track</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(roleConfig) as InterviewRole[]).map((role) => (<RoleCard key={role} role={role} isSelected={state.role === role} onClick={() => onRoleSelect(role)} />))}
        </div>
      </div>
      
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-xl font-medium text-white/80">Select difficulty level</h2>
        <DifficultySelector selected={state.difficulty} onChange={onDifficultyChange} />
      </div>
      
      <div className="flex justify-center animate-slide-up" style={{ animationDelay: "300ms" }}>
        <button onClick={onStart} disabled={!state.role} className={`relative px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ${state.role ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white animate-pulse-glow hover:scale-105" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
          {state.role ? <>Start Interview<span className="ml-2">→</span></> : "Select a track to begin"}
        </button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW SCREEN
// ═══════════════════════════════════════════════════════════════════════════

const InterviewScreen = ({ state, onAnswer, onEndInterview, onToggleHint }: { state: InterviewState; onAnswer: (answer: unknown) => void; onEndInterview: () => void; onToggleHint: () => void }) => {
  const questions = state.role ? sampleQuestions[state.role] : [];
  const currentQ = questions[state.currentQuestion % questions.length];
  
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div className="flex items-center gap-4">
          <button onClick={onEndInterview} className="glass px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">← Exit</button>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-2xl">{roleConfig[state.role!].icon}</span>
            <span className="text-white/80">{roleConfig[state.role!].label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyConfig[state.difficulty].color}`}>{difficultyConfig[state.difficulty].label}</span>
          </div>
        </div>
        <StressTimer timeRemaining={state.timeRemaining} totalTime={300} />
      </div>
      
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <AIMessage message={`Let's work on this ${currentQ.type === "mcq" ? "multiple choice" : currentQ.type} question. Take your time and think through your approach.`} />
          {currentQ.type === "mcq" && <MCQPanel question={currentQ} onAnswer={onAnswer} />}
          {currentQ.type === "coding" && <CodeEditor question={currentQ} onSubmit={onAnswer} />}
          {currentQ.type === "whiteboard" && <Whiteboard question={currentQ} />}
          {state.showHints && currentQ.hint && <HintCard hint={currentQ.hint} onDismiss={onToggleHint} />}
          <div className="flex gap-3 animate-slide-up">
            <button onClick={onToggleHint} className="glass px-4 py-2 rounded-xl text-yellow-400 hover:bg-yellow-500/10 transition-all flex items-center gap-2">💡 {state.showHints ? "Hide Hint" : "Show Hint"}</button>
            <button className="glass px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">🔄 Skip Question</button>
          </div>
        </div>
        <div className="w-80 shrink-0"><FeedbackSidebar score={state.score} performance={state.performance} questionsAnswered={state.currentQuestion} /></div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ role }: { role: InterviewRole }) => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <NeuralLoader text="Preparing your interview..." />
    <div className="mt-12 space-y-3 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
      <p className="text-white/50">Setting up {roleConfig[role].label} interview environment</p>
      <div className="flex items-center justify-center gap-2">
        <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "200ms" }} />
        <div className="w-4 h-4 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════

const LandingPage = ({ onStartClick }: { onStartClick: () => void }) => (
  <>
    <Header onStartClick={onStartClick} />
    <HeroSection onStartClick={onStartClick} />
    <FeaturesSection />
    <HowItWorksSection />
    <DemoSection />
    <TestimonialsSection />
    <ForCompaniesSection />
    <PricingSection />
    <CTASection onStartClick={onStartClick} />
    <Footer />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function InterviewPlatform() {
  const [state, setState] = useState<InterviewState>({
    role: null,
    difficulty: "medium",
    mode: "landing",
    currentQuestion: 0,
    score: 0,
    performance: "average",
    timeRemaining: 300,
    showHints: false,
    showExplanation: false,
    activeComponents: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (state.mode === "interview" && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        setState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.mode, state.timeRemaining]);
  
  const handleStartClick = useCallback(() => {
    setState(prev => ({ ...prev, mode: "setup" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  const handleRoleSelect = useCallback((role: InterviewRole) => {
    setState(prev => ({ ...prev, role }));
  }, []);
  
  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setState(prev => ({ ...prev, difficulty }));
  }, []);
  
  const handleStart = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setState(prev => ({ ...prev, mode: "interview" }));
    }, 2500);
  }, []);
  
  const handleAnswer = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      score: prev.score + 10,
      performance: prev.score > 30 ? "excellent" : prev.score > 15 ? "average" : "struggling",
      timeRemaining: 300,
    }));
  }, []);
  
  const handleEndInterview = useCallback(() => {
    setState(prev => ({ ...prev, mode: "landing", currentQuestion: 0, score: 0, timeRemaining: 300 }));
  }, []);
  
  const handleBack = useCallback(() => {
    setState(prev => ({ ...prev, mode: "landing" }));
  }, []);
  
  const handleToggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHints: !prev.showHints }));
  }, []);
  
  return (
    <div className="min-h-screen gradient-bg relative overflow-x-hidden noise">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {state.mode === "landing" && <LandingPage onStartClick={handleStartClick} />}
        
        {state.mode === "setup" && (
          <SetupScreen
            state={state}
            onRoleSelect={handleRoleSelect}
            onDifficultyChange={handleDifficultyChange}
            onStart={handleStart}
            onBack={handleBack}
          />
        )}
        
        {isLoading && state.role && <LoadingScreen role={state.role} />}
        
        {state.mode === "interview" && !isLoading && (
          <InterviewScreen
            state={state}
            onAnswer={handleAnswer}
            onEndInterview={handleEndInterview}
            onToggleHint={handleToggleHint}
          />
        )}
      </div>
    </div>
  );
}
