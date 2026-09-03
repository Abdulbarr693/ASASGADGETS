import React from 'react';
import { Layers, X, ArrowRight, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ComparisonDockProps {
  comparedProducts: Product[];
  onRemove: (productId: string) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export const ComparisonDock: React.FC<ComparisonDockProps> = ({
  comparedProducts,
  onRemove,
  onClearAll,
  onOpenModal,
}) => {
  const { isDark } = useTheme();
  if (comparedProducts.length === 0) return null;

  return (
    <div 
      id="floating-comparison-dock"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md border transition-all ${
        isDark
          ? 'bg-[#1E293B]/95 border-slate-700/80 shadow-slate-950/60 text-white'
          : 'bg-white/95 border-slate-300 shadow-slate-400/40 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Info and Clear */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Comparison Dock</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[10px] font-mono font-bold">
                  {comparedProducts.length}/3
                </span>
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Compare side-by-side specs
              </div>
            </div>
          </div>

          <button
            id="btn-clear-comparison"
            onClick={onClearAll}
            className={`text-[11px] flex items-center gap-1 transition-colors px-2 py-1 rounded cursor-pointer ${
              isDark 
                ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' 
                : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>

        {/* Center: Selected product pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {comparedProducts.map((product) => (
            <div
              key={product.id}
              className={`flex items-center gap-2 border rounded-xl p-1.5 pr-2.5 min-w-[140px] max-w-[210px] ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-8 h-8 rounded-lg object-cover bg-slate-200 dark:bg-slate-950 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {product.title}
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                  {formatNaira(product.price)}
                </div>
              </div>
              <button
                onClick={() => onRemove(product.id)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                }`}
                title="Remove from comparison"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Empty slot placeholder if < 3 */}
          {Array.from({ length: 3 - comparedProducts.length }).map((_, index) => (
            <div
              key={index}
              className={`hidden md:flex items-center justify-center border border-dashed rounded-xl px-3 py-2 text-[10px] min-w-[120px] ${
                isDark ? 'border-slate-700/60 text-slate-500' : 'border-slate-300 text-slate-400'
              }`}
            >
              + Add device
            </div>
          ))}
        </div>

        {/* Right: Trigger Button */}
        <div className="w-full sm:w-auto">
          <button
            id="btn-open-comparison-modal"
            onClick={onOpenModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <span>Compare Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
