import { Link } from 'react-router-dom';

const features = [
  { icon: '🩸', title: 'Blood Group & Allergies', desc: 'Critical info displayed instantly for first responders' },
  { icon: '📱', title: 'QR Code Access', desc: 'Scan once, access complete medical history immediately' },
  { icon: '📞', title: 'Emergency Contacts', desc: 'One-tap calling to notify family and loved ones' },
  { icon: '🚨', title: 'SOS Alerts', desc: 'Automatically alert contacts when QR is scanned' },
  { icon: '🔒', title: 'Privacy First', desc: 'Only safe medical data shared, no personal identifiers' },
  { icon: '📍', title: 'Location Logging', desc: 'Know where your card was scanned and when' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 grid-bg overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-crimson-600 rounded-xl flex items-center justify-center animate-beat">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xl">MedCard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary py-2 px-5 text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-24 pb-20 text-center">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-crimson-600/10 border border-crimson-500/20 rounded-full px-4 py-1.5 text-crimson-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-crimson-500 rounded-full animate-pulse" />
            Available in emergencies — no login required
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your life-saving card,
            <br />
            <span className="text-crimson-500">always accessible.</span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            MedCard stores your critical medical data and generates a QR code first responders can scan instantly — no app, no login required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-4 px-8 glow-animation">
              Create Your Health Card
            </Link>
            <Link to="/login" className="btn-secondary text-base py-4 px-8">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Mock card preview */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-sm mx-auto float-animation">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-600 via-crimson-400 to-crimson-600" />
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Emergency Health Card</p>
                <h3 className="font-display text-xl font-bold text-white mt-1">John Anderson</h3>
              </div>
              <div className="badge-blood">A+</div>
            </div>

            <div className="heartbeat-line mb-4" />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900/60 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Allergies</p>
                <p className="text-amber-400 text-sm font-medium">Penicillin</p>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Conditions</p>
                <p className="text-blue-400 text-sm font-medium">Diabetes T2</p>
              </div>
            </div>

            <div className="bg-crimson-600/10 border border-crimson-500/20 rounded-lg p-3 flex items-center gap-3">
              <span className="text-crimson-400 text-lg">📞</span>
              <div>
                <p className="text-xs text-slate-500">Emergency Contact</p>
                <p className="text-white text-sm font-medium">Sarah Anderson · Wife</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 border-t border-slate-800/60">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Everything first responders need
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Built for emergencies. Designed for speed. Accessible when it matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 hover:border-slate-600/70 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 text-center border-t border-slate-800/60">
        <div className="glass-card max-w-2xl mx-auto p-12">
          <div className="w-16 h-16 bg-crimson-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="#f43f5e" className="w-8 h-8 animate-beat">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Be prepared for any emergency
          </h2>
          <p className="text-slate-400 mb-8">
            It takes less than 5 minutes to set up. Could save your life.
          </p>
          <Link to="/register" className="btn-primary text-base py-4 px-10 mx-auto inline-flex">
            Create Your Free Card →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-6 md:px-12 py-8 text-center text-slate-600 text-sm">
        <p>© 2025 MedCard. Your emergency health companion.</p>
      </footer>
    </div>
  );
}
