import React, { useState } from 'react';
import { X, UploadCloud, Check, Sparkles } from 'lucide-react';
import { Product, Category, ConditionGrade } from '../types';
import { SPEC_PRESETS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUploaded: (product: Product) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  onProductUploaded,
}) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [upc, setUpc] = useState('');
  const [category, setCategory] = useState<Category>('smartphones');
  const [condition, setCondition] = useState<ConditionGrade>('refurbished_a');
  const [price, setPrice] = useState<number | ''>(1250000);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(1490000);
  const [serialNumber, setSerialNumber] = useState(`ADMIN-VERIFIED-${Date.now()}`);
  const [batteryHealth, setBatteryHealth] = useState(99);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80');
  const [processor, setProcessor] = useState('Apple A17 Pro (3nm)');
  const [ram, setRam] = useState('8GB');
  const [storage, setStorage] = useState('256GB');
  const [display, setDisplay] = useState('6.7" Super Retina XDR OLED');
  const [vendorName, setVendorName] = useState('ASASGADGETS Official Vault');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickPreset = (index: number) => {
    const preset = SPEC_PRESETS[index];
    if (!preset) return;
    setTitle(preset.title);
    setBrand(preset.brand);
    setModel(preset.model);
    setUpc(preset.upc);
    setCategory(preset.category);
    setPrice(Math.round(preset.suggestedRetail * 0.82));
    setOriginalPrice(preset.suggestedRetail);
    setImageUrl(preset.images[0]);
    setProcessor(preset.specs.processor);
    setRam(preset.specs.ram);
    setStorage(preset.specs.storage);
    setDisplay(preset.specs.display);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        brand,
        model: model || title,
        upc: upc || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        category,
        condition,
        conditionDescription: 'Admin inspected and verified mint operational grade.',
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price) * 1.2,
        vendorId: 'ven-admin',
        vendorName,
        vendorRating: 5.0,
        vendorSalesCount: 500,
        images: [imageUrl],
        serialNumber: serialNumber || `ADM-${Date.now()}`,
        batteryHealth: Number(batteryHealth),
        specs: {
          processor,
          ram,
          storage,
          display,
          battery: 'Certified High Capacity',
          os: 'Latest OS',
          connectivity: '5G, Wi-Fi 6E/7, Bluetooth',
          color: 'Standard',
          ports: 'USB-C'
        },
        description: 'Official ASASGADGETS certified marketplace listing with guaranteed 48-hour escrow protection.',
        warrantyMonths: 12,
        featured: true
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to upload gadget');

      const created = await res.json();
      onProductUploaded(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admin-upload-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        id="admin-upload-modal-card"
        className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border transition-colors ${
          isDark 
            ? 'bg-[#1E293B] border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upload Gadget to Storefront</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Add a new verified product to the public storefront as an Administrator (Naira ₦)
            </p>
          </div>
        </div>

        {/* Quick Fill Presets */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1.5">
            Quick Auto-Fill Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset(0)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 hover:border-cyan-400 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900'
              }`}
            >
              iPhone 15 Pro Max
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(1)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 hover:border-cyan-400 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900'
              }`}
            >
              Galaxy S24 Ultra
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(2)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 hover:border-cyan-400 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900'
              }`}
            >
              MacBook Pro 16" M3 Max
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(4)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#0B1120] border-slate-700/70 hover:border-cyan-400 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-900'
              }`}
            >
              Sony WH-1000XM5
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apple iPhone 15 Pro Max 256GB - Grade A"
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Condition Grade</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionGrade)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="brand_new">Brand New (Factory Sealed)</option>
                <option value="refurbished_a">Refurbished Grade A (Pristine)</option>
                <option value="refurbished_b">Refurbished Grade B (Excellent)</option>
                <option value="used_good">Used - Good</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Selling Price (₦ Naira)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || '')}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Original MSRP (₦ Naira)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value) || '')}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>RAM Memory</label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Storage Capacity</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Serial / IMEI Lock</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className={`pt-3 border-t flex justify-end gap-2 ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading...' : 'Publish to Storefront'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
