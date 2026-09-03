import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  Grid,
  Check
} from 'lucide-react';
import { FilterState, ConditionGrade } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Grid },
  { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
  { id: 'laptops', name: 'Laptops', icon: Laptop },
  { id: 'audio', name: 'Audio & ANC', icon: Headphones },
  { id: 'accessories', name: 'Accessories & Tablets', icon: Gamepad2 },
];

const CONDITIONS: { id: ConditionGrade; label: string; badgeColor: string }[] = [
  { id: 'brand_new', label: 'Brand New (Factory Sealed)', badgeColor: 'text-blue-400' },
  { id: 'refurbished_a', label: 'Refurbished Grade A (Pristine)', badgeColor: 'text-emerald-400' },
  { id: 'refurbished_b', label: 'Refurbished Grade B (Excellent)', badgeColor: 'text-cyan-400' },
  { id: 'used_good', label: 'Used - Good (Tested 100%)', badgeColor: 'text-amber-400' },
];

const RAM_OPTIONS = ['8GB', '12GB', '16GB', '32GB', '48GB'];
const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB'];

const PRICE_PRESETS = [
  { label: 'Any Price', min: 0, max: 10000000 },
  { label: 'Under ₦500k', min: 0, max: 500000 },
  { label: '₦500k - ₦1.5M', min: 500000, max: 1500000 },
  { label: '₦1.5M - ₦3M', min: 1500000, max: 3000000 },
  { label: '₦3M+', min: 3000000, max: 10000000 },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const { isDark } = useTheme();

  const toggleCondition = (cond: string) => {
    const next = filters.conditions.includes(cond)
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onFilterChange({ ...filters, conditions: next });
  };

  const toggleRam = (ram: string) => {
    const next = filters.rams.includes(ram)
      ? filters.rams.filter((r) => r !== ram)
      : [...filters.rams, ram];
    onFilterChange({ ...filters, rams: next });
  };

  const toggleStorage = (storage: string) => {
    const next = filters.storages.includes(storage)
      ? filters.storages.filter((s) => s !== storage)
      : [...filters.storages, storage];
    onFilterChange({ ...filters, storages: next });
  };

  const isFiltering = 
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000000 ||
    filters.conditions.length > 0 ||
    filters.rams.length > 0 ||
    filters.storages.length > 0;

  return (
    <aside 
      id="filter-sidebar" 
      className={`rounded-2xl p-5 space-y-6 border transition-colors ${
        isDark 
          ? 'bg-[#1E293B] border-slate-700/60 text-slate-200 shadow-md' 
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {/* Header with Results Count & Reset */}
      <div className={`flex items-center justify-between pb-4 border-b ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <span className={`text-sm font-bold uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Parametric Filters
          </span>
        </div>
        {isFiltering && (
          <button
            id="btn-reset-all-filters"
            onClick={onResetFilters}
            className={`text-xs flex items-center gap-1 font-medium hover:underline cursor-pointer ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-2.5">
        <label className={`text-xs font-bold uppercase tracking-wider block ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filters.category.toLowerCase() === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                onClick={() => onFilterChange({ ...filters, category: cat.id })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? isDark 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-300 font-bold'
                    : isDark 
                      ? 'text-slate-300 hover:bg-[#0B1120] hover:text-white border border-transparent' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${
                    isSelected 
                      ? isDark ? 'text-cyan-400' : 'text-cyan-600'
                      : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <span>{cat.name}</span>
                </div>
                {isSelected && <Check className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Section (Naira ₦) */}
      <div className={`space-y-3 pt-3 border-t ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        <label className={`text-xs font-bold uppercase tracking-wider block ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Price Range (₦ NGN)
        </label>

        {/* Quick price presets in Naira */}
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.slice(1).map((preset, idx) => {
            const isPresetActive = filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={idx}
                onClick={() => onFilterChange({ ...filters, minPrice: preset.min, maxPrice: preset.max })}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                  isPresetActive
                    ? isDark 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                      : 'bg-cyan-100 border-cyan-500 text-cyan-900 font-bold'
                    : isDark 
                      ? 'border-slate-700/70 hover:border-slate-600 text-slate-300 hover:text-white bg-[#0B1120]' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Min / Max inputs in Naira */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Min (₦)</span>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              max={filters.maxPrice}
              value={filters.minPrice || ''}
              placeholder="0"
              onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
              className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
              }`}
            />
          </div>
          <div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Max (₦)</span>
            <input
              id="filter-max-price"
              type="number"
              min={filters.minPrice}
              max={20000000}
              value={filters.maxPrice >= 10000000 ? '' : filters.maxPrice || ''}
              placeholder="10,000,000"
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) || 10000000 })}
              className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Condition Grade */}
      <div className={`space-y-2 pt-3 border-t ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-bold uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Condition Grade
          </label>
          <span className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Swappa Certified</span>
        </div>

        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => {
            const isChecked = filters.conditions.includes(cond.id);
            return (
              <button
                key={cond.id}
                id={`filter-condition-${cond.id}`}
                onClick={() => toggleCondition(cond.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs border text-left transition-all cursor-pointer ${
                  isChecked
                    ? isDark 
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-white' 
                      : 'bg-cyan-50 border-cyan-400 text-cyan-900 font-semibold'
                    : isDark 
                      ? 'border-slate-700/70 hover:border-slate-600 bg-[#0B1120] text-slate-300' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isChecked 
                      ? 'bg-cyan-500 border-cyan-500 text-slate-950' 
                      : isDark ? 'border-slate-600 bg-slate-900' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs">{cond.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hardware RAM Filter */}
      <div className={`space-y-2 pt-3 border-t ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        <label className={`text-xs font-bold uppercase tracking-wider block ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          RAM Memory
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RAM_OPTIONS.map((ram) => {
            const isChecked = filters.rams.includes(ram);
            return (
              <button
                key={ram}
                id={`filter-ram-${ram}`}
                onClick={() => toggleRam(ram)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                  isChecked
                    ? isDark 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                      : 'bg-cyan-100 border-cyan-500 text-cyan-900 font-bold'
                    : isDark 
                      ? 'border-slate-700/70 hover:border-slate-600 text-slate-300 hover:text-white bg-[#0B1120]' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-slate-50'
                }`}
              >
                {ram}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Filter */}
      <div className={`space-y-2 pt-3 border-t ${
        isDark ? 'border-slate-700/60' : 'border-slate-200'
      }`}>
        <label className={`text-xs font-bold uppercase tracking-wider block ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Internal Storage
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STORAGE_OPTIONS.map((storage) => {
            const isChecked = filters.storages.includes(storage);
            return (
              <button
                key={storage}
                id={`filter-storage-${storage}`}
                onClick={() => toggleStorage(storage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                  isChecked
                    ? isDark 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                      : 'bg-cyan-100 border-cyan-500 text-cyan-900 font-bold'
                    : isDark 
                      ? 'border-slate-700/70 hover:border-slate-600 text-slate-300 hover:text-white bg-[#0B1120]' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-slate-50'
                }`}
              >
                {storage}
              </button>
            );
          })}
        </div>
      </div>

      {/* Escrow Guarantee Callout */}
      <div className={`p-3 rounded-xl text-xs space-y-1 border ${
        isDark 
          ? 'bg-[#0B1120] border-cyan-500/30' 
          : 'bg-cyan-50/80 border-cyan-200 text-slate-800'
      }`}>
        <div className={`font-bold flex items-center gap-1.5 ${
          isDark ? 'text-cyan-300' : 'text-cyan-800'
        }`}>
          <span>🛡️ Swappa-Style Escrow</span>
        </div>
        <p className={`text-[11px] leading-normal ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Serial numbers and cosmetic grading are verified before shipping. 48-hour inspection period guaranteed on all purchases across Nigeria.
        </p>
      </div>
    </aside>
  );
};
