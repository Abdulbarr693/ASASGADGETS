import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  BatteryCharging, 
  Layers, 
  Star, 
  Zap, 
  Check, 
  Cpu, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { getConditionDetails } from './ProductCard';
import { formatNaira } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isCompared,
  onToggleCompare,
  onBuy,
}) => {
  const { isDark } = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const cond = getConditionDetails(product.condition);

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div 
        id="product-detail-modal-card"
        className={`border w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all ${
          isDark 
            ? 'bg-[#0F172A] border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header Bar */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700/80 bg-[#1E293B]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            <span className={`uppercase tracking-wider font-semibold font-mono ${
              isDark ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              {product.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={`font-medium truncate max-w-[280px] sm:max-w-md ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {product.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
            }`}
            aria-label="Close details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className={`overflow-y-auto p-4 sm:p-6 space-y-6 ${
          isDark ? 'bg-[#0F172A]' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Main high-res view */}
              <div className={`relative aspect-square rounded-2xl overflow-hidden border ${
                isDark ? 'bg-[#0B1120] border-slate-700/60' : 'bg-slate-100 border-slate-200'
              }`}>
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Condition Pill */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 ${cond.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${cond.dotClass}`} />
                    {cond.label}
                  </span>
                </div>

                {/* Battery Health badge */}
                {product.batteryHealth && (
                  <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    {product.batteryHealth}% Battery Health
                  </div>
                )}
              </div>

              {/* Thumbnail row */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-cyan-400 shadow-md shadow-cyan-500/30'
                          : isDark ? 'border-slate-700/70 opacity-60 hover:opacity-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Swappa-Style Serial Verification Badge */}
              <div className={`p-3.5 border rounded-xl space-y-1.5 ${
                isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium flex items-center gap-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-cyan-500" />
                    Hardware Serial Protection
                  </span>
                  <span className="text-emerald-500 font-bold font-mono text-[11px] flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> VERIFIED
                  </span>
                </div>
                <div className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border truncate ${
                  isDark 
                    ? 'text-cyan-300 bg-[#0B1120] border-slate-700/60' 
                    : 'text-cyan-800 bg-white border-slate-200'
                }`}>
                  {product.serialNumber}
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  IMEI/Serial checked against international lost/stolen registry and carrier blacklist.
                </p>
              </div>
            </div>

            {/* Product Details & Actions Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className={`flex items-center gap-2 text-xs mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>Brand: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{product.brand}</strong></span>
                  <span>•</span>
                  <span>Model: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{product.model}</strong></span>
                  <span>•</span>
                  <span>UPC: <span className="font-mono">{product.upc}</span></span>
                </div>

                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {product.title}
                </h1>
              </div>

              {/* Condition Diagnostic Card */}
              <div className={`p-3.5 border rounded-xl space-y-1 ${
                isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-bold flex items-center gap-1 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Condition Report & Diagnostics</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {product.conditionDescription}
                </p>
              </div>

              {/* Pricing & Escrow Box in Naira */}
              <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-xs mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Direct Verified Price</div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-3xl font-extrabold font-mono ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formatNaira(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className={`text-sm line-through font-mono ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        MSRP {formatNaira(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs flex items-center gap-1 mt-1 font-medium ${
                    isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> 48-Hour Inspection Escrow Guarantee
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCompared
                        ? isDark ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-cyan-100 border-cyan-400 text-cyan-900'
                        : isDark ? 'bg-[#0B1120] hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-cyan-500" />
                    <span>{isCompared ? 'In Compare Dock' : 'Add to Compare'}</span>
                  </button>

                  <button
                    id="btn-buy-modal-action"
                    onClick={() => {
                      onClose();
                      onBuy(product);
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Buy with Escrow</span>
                  </button>
                </div>
              </div>

              {/* Seller Trust Profile */}
              <div className={`p-3.5 border rounded-xl flex items-center justify-between text-xs ${
                isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold ${
                    isDark ? 'bg-[#0B1120] border-slate-700 text-cyan-400' : 'bg-white border-slate-300 text-cyan-700'
                  }`}>
                    {product.vendorName.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span>{product.vendorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold">
                        VERIFIED SELLER
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 mt-0.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span className="text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> {product.vendorRating}
                      </span>
                      <span>•</span>
                      <span>{product.vendorSalesCount} Orders Delivered</span>
                    </div>
                  </div>
                </div>

                <div className={`text-right hidden sm:block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <div className={`text-[11px] font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{product.warrantyMonths} Months Warranty</div>
                  <div className="text-[10px]">30-Day Seller Returns</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Product Overview
                </h4>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {product.description}
                </p>
              </div>

            </div>
          </div>

          {/* Full Technical Spec Sheet Table */}
          <div className={`space-y-3 pt-4 border-t ${
            isDark ? 'border-slate-700/80' : 'border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Cpu className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span>Full Technical Spec Sheet</span>
            </h3>

            <div className={`border rounded-xl overflow-hidden ${
              isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-white border-slate-200'
            }`}>
              <table className="w-full text-xs">
                <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-200'}`}>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`w-1/3 p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Processor / Chip</td>
                    <td className={`w-2/3 p-3 font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.processor}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>RAM Memory</td>
                    <td className={`p-3 font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.ram}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Storage Capacity</td>
                    <td className={`p-3 font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.storage}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Display</td>
                    <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.display}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Battery Specifications</td>
                    <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.battery}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Operating System</td>
                    <td className={`p-3 font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.os}</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Connectivity & Wireless</td>
                    <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.connectivity}</td>
                  </tr>
                  {product.specs.camera && (
                    <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                      <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Camera System</td>
                      <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.camera}</td>
                    </tr>
                  )}
                  {product.specs.ports && (
                    <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                      <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Ports & Expansion</td>
                      <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.ports}</td>
                    </tr>
                  )}
                  <tr className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-slate-400 bg-[#0B1120]/80' : 'text-slate-600 bg-slate-50'}`}>Color / Finish</td>
                    <td className={`p-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{product.specs.color}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
