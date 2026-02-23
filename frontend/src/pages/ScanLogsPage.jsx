import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ScanLogsPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalScans: 0, lastScanned: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile/scan-logs')
      .then(r => {
        setLogs(r.data.logs || []);
        setStats({ totalScans: r.data.totalScans, lastScanned: r.data.lastScanned });
      })
      .finally(() => setLoading(false));
  }, []);

  const getRelativeTime = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getBrowserName = (ua = '') => {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox') || ua.includes('Gecko')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  const getDeviceType = (ua = '') => {
    if (ua.includes('Mobile') || ua.includes('Android')) return '📱 Mobile';
    if (ua.includes('Tablet') || ua.includes('iPad')) return '📟 Tablet';
    return '💻 Desktop';
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Scan History</h1>
        <p className="text-slate-400 mt-1">Every time your QR code was scanned</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="section-title">Total Scans</p>
          <p className="text-3xl font-bold font-mono text-crimson-400">{stats.totalScans}</p>
        </div>
        <div className="stat-card">
          <p className="section-title">This Week</p>
          <p className="text-3xl font-bold font-mono text-slate-200">
            {logs.filter(l => Date.now() - new Date(l.timestamp) < 7 * 86400000).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="section-title">Last Scan</p>
          <p className="text-sm text-slate-300 mt-1">
            {stats.lastScanned ? getRelativeTime(stats.lastScanned) : 'Never'}
          </p>
        </div>
      </div>

      {/* Logs */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading scan logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">📵</div>
          <h3 className="text-white font-semibold mb-2">No scans yet</h3>
          <p className="text-slate-400 text-sm">When someone scans your QR code, it will appear here</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-slate-700/50">
            <h2 className="font-semibold text-white">Recent Scans</h2>
            <p className="text-slate-500 text-xs mt-0.5">Showing last {logs.length} scans</p>
          </div>
          <div className="divide-y divide-slate-700/30">
            {logs.map((log, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-700/20 transition-colors">
                <div className="w-10 h-10 bg-crimson-600/15 border border-crimson-500/20 rounded-xl flex items-center justify-center text-crimson-400 text-lg flex-shrink-0">
                  🔍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium">QR Code Scanned</p>
                    {i === 0 && <span className="text-xs bg-crimson-600/20 text-crimson-400 px-2 py-0.5 rounded-full">Latest</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-slate-500 text-xs">{getDeviceType(log.userAgent)}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{getBrowserName(log.userAgent)}</span>
                    {log.ipAddress && (
                      <>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-slate-500 text-xs font-mono">{log.ipAddress}</span>
                      </>
                    )}
                    {log.location?.city && (
                      <>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-slate-500 text-xs">📍 {log.location.city}{log.location.country ? `, ${log.location.country}` : ''}</span>
                      </>
                    )}
                    {log.location?.lat && (
                      <>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-slate-500 text-xs">
                          📍 {log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-400 text-xs">{getRelativeTime(log.timestamp)}</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
