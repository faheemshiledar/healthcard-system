import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function QRCardPage() {
  const { user, fetchUser } = useAuth();
  const qrRef = useRef();
  const [refreshing, setRefreshing] = useState(false);

  const emergencyUrl = `${window.location.origin}/emergency/${user?.qrToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(emergencyUrl);
    toast.success('Emergency link copied!');
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    canvas.width = 500;
    canvas.height = 500;
    img.onload = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      const a = document.createElement('a');
      a.download = `medcard-qr-${user.firstName}-${user.lastName}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const refreshQR = async () => {
    if (!confirm('Refreshing will invalidate your current QR code. Old printed cards will stop working. Continue?')) return;
    setRefreshing(true);
    try {
      await api.post('/auth/refresh-qr');
      await fetchUser();
      toast.success('QR code refreshed! Print a new card.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const printCard = () => window.print();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Emergency Card</h1>
        <p className="text-slate-400 mt-1">Print this card and carry it with you. Scan to view your health data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code panel */}
        <div className="glass-card p-8 flex flex-col items-center gap-6">
          <p className="text-slate-400 text-sm text-center">
            Anyone who scans this QR code will see your emergency health data — no login required.
          </p>
          
          <div ref={qrRef} className="bg-white p-5 rounded-2xl shadow-2xl">
            <QRCodeSVG
              value={emergencyUrl}
              size={220}
              level="H"
              imageSettings={{
                src: '', // Could add logo here
                height: 0,
                width: 0,
                excavate: false,
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-xs font-mono break-all">{emergencyUrl}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={copyLink} className="btn-secondary py-2 px-4 text-sm">📋 Copy Link</button>
            <button onClick={downloadQR} className="btn-secondary py-2 px-4 text-sm">⬇️ Download QR</button>
            <button onClick={printCard} className="btn-secondary py-2 px-4 text-sm">🖨️ Print Card</button>
          </div>

          <button onClick={refreshQR} disabled={refreshing}
            className="text-xs text-slate-500 hover:text-crimson-400 transition-colors">
            {refreshing ? 'Refreshing...' : '↺ Invalidate & regenerate QR code'}
          </button>
        </div>

        {/* Preview card */}
        <div id="print-card" className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-700 via-crimson-400 to-crimson-700" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-crimson-600/5 rounded-full blur-2xl" />
          
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Emergency Health Card</p>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                {user?.firstName} {user?.lastName}
              </h2>
              {user?.dateOfBirth && (
                <p className="text-slate-400 text-sm mt-0.5">
                  DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className="badge-blood text-xl">{user?.bloodGroup || '?'}</span>
          </div>

          <div className="heartbeat-line mb-5" />

          {/* Allergies */}
          {user?.allergies?.length > 0 && (
            <div className="mb-4">
              <p className="section-title flex items-center gap-1">⚠️ Allergies</p>
              <div className="flex flex-wrap gap-1.5">
                {user.allergies.map((a, i) => <span key={i} className="badge-allergy">{a}</span>)}
              </div>
            </div>
          )}

          {/* Conditions */}
          {user?.conditions?.length > 0 && (
            <div className="mb-4">
              <p className="section-title">Conditions</p>
              <div className="flex flex-wrap gap-1.5">
                {user.conditions.map((c, i) => <span key={i} className="badge-condition">{c}</span>)}
              </div>
            </div>
          )}

          {/* Medications */}
          {user?.medications?.length > 0 && (
            <div className="mb-4">
              <p className="section-title">Medications</p>
              <div className="flex flex-wrap gap-1.5">
                {user.medications.map((m, i) => (
                  <span key={i} className="badge-medication">{m.name} {m.dosage && `· ${m.dosage}`}</span>
                ))}
              </div>
            </div>
          )}

          {/* DNR / Organ donor */}
          {(user?.organDonor || user?.dnrOrder) && (
            <div className="flex gap-2 mb-4">
              {user.organDonor && <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">♻ Organ Donor</span>}
              {user.dnrOrder && <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full">⚠ DNR Order</span>}
            </div>
          )}

          {/* Emergency contacts */}
          {user?.emergencyContacts?.length > 0 && (
            <div>
              <p className="section-title">Emergency Contacts</p>
              <div className="space-y-2">
                {user.emergencyContacts.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-crimson-600/10 border border-crimson-500/20 rounded-lg px-3 py-2">
                    <div className="w-7 h-7 bg-crimson-600/20 rounded-full flex items-center justify-center text-crimson-400 text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium leading-none">{c.name}</p>
                      <p className="text-slate-500 text-xs">{c.relationship} · {c.phone}</p>
                    </div>
                    {c.isPrimary && <span className="text-xs text-crimson-400 font-medium">Primary</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR mini */}
          <div className="mt-5 pt-5 border-t border-slate-700/50 flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG value={emergencyUrl} size={56} level="M" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Scan for full details</p>
              <p className="text-slate-500 text-xs mt-0.5">No app required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles injected */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-card { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
