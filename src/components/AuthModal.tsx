import React, { useState } from 'react';
import { Shield, User as UserIcon, Store, Lock, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AsgLogo } from './AsgLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLogin: (user: User) => void;
}

export const DEMO_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'Admin Supervisor',
    email: 'admin@asasgadgets.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-seller-01',
    name: 'ApexTech Renewed (Seller)',
    email: 'apex_tech@vendors.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    vendorId: 'ven-01'
  },
  {
    id: 'usr-buyer-01',
    name: 'Alex Mercer (Buyer)',
    email: 'alex.buyer@gmail.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin
}) => {
  const { isDark } = useTheme();
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    const user: User = {
      id: `usr-${Date.now()}`,
      email: customEmail,
      name: customName || customEmail.split('@')[0],
      role: selectedRole,
      avatar: selectedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : selectedRole === 'seller'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      vendorId: selectedRole === 'seller' ? 'ven-01' : undefined
    };

    onLogin(user);
    onClose();
  };

  const selectDemoUser = (user: User) => {
    onLogin(user);
    onClose();
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        id="auth-modal-card" 
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative border transition-colors ${
          isDark 
            ? 'bg-[#1E293B] border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button 
          id="btn-close-auth-modal"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <AsgLogo size="sm" showText={false} />
          <div>
            <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Marketplace Sign In</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Access buyer escrow, seller portal, or admin control</p>
          </div>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
            Instant Demo Sign-In (1-Click)
          </div>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => {
              const isCurrent = currentUser.id === user.id;
              return (
                <button
                  key={user.id}
                  id={`btn-demo-user-${user.role}`}
                  onClick={() => selectDemoUser(user)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isCurrent 
                      ? (isDark ? 'border-cyan-500 bg-[#0B1120] text-white shadow-sm shadow-cyan-500/20' : 'border-cyan-500 bg-cyan-50/50 text-slate-900 shadow-sm') 
                      : (isDark ? 'border-slate-700/70 hover:border-slate-600 bg-[#0B1120]/70 text-slate-300 hover:text-white' : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:text-slate-900')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className={`w-9 h-9 rounded-full object-cover border ${isDark ? 'border-slate-700' : 'border-slate-200'}`} 
                    />
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {user.name}
                        {user.role === 'admin' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                            ADMIN
                          </span>
                        )}
                        {user.role === 'seller' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            SELLER
                          </span>
                        )}
                        {user.role === 'buyer' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                            BUYER
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</div>
                    </div>
                  </div>
                  {isCurrent ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className={`flex-1 h-px ${isDark ? 'bg-slate-700/80' : 'bg-slate-200'}`} />
          <span className={`text-xs uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Or Custom Sign In</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-slate-700/80' : 'bg-slate-200'}`} />
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {/* Role selector tab */}
          <div className={`grid grid-cols-3 gap-1 p-1 border rounded-xl ${
            isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setSelectedRole('buyer')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'buyer' 
                  ? 'bg-cyan-500 text-slate-950 font-bold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" /> Buyer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'seller' 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Seller
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'admin' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jordan Tech"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder={selectedRole === 'admin' ? 'admin@asasgadgets.com' : 'user@example.com'}
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500 ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            type="submit"
            id="btn-submit-auth"
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Log In as {selectedRole.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
};
