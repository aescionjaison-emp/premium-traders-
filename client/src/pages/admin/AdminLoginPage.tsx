import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error('Email and password are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.login({ email: email.trim(), password: password.trim() });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        success('Authenticated successfully');
        navigate('/admin');
        return;
      }
    } catch (err: any) {
      // Standalone CMS mode fallback
      if (email.trim().toLowerCase() === 'admin@showroom.com' && password.trim() === 'Admin@12345') {
        const demoUser = {
          _id: 'admin-standalone-01',
          name: 'Super Admin',
          email: 'admin@showroom.com',
          role: 'admin',
          avatar: '',
        };
        login('standalone_admin_token_2026', demoUser);
        success('Authenticated successfully (CMS Portal Active)');
        navigate('/admin');
        return;
      }
      error(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171615] text-[#FAF9F5] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#22211F] border border-showroom-charcoalLight/70 p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-showroom-bronze" />

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-showroom-bronze/10 text-showroom-bronze rounded-none border border-showroom-bronze/30 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            SECURE CMS ACCESS
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-white mt-1">
            SHOWROOM PORTAL
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Sign in to manage catalog, gallery, inquiries & homepage
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/70 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@showroom.com"
                className="w-full bg-[#171615] border border-showroom-charcoalLight px-3.5 py-2.5 pl-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-showroom-bronze"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/70 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#171615] border border-showroom-charcoalLight px-3.5 py-2.5 pl-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-showroom-bronze"
              />
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-architectural flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-showroom-charcoalLight/60 text-center">
          <div className="text-[11px] text-white/40 font-mono">
            Default credentials configured: <span className="text-showroom-bronze">admin@showroom.com / Admin@12345</span>
          </div>
        </div>
      </div>
    </div>
  );
};
