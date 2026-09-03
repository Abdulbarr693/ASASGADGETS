import React, { useState, useEffect } from 'react';
import { 
  Store, 
  PlusCircle, 
  DollarSign, 
  PackageCheck, 
  ShieldCheck, 
  Star, 
  Search, 
  Cpu, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  Clock, 
  Truck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Coins
} from 'lucide-react';
import { Product, Order, User, SpecPreset, ConditionGrade, Category } from '../types';
import { SPEC_PRESETS } from '../data/mockData';
import { getConditionDetails } from './ProductCard';
import { useTheme } from '../context/ThemeContext';
import { formatNaira } from '../utils/currency';

interface SellerDashboardProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onProductCreated: (newProduct: Product) => void;
  onRefreshData: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  products,
  orders,
  onProductCreated,
  onRefreshData,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'wizard'>('listings');
  
  // Wizard State (Steps 1 to 4)
  const [wizardStep, setWizardStep] = useState(1);
  const [searchUpc, setSearchUpc] = useState('');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [upc, setUpc] = useState('');
  const [category, setCategory] = useState<Category>('smartphones');
  const [condition, setCondition] = useState<ConditionGrade>('refurbished_a');
  const [conditionDescription, setConditionDescription] = useState('Pristine screen, tested 100% operational.');
  const [batteryHealth, setBatteryHealth] = useState(99);
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Specs
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('16GB');
  const [storage, setStorage] = useState('256GB');
  const [display, setDisplay] = useState('');
  const [battery, setBattery] = useState('');
  const [os, setOs] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [color, setColor] = useState('Space Gray');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filter vendor's own listings and orders
  const vendorProducts = products.filter(
    (p) => p.vendorId === (currentUser.vendorId || 'ven-01')
  );
  const vendorOrders = orders.filter(
    (o) => o.vendorId === (currentUser.vendorId || 'ven-01')
  );

  const totalEarnings = vendorOrders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0) + 1845000;

  const escrowPending = vendorOrders
    .filter((o) => o.status === 'escrow_held' || o.status === 'delivered_inspecting' || o.status === 'disputed')
    .reduce((sum, o) => sum + o.price, 0);

  // Auto-populate helper
  const handlePresetSelect = (preset: SpecPreset) => {
    setTitle(preset.title);
    setBrand(preset.brand);
    setModel(preset.model);
    setUpc(preset.upc);
    setCategory(preset.category);
    setPrice(Math.round(preset.suggestedRetail * 0.8));
    setOriginalPrice(preset.suggestedRetail);
    setImageUrl(preset.images[0]);
    setProcessor(preset.specs.processor);
    setRam(preset.specs.ram);
    setStorage(preset.specs.storage);
    setDisplay(preset.specs.display);
    setBattery(preset.specs.battery);
    setOs(preset.specs.os);
    setConnectivity(preset.specs.connectivity);
    setColor(preset.specs.color);
    setDescription(`Certified ${preset.brand} ${preset.model}. Inspected by vendor specialists.`);
    setSerialNumber(`${preset.brand.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-VERIFIED`);
  };

  const handleUpcLookup = () => {
    const match = SPEC_PRESETS.find(
      (p) => p.upc === searchUpc.trim() || p.model.toLowerCase() === searchUpc.toLowerCase().trim()
    );
    if (match) {
      handlePresetSelect(match);
    } else {
      // Mock generate generic
      setUpc(searchUpc);
      setModel(searchUpc);
      setTitle(`Gadget Model ${searchUpc}`);
    }
  };

  const handlePublishListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: title || 'Certified Tech Gadget',
        brand: brand || 'Tech',
        model: model || 'Pro',
        upc: upc || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        category,
        condition,
        conditionDescription,
        price: Number(price) || 850000,
        originalPrice: Number(originalPrice) || (Number(price) ? Number(price) * 1.25 : 990000),
        vendorId: currentUser.vendorId || 'ven-01',
        vendorName: currentUser.name,
        vendorRating: 4.95,
        vendorSalesCount: vendorOrders.length + 120,
        images: [
          imageUrl || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80'
        ],
        serialNumber: serialNumber || `SN-${Date.now()}-VERIFIED`,
        batteryHealth: condition === 'brand_new' ? 100 : Number(batteryHealth),
        specs: {
          processor: processor || 'High Performance Multi-Core',
          ram: ram || '16GB',
          storage: storage || '512GB',
          display: display || 'Retina Pro Display',
          battery: battery || 'All-day battery capacity',
          os: os || 'Standard OS',
          connectivity: connectivity || '5G, Wi-Fi 6, Bluetooth',
          color: color || 'Midnight',
          ports: 'USB-C Thunderbolt'
        },
        description: description || 'Certified listing on ASASGADGETS.',
        warrantyMonths: Number(warrantyMonths) || 12,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to publish gadget');

      const createdProduct = await res.json();
      onProductCreated(createdProduct);
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setWizardStep(1);
        setActiveTab('listings');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="seller-dashboard-container" className={`max-w-7xl mx-auto px-4 py-8 space-y-8 transition-colors ${
      isDark ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* Top Banner */}
      <div className={`border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Seller Portal
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Merchant Hub</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentUser.name}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage your certified electronics inventory, track anti-fraud serial numbers, and monitor pending escrow payouts in Nigerian Naira (₦).
          </p>
        </div>

        <button
          id="btn-new-listing-tab"
          onClick={() => {
            setActiveTab('wizard');
            setWizardStep(1);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Listing Wizard</span>
        </button>
      </div>

      {/* Seller Financial Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-2xl transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Store Listings</div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{vendorProducts.length}</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1 font-medium">
            <PackageCheck className="w-3.5 h-3.5" /> Ready for buyer orders
          </div>
        </div>

        <div className={`p-4 border rounded-2xl transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Escrow Funds in Hold</div>
          <div className="text-2xl font-black text-cyan-500 font-mono">{formatNaira(escrowPending)}</div>
          <div className={`text-[11px] flex items-center gap-1 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-3.5 h-3.5 text-cyan-500" /> Releases after 48hr inspection
          </div>
        </div>

        <div className={`p-4 border rounded-2xl transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Verified Revenue</div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatNaira(totalEarnings)}</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1 font-medium">
            <Coins className="w-3.5 h-3.5" /> Settled via escrow
          </div>
        </div>

        <div className={`p-4 border rounded-2xl transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trust & Rating Score</div>
          <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-500" /> 4.95
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>0 fraudulent claims</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`flex border-b gap-6 ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
        <button
          id="tab-active-listings"
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'listings'
              ? 'text-emerald-500'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Active Inventory ({vendorProducts.length})
          {activeTab === 'listings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>

        <button
          id="tab-pending-orders"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'orders'
              ? 'text-emerald-500'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Pending Sales & Escrow ({vendorOrders.length})
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>

        <button
          id="tab-wizard"
          onClick={() => setActiveTab('wizard')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'wizard'
              ? 'text-emerald-500'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          + Listing Wizard (UPC Auto-Fill)
          {activeTab === 'wizard' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
      </div>

      {/* TAB 1: ACTIVE LISTINGS TABLE */}
      {activeTab === 'listings' && (
        <div className={`border rounded-2xl overflow-hidden shadow-lg transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700/80' : 'border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Marketplace Active Catalog
            </h3>
            <button
              onClick={onRefreshData}
              className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b text-left ${
                  isDark 
                    ? 'border-slate-700/80 text-slate-400 bg-[#0B1120]/70' 
                    : 'border-slate-200 text-slate-600 bg-slate-50'
                }`}>
                  <th className="p-3.5">Device Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition Grade</th>
                  <th className="p-3.5">Serial Protection</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Warranty</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-200'}`}>
                {vendorProducts.map((prod) => {
                  const cond = getConditionDetails(prod.condition);
                  return (
                    <tr key={prod.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className={`w-10 h-10 rounded-lg object-cover border ${
                            isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
                          }`}
                        />
                        <div>
                          <div className={`font-bold truncate max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.title}</div>
                          <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UPC: {prod.upc}</div>
                        </div>
                      </td>
                      <td className="p-3.5 uppercase font-mono text-cyan-500 font-semibold">{prod.category}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cond.badgeClass}`}>
                          {cond.label}
                        </span>
                      </td>
                      <td className={`p-3.5 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className={`px-2 py-1 rounded border ${
                          isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
                        }`}>
                          {prod.serialNumber}
                        </span>
                      </td>
                      <td className={`p-3.5 font-mono font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatNaira(prod.price)}</td>
                      <td className={`p-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{prod.warrantyMonths} Months</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prod.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                            : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING SALES & ESCROW TIMELINE */}
      {activeTab === 'orders' && (
        <div className={`border rounded-2xl overflow-hidden shadow-lg transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Orders & Escrow Release Tracking
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Escrow funds are automatically released to your balance 48 hours after buyer confirms delivery.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b text-left ${
                  isDark 
                    ? 'border-slate-700/80 text-slate-400 bg-[#0B1120]/70' 
                    : 'border-slate-200 text-slate-600 bg-slate-50'
                }`}>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Buyer</th>
                  <th className="p-3.5">Escrow Amount</th>
                  <th className="p-3.5">Serial Locked</th>
                  <th className="p-3.5">Escrow Status</th>
                  <th className="p-3.5">Inspection Window</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-200'}`}>
                {vendorOrders.map((order) => (
                  <tr key={order.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="p-3.5 font-mono text-cyan-500 font-bold">#{order.id}</td>
                    <td className="p-3.5 flex items-center gap-2 max-w-xs truncate">
                      <img src={order.productImage} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className={`truncate font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.productTitle}</span>
                    </td>
                    <td className="p-3.5">
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.buyerName}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.buyerEmail}</div>
                    </td>
                    <td className={`p-3.5 font-mono font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatNaira(order.price)}</td>
                    <td className={`p-3.5 font-mono text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className={`px-1.5 py-0.5 rounded border ${
                        isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
                      }`}>
                        {order.serialNumber}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.status === 'escrow_held'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40'
                          : order.status === 'delivered_inspecting'
                          ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40'
                          : order.status === 'disputed'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`p-3.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {order.inspectionEndsAt 
                        ? new Date(order.inspectionEndsAt).toLocaleDateString() 
                        : 'In Transit'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-STEP LISTING WIZARD */}
      {activeTab === 'wizard' && (
        <div className={`border rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto transition-colors ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          {/* Wizard Step Progress Tracker */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className={`absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 -z-0 ${
              isDark ? 'bg-slate-700' : 'bg-slate-200'
            }`} />
            
            {[
              { num: 1, title: 'UPC & Model' },
              { num: 2, title: 'Condition Grade' },
              { num: 3, title: 'Serial Protection' },
              { num: 4, title: 'Pricing & Publish' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                  wizardStep === s.num
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-110'
                    : wizardStep > s.num
                    ? (isDark ? 'bg-[#0B1120] border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-500 text-emerald-600')
                    : (isDark ? 'bg-[#0B1120] border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-400')
                }`}>
                  {wizardStep > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                  wizardStep === s.num ? 'text-emerald-500' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {publishSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Device Successfully Listed Live!</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Your gadget is now active on the marketplace with 48-hour escrow protection enabled.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublishListing} className="space-y-6">
              {/* STEP 1: UPC & MODEL SPEC PRESETS */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      <span>Step 1: Input UPC/Model to Auto-Populate Specs</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Type a barcode/model or pick a flagship preset to instantly load manufacturer spec sheets.
                    </p>
                  </div>

                  {/* UPC Search Bar */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Enter UPC (e.g. 195949038241) or Model (A3106, S24, M3 Max)..."
                        value={searchUpc}
                        onChange={(e) => setSearchUpc(e.target.value)}
                        className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleUpcLookup}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Auto-Fill Specs
                    </button>
                  </div>

                  {/* Preset quick pills */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Or Select Popular Hardware Preset:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SPEC_PRESETS.map((preset) => (
                        <button
                          key={preset.upc}
                          type="button"
                          onClick={() => handlePresetSelect(preset)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                            upc === preset.upc
                              ? (isDark ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm' : 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-sm')
                              : (isDark ? 'bg-[#0B1120]/80 border-slate-700/70 text-slate-300 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300')
                          }`}
                        >
                          <img src={preset.images[0]} alt="" className="w-9 h-9 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{preset.title}</div>
                            <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              UPC: {preset.upc} • {formatNaira(preset.suggestedRetail)} MSRP
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editable Fields for Step 1 */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${
                    isDark ? 'border-slate-700/80' : 'border-slate-200'
                  }`}>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Listing Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Apple iPhone 15 Pro Max 256GB"
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
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Brand</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Model / UPC</label>
                      <input
                        type="text"
                        value={upc}
                        onChange={(e) => setUpc(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      disabled={!title}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Condition</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CONDITION & DIAGNOSTICS */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Step 2: Select Device Condition Grade & Battery Health</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Transparent grading ensures zero disputes under our escrow return policy.
                    </p>
                  </div>

                  {/* Condition selector cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'brand_new',
                        title: 'Brand New (Factory Sealed)',
                        desc: 'Unopened box, original manufacturer factory seals intact.',
                        badge: 'text-blue-500'
                      },
                      {
                        id: 'refurbished_a',
                        title: 'Refurbished Pristine (Grade A)',
                        desc: 'Zero scratches or dead pixels. Looks and feels like new. 95%+ battery.',
                        badge: 'text-emerald-500'
                      },
                      {
                        id: 'refurbished_b',
                        title: 'Refurbished Excellent (Grade B)',
                        desc: 'Light micro-scuffs on housing only. Screen 100% flawless.',
                        badge: 'text-cyan-500'
                      },
                      {
                        id: 'used_good',
                        title: 'Used - Good',
                        desc: 'Fully tested working. Normal gentle signs of everyday use.',
                        badge: 'text-amber-500'
                      },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCondition(c.id as ConditionGrade)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          condition === c.id
                            ? (isDark ? 'bg-[#0B1120] border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-emerald-50/50 border-emerald-500 shadow-sm')
                            : (isDark ? 'bg-[#0B1120]/50 border-slate-700/70 text-slate-300 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300')
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${c.badge}`}>{c.title}</span>
                          {condition === c.id && <Check className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Battery Health & Cosmetic notes */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${
                    isDark ? 'border-slate-700/80' : 'border-slate-200'
                  }`}>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Battery Health Percentage (%)
                      </label>
                      <input
                        type="number"
                        min={70}
                        max={100}
                        value={batteryHealth}
                        onChange={(e) => setBatteryHealth(Number(e.target.value))}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Cosmetic Diagnostic Summary
                      </label>
                      <input
                        type="text"
                        value={conditionDescription}
                        onChange={(e) => setConditionDescription(e.target.value)}
                        placeholder="e.g. Flawless display, tiny micro-scuff on bottom corner"
                        className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Continue to Serial Check</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ANTI-FRAUD SERIAL NUMBER */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Lock className="w-4 h-4 text-cyan-500" />
                      <span>Step 3: Enter Serial Number / IMEI for Return Protection</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Swappa-style serial verification locks the exact unit to prevent buyer swapping or fraudulent returns.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl space-y-2 border ${
                    isDark 
                      ? 'bg-cyan-950/20 border-cyan-500/30' 
                      : 'bg-cyan-50/70 border-cyan-200'
                  }`}>
                    <div className="text-xs font-bold text-cyan-600 dark:text-cyan-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-500" />
                      <span>Anti-Fraud Guarantee Policy</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      By submitting this hardware serial number, you certify that this device has a clean ESN/IMEI, is not iCloud/Google locked, and is carrier unlocked.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Unique Hardware Serial / IMEI <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="e.g. C02G9941M3MAX or 358291048291024"
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Warranty Period (Months)
                      </label>
                      <select
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                        className={`w-full border rounded-xl px-3 py-2 text-xs ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value={6}>6 Months Seller Warranty</option>
                        <option value={12}>12 Months Full Hardware Warranty</option>
                        <option value={24}>24 Months Extended Protection</option>
                      </select>
                    </div>
                  </div>

                  {/* Specs Quick Confirmation */}
                  <div className={`p-4 border rounded-xl space-y-2 ${
                    isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Specifications Snapshot</div>
                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <div>Processor: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{processor || 'Standard'}</strong></div>
                      <div>RAM: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{ram}</strong></div>
                      <div>Storage: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{storage}</strong></div>
                      <div>Color: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{color}</strong></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      disabled={!serialNumber}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Pricing</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PRICING & PUBLISH */}
              {wizardStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Coins className="w-4 h-4 text-emerald-500" />
                      <span>Step 4: Set Price & Publish to Marketplace (Naira ₦)</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Set competitive marketplace pricing in Nigerian Naira (₦) to attract gadget buyers with escrow security.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Your Listing Price (₦ Naira) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || '')}
                        placeholder="e.g. 1250000"
                        className={`w-full border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500 font-bold ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Original MSRP Reference (₦ Naira)
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value) || '')}
                        placeholder="e.g. 1490000"
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Product Photo URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Public Description / Notes
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Include included accessories, battery cycles, original box status..."
                        className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className={`p-4 border rounded-xl flex items-center justify-between text-xs ${
                    isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title || 'Untitled Device'}</div>
                      <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SN: {serialNumber || 'Pending'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-500 font-mono">{formatNaira(Number(price) || 0)}</div>
                      <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">Escrow Protection Ready</div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                      type="submit"
                      id="btn-publish-listing-submit"
                      disabled={isSubmitting || !price}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Publishing to Marketplace...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Publish Gadget Live</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      )}

    </div>
  );
};
