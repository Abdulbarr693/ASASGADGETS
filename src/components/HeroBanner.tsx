import React from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  ArrowUpRight, 
  BadgePercent, 
  Check, 
  Sparkles,
  Search
} from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatNaira } from '../utils/currency';

interface HeroBannerProps {
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onSelectProduct,
  featuredProducts,
}) => {
  const { isDark } = useTheme();
  const spotlight = featuredProducts[0];

  return (
    <div className={`relative overflow-hidden transition-colors border-b pt-8 pb-10 px-4 ${
      isDark 
        ? 'bg-gradient-to-b from-[#1E293B]/40 via-[#0F172A] to-[#0F172A] border-slate-800/80' 
        : 'bg-gradient-to-b from-slate-100 via-slate-50 to-white border-slate-200'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Next-Gen Verified Electronics Marketplace</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Buy & Sell Gadgets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500">Zero Fraud Risk</span>.
            </h1>

            <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Every device is inspected with cryptographic serial verification, battery health certification, and a <strong className={isDark ? 'text-cyan-300' : 'text-cyan-700'}>48-hour neutral escrow hold</strong>. No fake listings, no refurbished surprises.
            </p>

            {/* Category Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className={`text-xs font-semibold uppercase tracking-wider mr-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>Trending:</span>
              <button
                id="hero-cat-smartphones"
                onClick={() => onSelectCategory('smartphones')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#1E293B] border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-500" /> Smartphones
              </button>
              <button
                id="hero-cat-laptops"
                onClick={() => onSelectCategory('laptops')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#1E293B] border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-blue-500" /> Laptops
              </button>
              <button
                id="hero-cat-audio"
                onClick={() => onSelectCategory('audio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#1E293B] border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-500" /> Audio & ANC
              </button>
              <button
                id="hero-cat-accessories"
                onClick={() => onSelectCategory('accessories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#1E293B] border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-purple-500" /> Accessories & Gear
              </button>
            </div>

            {/* Escrow Trust Pillars */}
            <div className={`grid grid-cols-3 gap-3 pt-4 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                isDark ? 'bg-[#1E293B]/40 border-slate-800/80' : 'bg-white/80 border-slate-200 shadow-xs'
              }`}>
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Escrow Secured</div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Seller paid only after inspection</div>
                </div>
              </div>

              <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                isDark ? 'bg-[#1E293B]/40 border-slate-800/80' : 'bg-white/80 border-slate-200 shadow-xs'
              }`}>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Clean Serial/IMEI</div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Blacklist & lock checked</div>
                </div>
              </div>

              <div className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                isDark ? 'bg-[#1E293B]/40 border-slate-800/80' : 'bg-white/80 border-slate-200 shadow-xs'
              }`}>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 mt-0.5 shrink-0">
                  <BadgePercent className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Verified Deals</div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Direct certified vendor pricing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Trending Spotlight Gadget Card */}
          <div className="lg:col-span-5">
            {spotlight ? (
              <div 
                id="hero-spotlight-card"
                onClick={() => onSelectProduct(spotlight)}
                className={`border rounded-2xl p-5 shadow-2xl relative group cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-[#1E293B] border-slate-700/70 hover:border-cyan-400/60' 
                    : 'bg-white border-slate-200 hover:border-cyan-500 shadow-slate-200/50'
                }`}
              >
                {/* Spotlight Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Trending Flagship
                  </span>
                  <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400 font-semibold">
                    {spotlight.condition === 'refurbished_a' ? 'Grade A Pristine' : 'Brand New'}
                  </span>
                </div>

                {/* Image Preview with Glow */}
                <div className={`relative aspect-video rounded-xl overflow-hidden border mb-4 group-hover:scale-[1.01] transition-transform ${
                  isDark ? 'bg-[#0B1120] border-slate-700/60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <img
                    src={spotlight.images[0]}
                    alt={spotlight.title}
                    className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                  />
                  <div className={`absolute bottom-2 left-2 backdrop-blur-md px-2 py-1 rounded-lg border text-[11px] font-mono ${
                    isDark 
                      ? 'bg-[#0F172A]/90 border-slate-700 text-slate-300' 
                      : 'bg-white/90 border-slate-200 text-slate-700'
                  }`}>
                    SN: {spotlight.serialNumber.slice(0, 16)}...
                  </div>
                  {spotlight.batteryHealth && (
                    <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[11px] font-bold font-mono">
                      ⚡ {spotlight.batteryHealth}% Battery
                    </div>
                  )}
                </div>

                {/* Title & Key specs */}
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold transition-colors line-clamp-1 ${
                    isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'
                  }`}>
                    {spotlight.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className={`px-2 py-0.5 rounded border ${
                      isDark 
                        ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {spotlight.specs.processor}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      isDark 
                        ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {spotlight.specs.ram} RAM
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      isDark 
                        ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {spotlight.specs.storage} SSD
                    </span>
                  </div>

                  {/* Vendor & Price */}
                  <div className={`flex items-end justify-between pt-3 border-t ${
                    isDark ? 'border-slate-700/70' : 'border-slate-200'
                  }`}>
                    <div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Seller:</div>
                      <div className={`text-xs font-semibold flex items-center gap-1 ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {spotlight.vendorName}
                        <span className="text-amber-500 text-[10px]">★ {spotlight.vendorRating}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {spotlight.originalPrice && (
                        <div className={`text-xs line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {formatNaira(spotlight.originalPrice)}
                        </div>
                      )}
                      <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                        {formatNaira(spotlight.price)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Inspect Specs & Escrow Terms</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};
