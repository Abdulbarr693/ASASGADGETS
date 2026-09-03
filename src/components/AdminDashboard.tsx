import React, { useState } from 'react';
import { 
  Shield, 
  BarChart3, 
  Layers, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  UploadCloud, 
  ArrowDownCircle, 
  Trash2, 
  Search, 
  RefreshCw, 
  Plus, 
  Eye, 
  EyeOff, 
  Store,
  Clock,
  Sparkles
} from 'lucide-react';
import { Product, Dispute, PlatformStats, User } from '../types';
import { getConditionDetails } from './ProductCard';
import { useTheme } from '../context/ThemeContext';
import { formatNaira } from '../utils/currency';

interface AdminDashboardProps {
  stats: PlatformStats | null;
  products: Product[];
  disputes: Dispute[];
  currentUser: User;
  onToggleProductStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onResolveDispute: (disputeId: string, decision: 'resolved_seller' | 'resolved_buyer', note: string) => void;
  onRefreshData: () => void;
  onOpenUploadModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  products,
  disputes,
  currentUser,
  onToggleProductStatus,
  onDeleteProduct,
  onResolveDispute,
  onRefreshData,
  onOpenUploadModal,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'inventory' | 'disputes' | 'analytics'>('inventory');
  const [inventorySearch, setInventorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'offloaded'>('all');
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // Filter products for admin view
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.upc.includes(inventorySearch);

    if (statusFilter === 'active') return matchesSearch && p.status === 'active';
    if (statusFilter === 'offloaded') return matchesSearch && p.status === 'offloaded';
    return matchesSearch;
  });

  const openDisputes = disputes.filter((d) => d.status === 'open');

  return (
    <div id="admin-dashboard-container" className={`max-w-7xl mx-auto px-4 py-8 space-y-8 transition-colors ${
      isDark ? 'text-slate-100' : 'text-slate-800'
    }`}>
      
      {/* Top Banner */}
      <div className={`border rounded-2xl p-6 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#1E293B] border-slate-700/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Platform Operations
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Root Admin Access</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ASASGADGETS Master Administration
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Oversee marketplace GMV in Naira (₦), manage multi-vendor inventory uploads/offloads, and adjudicate neutral escrow disputes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshData}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'border-slate-700/80 bg-[#0B1120] text-slate-300 hover:text-white hover:border-slate-600' 
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
            title="Refresh Platform State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            id="btn-admin-upload-gadget"
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Gadget</span>
          </button>
        </div>
      </div>

      {/* Platform KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-2xl ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Gross Merchandise Value (GMV)</span>
            <Coins className="w-4 h-4 text-cyan-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {stats ? formatNaira(stats.gmv) : formatNaira(148500000)}
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-1">
            <span>Verified transactions to date</span>
          </div>
        </div>

        <div className={`p-4 border rounded-2xl ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Active Marketplace Listings</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
            {stats ? stats.activeListings : products.filter(p => p.status === 'active').length}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {stats ? stats.offloadedListings : products.filter(p => p.status === 'offloaded').length} offloaded / hidden
          </div>
        </div>

        <div className={`p-4 border rounded-2xl ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Escrow Vault in Hold</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {stats ? formatNaira(stats.escrowBalance) : formatNaira(4177000)}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Subject to 48hr buyer inspection
          </div>
        </div>

        <div className={`p-4 border rounded-2xl ${
          isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`text-xs mb-1 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Open Escrow Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-500 font-mono">
            {openDisputes.length}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            Requires admin fund settlement
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b gap-6 ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
        <button
          id="tab-admin-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-cyan-600 dark:text-cyan-400'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Marketplace Gadgets (Upload & Offload) ({products.length})
          {activeTab === 'inventory' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
          )}
        </button>

        <button
          id="tab-admin-disputes"
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'disputes'
              ? 'text-cyan-600 dark:text-cyan-400'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Escrow Dispute Adjudication</span>
          {openDisputes.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {openDisputes.length}
            </span>
          )}
          {activeTab === 'disputes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
          )}
        </button>
      </div>

      {/* TAB 1: GADGET UPLOAD & OFFLOAD MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border p-4 rounded-2xl ${
            isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter gadgets by title, serial, vendor, UPC..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 border ${
                  isDark ? 'bg-[#0B1120] border-slate-700/70 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center border rounded-xl p-1 text-xs ${
                isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === 'all' 
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold' 
                      : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold' 
                      : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Active ({products.filter(p => p.status === 'active').length})
                </button>
                <button
                  onClick={() => setStatusFilter('offloaded')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === 'offloaded' 
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold' 
                      : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Offloaded ({products.filter(p => p.status === 'offloaded').length})
                </button>
              </div>

              <button
                onClick={onOpenUploadModal}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`border rounded-2xl overflow-hidden shadow-xl ${
            isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b text-left ${
                    isDark 
                      ? 'border-slate-700/80 text-slate-400 bg-[#0B1120]/70' 
                      : 'border-slate-200 text-slate-600 bg-slate-50'
                  }`}>
                    <th className="p-3.5">Gadget Title & Photo</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Condition</th>
                    <th className="p-3.5">Verified Serial</th>
                    <th className="p-3.5">Vendor</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Storefront Status</th>
                    <th className="p-3.5 text-right">Admin Action (Offload / Upload)</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-200'}`}>
                  {filteredProducts.map((product) => {
                    const cond = getConditionDetails(product.condition);
                    const isActive = product.status === 'active';

                    return (
                      <tr 
                        key={product.id} 
                        className={`transition-colors ${
                          isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        } ${
                          !isActive ? (isDark ? 'bg-rose-950/10 opacity-80' : 'bg-rose-50/50 opacity-80') : ''
                        }`}
                      >
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className={`w-11 h-11 rounded-lg object-cover border ${
                              isDark ? 'bg-[#0B1120] border-slate-700/70' : 'bg-slate-100 border-slate-200'
                            }`}
                          />
                          <div>
                            <div className={`font-bold max-w-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {product.title}
                            </div>
                            <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              UPC: {product.upc}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 uppercase font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                          {product.category}
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cond.badgeClass}`}>
                            {cond.label}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono">
                          <span className={`px-2 py-1 rounded border text-[11px] ${
                            isDark 
                              ? 'bg-[#0B1120] border-slate-700/70 text-slate-300' 
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            {product.serialNumber}
                          </span>
                        </td>

                        <td className={`p-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {product.vendorName}
                        </td>

                        <td className={`p-3.5 font-mono font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {formatNaira(product.price)}
                        </td>

                        {/* Status badge */}
                        <td className="p-3.5">
                          {isActive ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              ACTIVE ON SITE
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              OFFLOADED / HIDDEN
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`btn-toggle-status-${product.id}`}
                              onClick={() => onToggleProductStatus(product.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                              }`}
                              title={isActive ? 'Offload/Hide from buyers' : 'Upload/Publish back to site'}
                            >
                              {isActive ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Offload from Website</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Upload to Website</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDark 
                                  ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800' 
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                              }`}
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTES & ESCROW SETTLEMENT */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className={`border rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Shield className="w-4 h-4 text-cyan-500" />
                <span>Simulated Escrow Dispute Adjudication</span>
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                When buyers open disputes during the 48-hour inspection period, funds remain locked in escrow until the platform administrator reviews evidence and releases funds to either seller or buyer in Naira.
              </p>
            </div>

            <div className="space-y-4">
              {disputes.map((dispute) => {
                const isOpen = dispute.status === 'open';

                return (
                  <div
                    key={dispute.id}
                    className={`border rounded-2xl p-5 space-y-4 transition-all ${
                      isOpen
                        ? (isDark 
                            ? 'bg-[#0B1120] border-rose-500/40 shadow-lg shadow-rose-950/20' 
                            : 'bg-rose-50/40 border-rose-300 shadow-sm')
                        : (isDark 
                            ? 'bg-[#0B1120]/60 border-slate-700/80 opacity-75' 
                            : 'bg-slate-50 border-slate-200 opacity-80')
                    }`}
                  >
                    {/* Header */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${
                      isDark ? 'border-slate-700/80' : 'border-slate-200'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            #{dispute.id} (Order #{dispute.orderId})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isOpen
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                              : dispute.status === 'resolved_seller'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {dispute.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {dispute.productTitle}
                        </h4>
                      </div>

                      <div className="text-right">
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Escrow Held Amount</div>
                        <div className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {formatNaira(dispute.escrowAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Parties & Reason */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#1E293B]/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <span className={`block mb-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Buyer Claim:
                        </span>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {dispute.buyerName} ({dispute.buyerEmail})
                        </div>
                        <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{dispute.reason}</p>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#1E293B]/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <span className={`block mb-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Certified Seller:
                        </span>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dispute.sellerName}</div>
                        <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Uploaded pre-shipment diagnostic logs and clean serial badge.
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className={`text-xs p-3 rounded-xl border ${
                      isDark 
                        ? 'text-slate-400 bg-[#1E293B]/40 border-slate-700/80' 
                        : 'text-slate-600 bg-slate-100/70 border-slate-200'
                    }`}>
                      <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>Case Logs: </strong> {dispute.description}
                    </div>

                    {/* Resolution Section if Open */}
                    {isOpen ? (
                      <div className={`pt-2 border-t space-y-3 ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Admin Adjudication Reasoning / Note
                          </label>
                          <input
                            type="text"
                            placeholder="Enter notes for escrow audit trail..."
                            value={selectedDisputeId === dispute.id ? resolutionNote : ''}
                            onChange={(e) => {
                              setSelectedDisputeId(dispute.id);
                              setResolutionNote(e.target.value);
                            }}
                            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 ${
                              isDark 
                                ? 'bg-[#1E293B] border-slate-700/70 text-white' 
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3">
                          <button
                            id={`btn-release-seller-${dispute.id}`}
                            onClick={() => {
                              onResolveDispute(
                                dispute.id, 
                                'resolved_seller', 
                                selectedDisputeId === dispute.id ? resolutionNote : 'Item verified compliant with Grade A condition. Escrow released to merchant.'
                              );
                              setResolutionNote('');
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Release Escrow to Seller ({formatNaira(dispute.escrowAmount)})</span>
                          </button>

                          <button
                            id={`btn-refund-buyer-${dispute.id}`}
                            onClick={() => {
                              onResolveDispute(
                                dispute.id, 
                                'resolved_buyer', 
                                selectedDisputeId === dispute.id ? resolutionNote : 'Buyer claim substantiated under 48-hour return window. Escrow refunded.'
                              );
                              setResolutionNote('');
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-500/20"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Refund Escrow to Buyer ({formatNaira(dispute.escrowAmount)})</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Resolved: {dispute.resolutionNote || 'Case settled by administrator.'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
