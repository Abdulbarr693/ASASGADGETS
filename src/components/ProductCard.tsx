import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  BatteryCharging, 
  Star, 
  Check, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { Product, ConditionGrade } from '../types';
import { formatNaira } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const getConditionDetails = (condition: ConditionGrade) => {
  switch (condition) {
    case 'brand_new':
      return {
        label: 'Brand New Sealed',
        badgeClass: 'bg-blue-500/20 text-blue-400 dark:text-blue-300 border-blue-500/40',
        dotClass: 'bg-blue-400'
      };
    case 'refurbished_a':
      return {
        label: 'Grade A Pristine',
        badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40',
        dotClass: 'bg-emerald-400'
      };
    case 'refurbished_b':
      return {
        label: 'Grade B Excellent',
        badgeClass: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40',
        dotClass: 'bg-cyan-400'
      };
    case 'used_good':
      return {
        label: 'Used - Good',
        badgeClass: 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40',
        dotClass: 'bg-amber-400'
      };
    default:
      return {
        label: 'Certified',
        badgeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        dotClass: 'bg-slate-400'
      };
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isCompared,
  onToggleCompare,
  onQuickBuy
}) => {
  const { isDark } = useTheme();
  const cond = getConditionDetails(product.condition);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`group rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl relative border ${
        isDark 
          ? 'bg-[#1E293B] border-slate-700/60 hover:border-cyan-500/50 hover:shadow-slate-950/40 shadow-sm' 
          : 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-slate-200/80 shadow-xs'
      }`}
    >
      {/* Top Image Container with badges */}
      <div>
        <div className={`relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden mb-3.5 border ${
          isDark ? 'bg-[#0B1120] border-slate-700/60' : 'bg-slate-100 border-slate-200'
        }`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Condition Badge Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 backdrop-blur-md ${cond.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cond.dotClass}`} />
              {cond.label}
            </span>

            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-300 backdrop-blur-md">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Battery Health or Verification Top Right */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
            {product.batteryHealth ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-400" />
                {product.batteryHealth}%
              </span>
            ) : null}

            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono backdrop-blur-md flex items-center gap-1 border ${
              isDark 
                ? 'bg-[#0F172A]/90 text-cyan-300 border-slate-700' 
                : 'bg-white/95 text-cyan-700 border-slate-200 shadow-xs'
            }`}>
              <ShieldCheck className="w-3 h-3 text-cyan-500" />
              Verified SN
            </span>
          </div>

          {/* Hover Quick Action overlay */}
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
            <button
              onClick={() => onSelect(product)}
              className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>View Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vendor & Rating */}
        <div className={`flex items-center justify-between text-xs mb-1.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span className={`font-medium truncate max-w-[150px] ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {product.vendorName}
          </span>
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-mono text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.vendorRating}</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>({product.vendorSalesCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product)}
          className={`text-sm font-bold line-clamp-2 leading-snug cursor-pointer mb-2.5 transition-colors ${
            isDark 
              ? 'text-white group-hover:text-cyan-300' 
              : 'text-slate-900 group-hover:text-cyan-700'
          }`}
        >
          {product.title}
        </h3>

        {/* Specs Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
            isDark 
              ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            {product.specs.processor}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
            isDark 
              ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            {product.specs.ram} RAM
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
            isDark 
              ? 'bg-[#0B1120] border-slate-700/60 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            {product.specs.storage}
          </span>
        </div>
      </div>

      {/* Bottom Section: Pricing & Action Controls */}
      <div className={`pt-3 border-t space-y-3 ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        {/* Price Row in Nigerian Naira (₦) */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`text-xl font-extrabold font-mono tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {formatNaira(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className={`text-xs line-through font-mono ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {formatNaira(product.originalPrice)}
                </span>
              )}
            </div>
            <div className={`text-[10px] font-medium flex items-center gap-1 ${
              isDark ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              <ShieldCheck className="w-3 h-3" /> Escrow Protected
            </div>
          </div>

          {/* Warranty tag */}
          <div className="text-right">
            <span className={`text-[10px] font-mono ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {product.warrantyMonths}mo Warranty
            </span>
          </div>
        </div>

        {/* Action Controls: Compare Toggle & Buy Button */}
        <div className="grid grid-cols-2 gap-2">
          {/* Compare Button */}
          <button
            id={`btn-compare-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCompared
                ? isDark
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'bg-cyan-50 border-cyan-400 text-cyan-800 font-bold'
                : isDark
                  ? 'bg-[#0B1120] hover:bg-slate-800 border-slate-700/70 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
            {isCompared && <Check className="w-3 h-3 text-cyan-500 stroke-[3]" />}
          </button>

          {/* Buy with Escrow */}
          <button
            id={`btn-buy-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickBuy(product);
            }}
            className="py-2 px-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Buy Now</span>
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
