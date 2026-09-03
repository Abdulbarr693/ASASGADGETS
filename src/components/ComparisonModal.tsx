import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  Layers
} from 'lucide-react';
import { Product } from '../types';
import { getConditionDetails } from './ProductCard';
import { formatNaira } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (id: string) => void;
  onBuyProduct: (product: Product) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onBuyProduct
}) => {
  const { isDark } = useTheme();
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  if (!isOpen || products.length === 0) return null;

  // Spec rows definition
  const specRows = [
    { label: 'Condition Grade', getValue: (p: Product) => getConditionDetails(p.condition).label },
    { label: 'Battery Health', getValue: (p: Product) => p.batteryHealth ? `${p.batteryHealth}% Certified` : '100% Sealed' },
    { label: 'Processor / Chip', getValue: (p: Product) => p.specs.processor },
    { label: 'RAM Memory', getValue: (p: Product) => p.specs.ram },
    { label: 'Internal Storage', getValue: (p: Product) => p.specs.storage },
    { label: 'Display Panel', getValue: (p: Product) => p.specs.display },
    { label: 'Battery Capacity', getValue: (p: Product) => p.specs.battery },
    { label: 'Operating System', getValue: (p: Product) => p.specs.os },
    { label: 'Connectivity', getValue: (p: Product) => p.specs.connectivity },
    { label: 'Camera Setup', getValue: (p: Product) => p.specs.camera || 'Standard Audio/Accessory' },
    { label: 'Ports & I/O', getValue: (p: Product) => p.specs.ports || 'Standard' },
    { label: 'Finish / Color', getValue: (p: Product) => p.specs.color },
    { label: 'Weight', getValue: (p: Product) => p.specs.weight || 'N/A' },
    { label: 'Warranty Period', getValue: (p: Product) => `${p.warrantyMonths} Months Hardware Protection` },
    { label: 'Serial & IMEI Status', getValue: (p: Product) => `Verified Clean (${p.serialNumber.slice(0, 10)}...)` },
    { label: 'Certified Vendor', getValue: (p: Product) => `${p.vendorName} (${p.vendorRating}★ - ${p.vendorSalesCount} sales)` },
  ];

  return (
    <div id="comparison-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div 
        id="comparison-modal-card"
        className={`border w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
          isDark 
            ? 'bg-[#0F172A] border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700/80 bg-[#1E293B]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Side-by-Side Spec Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono font-bold">
                  {products.length} Devices
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Detailed technical specifications & escrow guarantees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className={`hidden sm:flex items-center gap-2 text-xs cursor-pointer select-none ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
              />
              <span>Highlight Differences</span>
            </label>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className={`overflow-x-auto overflow-y-auto flex-1 p-4 sm:p-6 ${
          isDark ? 'bg-[#0F172A]' : 'bg-white'
        }`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`w-1/4 p-3 text-left text-xs font-bold uppercase tracking-wider border-b ${
                  isDark ? 'text-slate-400 border-slate-700/80' : 'text-slate-500 border-slate-200'
                }`}>
                  Feature / Spec
                </th>
                {products.map((product) => {
                  const cond = getConditionDetails(product.condition);
                  return (
                    <th
                      key={product.id}
                      className={`w-1/3 p-4 text-left border-b align-top rounded-t-xl ${
                        isDark ? 'border-slate-700/80 bg-[#1E293B]/60' : 'border-slate-200 bg-slate-50/80'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${cond.badgeClass}`}>
                            {cond.label}
                          </span>
                          <button
                            onClick={() => onRemoveProduct(product.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className={`aspect-video w-full rounded-lg overflow-hidden border ${
                          isDark ? 'bg-[#0B1120] border-slate-700/60' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-h-[48px]">
                          <h4 className={`text-sm font-bold line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {product.title}
                          </h4>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <div className={`text-xl font-black font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                              {formatNaira(product.price)}
                            </div>
                            {product.originalPrice > product.price && (
                              <div className={`text-xs line-through font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                MSRP {formatNaira(product.originalPrice)}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              onBuyProduct(product);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <span>Buy</span>
                            <Zap className="w-3 h-3 fill-slate-950" />
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-200'}`}>
              {specRows.map((row, idx) => {
                const values = products.map((p) => row.getValue(p));
                const allSame = values.every((v) => v === values[0]);
                const isDifferent = !allSame && products.length > 1;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      highlightDifferences && isDifferent
                        ? isDark ? 'bg-cyan-950/20' : 'bg-cyan-50/70'
                        : idx % 2 === 0
                        ? isDark ? 'bg-[#1E293B]/20' : 'bg-slate-50/50'
                        : 'bg-transparent'
                    }`}
                  >
                    <td className={`p-3 text-xs font-semibold border-r ${
                      isDark ? 'text-slate-400 border-slate-700/60' : 'text-slate-600 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        {highlightDifferences && isDifferent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        )}
                        <span>{row.label}</span>
                      </div>
                    </td>
                    {products.map((product) => {
                      const value = row.getValue(product);
                      return (
                        <td
                          key={product.id}
                          className={`p-3.5 text-xs border-r last:border-r-0 font-sans ${
                            isDark ? 'text-slate-200 border-slate-700/40' : 'text-slate-800 border-slate-200'
                          }`}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDark ? 'border-slate-700/80 bg-[#1E293B] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <div className={`flex items-center gap-2 font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>All devices covered by 48-Hour Neutral Escrow Protection</span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl border font-semibold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#0B1120] hover:bg-slate-800 border-slate-700 text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
            }`}
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
