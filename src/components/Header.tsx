import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Layers, 
  Store, 
  SlidersHorizontal, 
  Shield, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AsgLogo } from './AsgLogo';

interface HeaderProps {
  currentView: 'buyer' | 'seller' | 'admin';
  setCurrentView: (view: 'buyer' | 'seller' | 'admin') => void;
  currentUser: User;
  onOpenAuth: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  totalOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  comparisonCount,
  onOpenComparison,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isDark 
        ? 'bg-[#0F172A]/95 border-slate-800/80 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Top micro trust ticker */}
      <div className={`border-b px-4 py-1.5 text-xs transition-colors ${
        isDark 
          ? 'bg-[#1E293B]/70 border-slate-800/80 text-slate-400' 
          : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className={`flex items-center gap-1 font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Protection Guarantee
            </span>
            <span className={isDark ? 'text-slate-600 hidden sm:inline' : 'text-slate-300 hidden sm:inline'}>•</span>
            <span className={`hidden sm:inline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              48-Hour Buyer Inspection Window
            </span>
            <span className={isDark ? 'text-slate-600 hidden md:inline' : 'text-slate-300 hidden md:inline'}>•</span>
            <span className={`hidden md:inline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Swappa-Style Serial & IMEI Fraud Verification
            </span>
            <span className={isDark ? 'text-slate-600 hidden lg:inline' : 'text-slate-300 hidden lg:inline'}>•</span>
            <span className={`hidden lg:inline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Prices in Nigerian Naira (₦)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Active Role:</span>
            <button
              onClick={onOpenAuth}
              className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                currentUser.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-400 dark:text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                  : currentUser.role === 'seller'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              {currentUser.role}
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo: "AS" with inscribed "G" */}
        <div className="flex items-center gap-6">
          <button 
            id="logo-brand-btn"
            onClick={() => setCurrentView('buyer')}
            className="flex items-center text-left group cursor-pointer focus:outline-none"
            aria-label="ASASGADGETS Home"
          >
            <AsgLogo size="md" showText={true} />
          </button>

          {/* View Mode Switcher tabs */}
          <div className={`hidden md:flex items-center border p-1 rounded-xl shadow-xs transition-colors ${
            isDark ? 'bg-[#1E293B] border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              id="nav-tab-buyer"
              onClick={() => setCurrentView('buyer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'buyer'
                  ? isDark 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30' 
                    : 'bg-white text-cyan-700 shadow-sm border border-slate-200/80 font-bold'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Buyer View
            </button>

            <button
              id="nav-tab-seller"
              onClick={() => setCurrentView('seller')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'seller'
                  ? isDark 
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30' 
                    : 'bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-bold'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Seller Portal
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? isDark 
                    ? 'bg-purple-500 text-white shadow-sm shadow-purple-500/30' 
                    : 'bg-white text-purple-700 shadow-sm border border-slate-200/80 font-bold'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin Panel
            </button>
          </div>
        </div>

        {/* Global Search Bar (prominent in Buyer view) */}
        <div className="flex-1 max-w-lg hidden sm:block relative">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-3 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`} />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search gadgets, UPC, chips (e.g. M3 Max, S24 Ultra, OLED)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-9 py-2 text-xs transition-colors focus:outline-none ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 hover:border-slate-600 focus:border-cyan-500 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 focus:border-cyan-500 focus:bg-white text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-2.5 text-xs ${
                  isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Theme Switcher, Compare Dock Trigger, User Account & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* THEME TOGGLE BUTTON */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isDark 
                ? 'bg-[#1E293B] border-slate-700/70 text-amber-300 hover:text-amber-200 hover:border-amber-400/40 hover:bg-[#253248]' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white shadow-xs'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="text-[11px] font-medium hidden xl:inline text-slate-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium hidden xl:inline text-slate-700">Dark</span>
              </>
            )}
          </button>

          {/* Compare Button */}
          <button
            id="header-compare-btn"
            onClick={onOpenComparison}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              comparisonCount > 0
                ? isDark
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-xs'
                : isDark
                  ? 'bg-[#1E293B] border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-600'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Layers className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <span className="hidden sm:inline">Compare</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              comparisonCount > 0 
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-600 text-white' 
                : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
            }`}>
              {comparisonCount}
            </span>
          </button>

          {/* User Account / Auth Switcher */}
          <div className="flex items-center gap-2">
            <button
              id="header-user-profile-btn"
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors text-left cursor-pointer ${
                isDark 
                  ? 'bg-[#1E293B] border-slate-700/70 hover:border-slate-600' 
                  : 'bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-400/40"
              />
              <div className="hidden lg:block text-left">
                <div className={`text-xs font-semibold leading-tight flex items-center gap-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentUser.name}
                </div>
                <div className={`text-[10px] leading-tight ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {currentUser.role.toUpperCase()}
                </div>
              </div>
            </button>

            <button
              id="header-logout-btn"
              onClick={onLogout}
              title="Sign Out / Switch"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#1E293B] border-slate-700/70 text-slate-400 hover:text-rose-400 hover:border-rose-500/40' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view switcher strip */}
      <div className={`flex md:hidden border-t px-4 py-2 justify-between items-center ${
        isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-1 w-full justify-around text-xs">
          <button
            onClick={() => setCurrentView('buyer')}
            className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
              currentView === 'buyer' 
                ? 'bg-cyan-500 text-slate-950 font-bold' 
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Buyer
          </button>
          <button
            onClick={() => setCurrentView('seller')}
            className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
              currentView === 'seller' 
                ? 'bg-emerald-500 text-slate-950 font-bold' 
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Seller Portal
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
              currentView === 'admin' 
                ? 'bg-purple-500 text-white font-bold' 
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
};
