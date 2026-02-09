import Link from "next/link";

export default function PrivacyPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/50">Last updated: February 1, 2026</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 md:p-12 space-y-8">
          {[
            {
              title: "Information We Collect",
              content: "We collect information you provide directly: name, email, account details, and interview responses. We also automatically collect usage data, device information, and analytics cookies to improve our service.",
            },
            {
              title: "How We Use Your Data",
              content: "We use your data to provide and improve our services, personalize your experience, analyze usage patterns, and communicate with you. We use your interview responses to train and improve our AI models, but only in anonymized and aggregated form.",
            },
            {
              title: "Data Sharing",
              content: "We do not sell your personal data. We may share data with service providers (hosting, analytics), when required by law, or with your explicit consent. Interview responses are never shared with potential employers without your permission.",
            },
            {
              title: "Data Security",
              content: "We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and access controls. Your code submissions and interview data are stored securely.",
            },
            {
              title: "Your Rights",
              content: "You have the right to access, correct, or delete your personal data at any time. You can export your data, opt out of marketing emails, and request account deletion from your settings page.",
            },
            {
              title: "Cookies",
              content: "We use essential cookies for authentication and preferences, and optional analytics cookies to understand how you use our platform. You can control cookie settings in your browser.",
            },
            {
              title: "Data Retention",
              content: "We retain your data for as long as your account is active. After account deletion, we remove personal data within 30 days, though anonymized analytics data may be retained longer.",
            },
            {
              title: "Children's Privacy",
              content: "Our service is not intended for children under 16. We do not knowingly collect data from children. If we learn we have collected data from a child, we will delete it promptly.",
            },
            {
              title: "Changes to This Policy",
              content: "We may update this policy from time to time. We'll notify you of material changes via email or a notice on our platform.",
            },
            {
              title: "Contact Us",
              content: "For privacy-related questions, email us at privacy@interviewai.com or write to: InterviewAI, 123 Tech Lane, San Francisco, CA 94105.",
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-semibold text-white mb-2">{section.title}</h2>
              <p className="text-white/60 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
