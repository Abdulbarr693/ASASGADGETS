import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  FilterSidebar 
} from './components/FilterSidebar';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  ComparisonDock 
} from './components/ComparisonDock';
import { 
  ComparisonModal 
} from './components/ComparisonModal';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  SellerDashboard 
} from './components/SellerDashboard';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  AdminUploadModal 
} from './components/AdminUploadModal';
import { 
  AuthModal, 
  DEMO_USERS 
} from './components/AuthModal';
import { 
  Product, 
  Order, 
  Dispute, 
  PlatformStats, 
  User, 
  FilterState 
} from './types';
import { 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  PackageSearch
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AsgLogo } from './components/AsgLogo';

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  search: '',
  minPrice: 0,
  maxPrice: 10000000,
  conditions: [],
  rams: [],
  storages: [],
  sortBy: 'featured',
};

function MainApp() {
  const { isDark } = useTheme();

  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<'buyer' | 'seller' | 'admin'>('buyer');

  // Authentication & Persona
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[2]); // Buyer by default
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Store
  const [products, setProducts] = useState<Product[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buyer Filtering & Search
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Comparison Dock & Modal
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Product Details & Checkout Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  // Admin Upload Modal
  const [isAdminUploadModalOpen, setIsAdminUploadModalOpen] = useState(false);

  // Global Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Store Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query string for active products
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 10000000) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.conditions.length > 0) params.append('conditions', filters.conditions.join(','));
      if (filters.rams.length > 0) params.append('rams', filters.rams.join(','));
      if (filters.storages.length > 0) params.append('storages', filters.storages.join(','));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const [prodRes, allProdRes, ordersRes, disputesRes, statsRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch('/api/products?includeOffloaded=true'),
        fetch('/api/orders'),
        fetch('/api/disputes'),
        fetch('/api/stats'),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (allProdRes.ok) setAdminProducts(await allProdRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (disputesRes.ok) setDisputes(await disputesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Comparison Handlers
  const handleToggleCompare = (product: Product) => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      setComparedProducts(comparedProducts.filter((p) => p.id !== product.id));
      showToast(`Removed "${product.title}" from Comparison Dock`, 'info');
    } else {
      if (comparedProducts.length >= 3) {
        showToast('Comparison dock holds up to 3 devices maximum.', 'error');
        return;
      }
      setComparedProducts([...comparedProducts, product]);
      showToast(`Added "${product.title}" to Comparison Dock`, 'success');
    }
  };

  const handleRemoveCompare = (productId: string) => {
    setComparedProducts(comparedProducts.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setComparedProducts([]);
  };

  // Admin Offload / Upload toggle
  const handleToggleProductStatus = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/toggle-status`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const result = await res.json();
        showToast(result.message, result.status === 'active' ? 'success' : 'info');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update gadget status', 'error');
    }
  };

  // Admin Delete Product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Gadget deleted permanently from database', 'info');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Dispute Resolution
  const handleResolveDispute = async (
    disputeId: string, 
    decision: 'resolved_seller' | 'resolved_buyer', 
    note: string
  ) => {
    try {
      const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note }),
      });
      if (res.ok) {
        showToast(
          decision === 'resolved_seller' 
            ? 'Escrow funds released to Seller account!' 
            : 'Escrow funds refunded to Buyer account!',
          'success'
        );
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast('Error settling escrow dispute', 'error');
    }
  };

  // New Listing created by seller or admin
  const handleProductCreated = (newProduct: Product) => {
    showToast(`"${newProduct.title}" is now published live!`, 'success');
    fetchData();
  };

  // Order placed
  const handleOrderCreated = (order: Order) => {
    showToast(`Order #${order.id} placed in neutral escrow protection!`, 'success');
    fetchData();
  };

  // Persona change handler
  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
      showToast(`Logged in as Administrator (${user.email})`, 'success');
    } else if (user.role === 'seller') {
      setCurrentView('seller');
      showToast(`Logged in as Merchant (${user.name})`, 'success');
    } else {
      setCurrentView('buyer');
      showToast(`Logged in as Buyer (${user.name})`, 'success');
    }
  };

  const handleLogout = () => {
    // Reset to generic buyer
    setCurrentUser(DEMO_USERS[2]);
    setCurrentView('buyer');
    showToast('Signed out of persona', 'info');
  };

  // Featured gadget for Hero
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured || p.condition === 'refurbished_a');
  }, [products]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0F172A] text-slate-50 selection:bg-cyan-500 selection:text-slate-950' 
        : 'bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white'
    }`}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/50 text-rose-300'
              : 'bg-cyan-950/95 border-cyan-500/50 text-cyan-300'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Global Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={filters.search}
        setSearchQuery={(q) => setFilters({ ...filters, search: q })}
        comparisonCount={comparedProducts.length}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        totalOrdersCount={orders.length}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {/* BUYER VIEW */}
        {currentView === 'buyer' && (
          <div className="space-y-8 pb-24">
            {/* Hero Banner with Trending Electronics */}
            <HeroBanner
              onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              featuredProducts={featuredProducts}
            />

            {/* Marketplace Grid & Parametric Filter Area */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Parametric Filter Sidebar (3 cols) */}
                <div className="lg:col-span-3 lg:sticky lg:top-20">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilters={() => setFilters(INITIAL_FILTERS)}
                    totalResultsCount={products.length}
                  />
                </div>

                {/* Right Product Grid & Sorting Toolbar (9 cols) */}
                <div className="lg:col-span-9 space-y-4">
                  {/* Sorting & Result Summary Toolbar */}
                  <div className={`backdrop-blur border rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm transition-colors ${
                    isDark 
                      ? 'bg-[#1E293B]/80 border-slate-700/60' 
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      Showing <strong className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}</strong> certified gadgets
                      {filters.category !== 'all' && (
                        <span> in <strong className="text-cyan-500 uppercase font-mono">{filters.category}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <ArrowUpDown className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Sort By:</span>
                      </div>

                      <select
                        id="sort-by-select"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                        className={`border rounded-xl px-3 py-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:border-cyan-500 ${
                          isDark 
                            ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="featured">Featured & Best Deals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Vendor Rating</option>
                        <option value="newest">Newest Arrivals</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filter Chips */}
                  {(filters.category !== 'all' || filters.conditions.length > 0 || filters.rams.length > 0 || filters.search) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Filters:</span>
                      {filters.category !== 'all' && (
                        <button
                          onClick={() => setFilters({ ...filters, category: 'all' })}
                          className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40' 
                              : 'bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100'
                          }`}
                        >
                          <span>Category: {filters.category}</span>
                          <span className="text-cyan-500">✕</span>
                        </button>
                      )}
                      {filters.conditions.map((c) => (
                        <button
                          key={c}
                          onClick={() => setFilters({ ...filters, conditions: filters.conditions.filter((item) => item !== c) })}
                          className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-slate-500' 
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 shadow-xs'
                          }`}
                        >
                          <span>{c.replace('_', ' ')}</span>
                          <span className="text-slate-400">✕</span>
                        </button>
                      ))}
                      {filters.rams.map((r) => (
                        <button
                          key={r}
                          onClick={() => setFilters({ ...filters, rams: filters.rams.filter((item) => item !== r) })}
                          className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-slate-500' 
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 shadow-xs'
                          }`}
                        >
                          <span>{r} RAM</span>
                          <span className="text-slate-400">✕</span>
                        </button>
                      ))}
                      {filters.search && (
                        <button
                          onClick={() => setFilters({ ...filters, search: '' })}
                          className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-slate-500' 
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 shadow-xs'
                          }`}
                        >
                          <span>"{filters.search}"</span>
                          <span className="text-slate-400">✕</span>
                        </button>
                      )}
                      <button
                        onClick={() => setFilters(INITIAL_FILTERS)}
                        className={`text-xs underline ml-2 transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'
                        }`}
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Product Grid */}
                  {isLoading ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading verified electronics catalog...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className={`py-16 text-center border rounded-2xl p-8 space-y-3 transition-colors ${
                      isDark ? 'bg-[#1E293B]/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <PackageSearch className="w-12 h-12 text-slate-400 mx-auto" />
                      <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No gadgets match your filters</h3>
                      <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Try expanding your price range, clearing specific RAM sizes, or resetting condition filters.
                      </p>
                      <button
                        onClick={() => setFilters(INITIAL_FILTERS)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={(p) => setSelectedProduct(p)}
                          isCompared={comparedProducts.some((c) => c.id === product.id)}
                          onToggleCompare={handleToggleCompare}
                          onQuickBuy={(p) => setCheckoutProduct(p)}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELLER PORTAL VIEW */}
        {currentView === 'seller' && (
          <SellerDashboard
            currentUser={currentUser}
            products={adminProducts}
            orders={orders}
            onProductCreated={handleProductCreated}
            onRefreshData={fetchData}
          />
        )}

        {/* ADMIN CONTROL VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard
            stats={stats}
            products={adminProducts}
            disputes={disputes}
            currentUser={currentUser}
            onToggleProductStatus={handleToggleProductStatus}
            onDeleteProduct={handleDeleteProduct}
            onResolveDispute={handleResolveDispute}
            onRefreshData={fetchData}
            onOpenUploadModal={() => setIsAdminUploadModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Comparison Dock at bottom of screen */}
      <ComparisonDock
        comparedProducts={comparedProducts}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onOpenModal={() => setIsComparisonModalOpen(true)}
      />

      {/* Side-by-Side Spec Comparison Modal (up to 3 gadgets) */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        products={comparedProducts}
        onRemoveProduct={handleRemoveCompare}
        onBuyProduct={(p) => setCheckoutProduct(p)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isCompared={selectedProduct ? comparedProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        onBuy={(p) => setCheckoutProduct(p)}
      />

      {/* Escrow Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        currentUser={currentUser}
        isOpen={Boolean(checkoutProduct)}
        onClose={() => setCheckoutProduct(null)}
        onOrderCreated={handleOrderCreated}
      />

      {/* Admin Upload Modal */}
      <AdminUploadModal
        isOpen={isAdminUploadModalOpen}
        onClose={() => setIsAdminUploadModalOpen(false)}
        onProductUploaded={handleProductCreated}
      />

      {/* Auth & Persona Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLogin}
      />

      {/* Footer */}
      <footer className={`border-t py-8 text-xs transition-colors ${
        isDark 
          ? 'border-slate-800/80 bg-[#0B1120] text-slate-400' 
          : 'border-slate-200 bg-white text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AsgLogo size="sm" showText={true} />
            <span className="text-slate-400 hidden md:inline">•</span>
            <span className={`hidden md:inline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Verified Multi-Vendor Electronics Marketplace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>48-Hour Escrow Hold</span>
            <span className="text-slate-400">•</span>
            <span>Serial IMEI Blacklist Check</span>
            <span className="text-slate-400">•</span>
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium cursor-pointer"
            >
              Switch User / Role
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
