import { Link } from 'react-router-dom';
import { Heart, Shield, QrCode, Phone, Zap, Lock, Globe, ArrowRight, CheckCircle } from 'lucide-react';

const HeartbeatLine = () => (
  <svg viewBox="0 0 300 60" className="w-full h-12 opacity-30" fill="none">
    <polyline
      points="0,30 40,30 60,10 75,50 90,5 105,55 120,30 300,30"
      stroke="#ff2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="heartbeat-path"
    />
  </svg>
);

const features = [
  { icon: QrCode, title: 'Universal QR Code', desc: 'One scan reveals all critical medical info — no app required for emergency responders.' },
  { icon: Shield, title: 'Privacy-First Design', desc: 'Only emergency-safe data is public. Email, insurance, and sensitive info stays locked.' },
  { icon: Phone, title: 'One-Tap SOS', desc: 'Emergency contacts notified instantly with GPS location via SMS alert.' },
  { icon: Zap, title: 'Scan Analytics', desc: 'Track when and where your card was scanned. Know when help was sought.' },
  { icon: Lock, title: 'JWT Secured', desc: 'End-to-end security with industry-standard authentication and bcrypt encryption.' },
  { icon: Globe, title: 'Works Anywhere', desc: 'Mobile-optimized emergency page works offline-first and in any browser globally.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-crimson-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-crimson-950/60 border border-crimson-800/40 rounded-full px-4 py-1.5 text-crimson-400 text-sm font-medium mb-8">
            <Heart className="w-3.5 h-3.5 fill-crimson-500 text-crimson-500 animate-beat" />
            Smart Emergency Health Identity
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[1.05] mb-6">
            Your life,<br />
            <span className="text-crimson-500">one scan</span> away.
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            MediCard Pro gives first responders instant access to your blood type, allergies, medications, and emergency contacts — no internet, no app, no delay.
          </p>

          <HeartbeatLine />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 py-3.5 px-8 text-base">
              Create My Card — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 py-3.5 px-8 text-base">
              Sign In
            </Link>
          </div>

          <p className="text-slate-600 text-sm mt-6">No credit card required · Takes 2 minutes to set up</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[['3 sec', 'Avg scan time'], ['100%', 'No login required'], ['∞', 'Free forever']].map(([val, label]) => (
            <div key={label}>
              <div className="font-display text-4xl font-bold text-crimson-400 mb-1">{val}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center mb-4">Built for real emergencies</h2>
          <p className="text-slate-400 text-center mb-16 text-lg">Every feature designed around the critical moments that matter most</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:border-slate-600/50 transition-all duration-300 group">
                <div className="w-10 h-10 bg-crimson-950/60 border border-crimson-800/40 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-crimson-400" />
                </div>
                <h3 className="font-display font-semibold text-slate-200 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-16">How it works</h2>
          <div className="space-y-8">
            {[
              ['01', 'Create your account', 'Register in seconds. No credit card, no subscription.'],
              ['02', 'Fill your medical profile', 'Add blood type, allergies, medications, conditions, and emergency contacts.'],
              ['03', 'Get your QR code', 'Download and print your unique QR card. Stick it on your phone, wallet, or helmet.'],
              ['04', 'Emergency responders scan', 'Anyone can scan your code — no app needed. Instant access to critical data.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex items-start gap-6 text-left">
                <div className="flex-shrink-0 w-14 h-14 bg-crimson-950/60 border border-crimson-800/50 rounded-2xl flex items-center justify-center">
                  <span className="font-mono text-crimson-400 font-bold text-sm">{num}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-display font-semibold text-slate-200 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto card-red p-12 text-center">
          <Heart className="w-12 h-12 text-crimson-500 fill-crimson-600 mx-auto mb-6 animate-beat" />
          <h2 className="font-display text-3xl font-bold mb-4">Don't wait for an emergency to prepare</h2>
          <p className="text-slate-400 mb-8">It takes 2 minutes. It could save your life.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-base">
            Create My Emergency Card
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 text-center text-slate-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-crimson-700 fill-crimson-800" />
          <span className="font-display font-semibold text-slate-500">MediCard Pro</span>
        </div>
        <p>Built for emergencies. Designed for life.</p>
      </footer>
    </div>
  );
}
