import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Shield, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 bg-crimson-600 rounded-xl flex items-center justify-center shadow-lg shadow-crimson-900/50 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-white fill-white animate-beat" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white">MediCard</span>
            <span className="font-display font-light text-lg text-crimson-500"> Pro</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-sm font-medium">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-sm font-medium">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-crimson-400 hover:bg-crimson-950/30 transition-all text-sm">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Get Card
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
