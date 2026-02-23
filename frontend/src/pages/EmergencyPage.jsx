import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function EmergencyPage() {
  const { qrToken } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [scanLogged, setScanLogged] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [qrToken]);

  const loadProfile = async () => {
    try {
      // Try to get location for scan log
      let location = null;
      if (navigator.geolocation) {
        location = await new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            () => resolve(null),
            { timeout: 3000 }
          );
        });
      }

      // Log the scan
      if (!scanLogged) {
        api.post(`/scan/${qrToken}`, { location }).catch(() => {});
        setScanLogged(true);
      }

      const res = await api.get(`/emergency/${qrToken}`);
      setProfile(res.data.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerSOS = async () => {
    if (sosSent) return;
    setSosSending(true);
    try {
      let location = null;
      if (navigator.geolocation) {
        location = await new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            () => resolve(null),
            { timeout: 3000 }
          );
        });
      }
      
      const res = await api.post(`/emergency/${qrToken}/sos`, { location });
      setSosSent(true);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSosSending(false);
    }
  };

  const age = (dob) => {
    if (!dob) return null;
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 3600 * 1000));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-crimson-600/30 border-t-crimson-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading emergency data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="glass-card p-10 text-center max-w-sm">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Card Not Found</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    </div>
  );

  const primaryContact = profile?.emergencyContacts?.find(c => c.isPrimary) || profile?.emergencyContacts?.[0];

  return (
    <div className="min-h-screen bg-slate-950 grid-bg">
      {/* Emergency header banner */}
      <div className="bg-crimson-600 px-4 py-3 flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <p className="text-white font-bold text-sm tracking-wider uppercase">
          Emergency Medical Information
        </p>
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>

      <div className="max-w-lg mx-auto p-4 py-6 space-y-4 animate-fade-in">
        {/* Patient identity */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-700 via-crimson-400 to-crimson-700" />
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Patient</p>
              <h1 className="font-display text-3xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-slate-400 text-sm">
                {profile.dateOfBirth && (
                  <span>Age {age(profile.dateOfBirth)} · {new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                )}
                {profile.gender && profile.gender !== 'prefer_not_to_say' && (
                  <span className="capitalize">{profile.gender}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="badge-blood text-2xl">{profile.bloodGroup}</span>
              {profile.organDonor && (
                <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">♻ Organ Donor</span>
              )}
              {profile.dnrOrder && (
                <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">⚠ DNR</span>
              )}
            </div>
          </div>
        </div>

        {/* SOS Button */}
        {profile.emergencyContacts?.length > 0 && (
          <button
            onClick={triggerSOS}
            disabled={sosSent || sosSending}
            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              sosSent
                ? 'bg-emerald-600/20 border-2 border-emerald-500/30 text-emerald-400'
                : 'bg-crimson-600 hover:bg-crimson-700 text-white glow-animation active:scale-95'
            }`}
          >
            {sosSending ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending SOS...</>
            ) : sosSent ? (
              <><span>✓</span> SOS Alert Sent to {profile.emergencyContacts.length} Contact(s)</>
            ) : (
              <><span className="text-2xl animate-beat">🚨</span> SOS — Alert Emergency Contacts</>
            )}
          </button>
        )}

        {/* Allergies — CRITICAL, shown prominently */}
        {profile.allergies?.length > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h2 className="font-bold text-amber-400 text-lg uppercase tracking-wide">Allergies — Critical</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((a, i) => (
                <span key={i} className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold px-4 py-1.5 rounded-full text-sm">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medical conditions */}
        {profile.conditions?.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="section-title flex items-center gap-2">🏥 Medical Conditions</h2>
            <div className="flex flex-wrap gap-2">
              {profile.conditions.map((c, i) => (
                <span key={i} className="badge-condition text-sm font-medium">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        {profile.medications?.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="section-title flex items-center gap-2">💊 Current Medications</h2>
            <div className="space-y-3">
              {profile.medications.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3">
                  <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-xs font-bold">💊</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{m.name}</p>
                    <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                      {m.dosage && <span>{m.dosage}</span>}
                      {m.frequency && <span>· {m.frequency}</span>}
                      {m.prescribedFor && <span>· for {m.prescribedFor}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency contacts with call buttons */}
        {profile.emergencyContacts?.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="section-title flex items-center gap-2">📞 Emergency Contacts</h2>
            <div className="space-y-3">
              {profile.emergencyContacts.map((c, i) => (
                <div key={i} className="bg-crimson-600/10 border border-crimson-500/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-crimson-600/20 rounded-full flex items-center justify-center text-crimson-400 font-bold">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{c.name}</p>
                        <p className="text-slate-400 text-sm">{c.relationship}</p>
                        <p className="text-slate-300 text-sm font-mono mt-0.5">{c.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={`tel:${c.phone}`}
                        className="bg-crimson-600 hover:bg-crimson-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95">
                        📞 Call
                      </a>
                      {c.email && (
                        <a href={`mailto:${c.email}`}
                          className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all text-center justify-center">
                          ✉ Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor info */}
        {profile.primaryPhysician?.name && (
          <div className="glass-card p-5">
            <h2 className="section-title">👨‍⚕️ Primary Physician</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{profile.primaryPhysician.name}</p>
                {profile.primaryPhysician.phone && (
                  <p className="text-slate-400 text-sm font-mono">{profile.primaryPhysician.phone}</p>
                )}
              </div>
              {profile.primaryPhysician.phone && (
                <a href={`tel:${profile.primaryPhysician.phone}`}
                  className="btn-secondary py-2 px-4 text-sm">
                  📞 Call
                </a>
              )}
            </div>
          </div>
        )}

        {/* Insurance */}
        {profile.insuranceProvider && (
          <div className="glass-card p-5">
            <h2 className="section-title">🏥 Insurance</h2>
            <p className="text-white font-medium">{profile.insuranceProvider}</p>
            {profile.insurancePolicyNumber && (
              <p className="text-slate-400 text-sm font-mono mt-1">Policy: {profile.insurancePolicyNumber}</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 bg-crimson-600 rounded-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-slate-500 text-xs">MedCard Emergency Health System</span>
          </div>
          <p className="text-slate-600 text-xs">Scanned {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
