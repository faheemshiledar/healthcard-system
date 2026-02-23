import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [scanStats, setScanStats] = useState(null);

  useEffect(() => {
    api.get('/profile/scan-logs').then(r => setScanStats(r.data)).catch(() => {});
  }, []);

  const profileCompletion = () => {
    if (!user) return 0;
    let score = 0;
    const checks = [
      user.bloodGroup && user.bloodGroup !== 'Unknown',
      user.allergies?.length > 0,
      user.conditions?.length > 0,
      user.medications?.length > 0,
      user.emergencyContacts?.length > 0,
      user.dateOfBirth,
      user.primaryPhysician?.name,
    ];
    checks.forEach(c => c && score++);
    return Math.round((score / checks.length) * 100);
  };

  const completion = profileCompletion();
  const completionColor = completion < 40 ? 'text-crimson-400' : completion < 70 ? 'text-amber-400' : 'text-emerald-400';

  const quickActions = [
    { to: '/profile', icon: '✏️', label: 'Update Profile', desc: 'Add allergies, conditions, medications' },
    { to: '/my-card', icon: '⬛', label: 'View QR Card', desc: 'Download or share your health card' },
    { to: '/scan-logs', icon: '📊', label: 'Scan History', desc: 'See who scanned your card and when' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">
          Good to see you, {user?.firstName}
        </h1>
        <p className="text-slate-400 mt-1">Your emergency health card is ready to use</p>
      </div>

      {/* Alert: incomplete profile */}
      {completion < 70 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-amber-400 font-semibold">Profile {completion}% complete</h3>
            <p className="text-slate-400 text-sm mt-1">
              Add your blood group, allergies, and emergency contacts so first responders have the info they need.
            </p>
          </div>
          <Link to="/profile" className="btn-primary py-2 px-4 text-sm bg-amber-600/80 hover:bg-amber-600 whitespace-nowrap">
            Complete Now
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="section-title">Blood Group</p>
          <span className="badge-blood text-xl">{user?.bloodGroup || '?'}</span>
        </div>
        <div className="stat-card">
          <p className="section-title">Allergies</p>
          <p className={`text-2xl font-bold font-mono ${user?.allergies?.length ? 'text-amber-400' : 'text-slate-500'}`}>
            {user?.allergies?.length || 0}
          </p>
          <p className="text-slate-500 text-xs">recorded</p>
        </div>
        <div className="stat-card">
          <p className="section-title">QR Scans</p>
          <p className="text-2xl font-bold font-mono text-crimson-400">
            {scanStats?.totalScans ?? '–'}
          </p>
          <p className="text-slate-500 text-xs">total scans</p>
        </div>
        <div className="stat-card">
          <p className="section-title">Completeness</p>
          <p className={`text-2xl font-bold font-mono ${completionColor}`}>{completion}%</p>
          <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
            <div
              className={`h-full rounded-full transition-all ${completion < 40 ? 'bg-crimson-500' : completion < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(a => (
            <Link
              key={a.to}
              to={a.to}
              className="glass-card p-5 hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className="text-white font-semibold group-hover:text-crimson-400 transition-colors">{a.label}</h3>
              <p className="text-slate-400 text-sm mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Emergency data preview */}
      <div>
        <h2 className="font-display text-xl font-bold text-white mb-4">Emergency Data Preview</h2>
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="section-title">Allergies</p>
              {user?.allergies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.allergies.map((a, i) => <span key={i} className="badge-allergy">⚠ {a}</span>)}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">None recorded</p>
              )}
            </div>
            <div>
              <p className="section-title">Conditions</p>
              {user?.conditions?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.conditions.map((c, i) => <span key={i} className="badge-condition">{c}</span>)}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">None recorded</p>
              )}
            </div>
            <div>
              <p className="section-title">Emergency Contacts</p>
              {user?.emergencyContacts?.length ? (
                <div className="space-y-2">
                  {user.emergencyContacts.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-crimson-600/20 rounded-full flex items-center justify-center text-xs text-crimson-400">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm leading-none">{c.name}</p>
                        <p className="text-slate-500 text-xs">{c.relationship}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">None added</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Last scan */}
      {scanStats?.lastScanned && (
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-700/60 rounded-xl flex items-center justify-center text-xl">📍</div>
          <div>
            <p className="text-white font-medium text-sm">Last QR scan</p>
            <p className="text-slate-400 text-xs">
              {new Date(scanStats.lastScanned).toLocaleString('en-US', {
                dateStyle: 'medium', timeStyle: 'short'
              })}
            </p>
          </div>
          <Link to="/scan-logs" className="ml-auto btn-ghost text-sm text-crimson-400">
            View all →
          </Link>
        </div>
      )}
    </div>
  );
}
