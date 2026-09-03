import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_VENDORS, 
  INITIAL_ORDERS, 
  INITIAL_DISPUTES, 
  SPEC_PRESETS 
} from './src/data/mockData';
import { Product, Vendor, Order, Dispute } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Database Store
  let products: Product[] = [...INITIAL_PRODUCTS];
  let vendors: Vendor[] = [...INITIAL_VENDORS];
  let orders: Order[] = [...INITIAL_ORDERS];
  let disputes: Dispute[] = [...INITIAL_DISPUTES];

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/stats
  app.get('/api/stats', (req: Request, res: Response) => {
    const activeListings = products.filter(p => p.status === 'active').length;
    const offloadedListings = products.filter(p => p.status === 'offloaded').length;
    const totalVendors = vendors.length;
    const totalOrders = orders.length;
    const gmv = orders.reduce((sum, o) => sum + o.total, 0) + 148500000; // base historical GMV in Naira
    const escrowBalance = orders
      .filter(o => o.status === 'escrow_held' || o.status === 'delivered_inspecting' || o.status === 'disputed')
      .reduce((sum, o) => sum + o.total, 0);
    const activeDisputes = disputes.filter(d => d.status === 'open').length;

    res.json({
      gmv,
      activeListings,
      offloadedListings,
      totalVendors,
      totalOrders,
      escrowBalance,
      activeDisputes,
    });
  });

  // GET /api/products
  app.get('/api/products', (req: Request, res: Response) => {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      conditions, 
      rams, 
      storages, 
      sortBy, 
      includeOffloaded,
      vendorId 
    } = req.query;

    let filtered = [...products];

    // Filter by offloaded / active
    if (includeOffloaded !== 'true') {
      filtered = filtered.filter(p => p.status === 'active');
    }

    // Filter by vendor
    if (vendorId && typeof vendorId === 'string') {
      filtered = filtered.filter(p => p.vendorId === vendorId);
    }

    // Filter by Category
    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.upc.includes(q) ||
        p.specs.processor.toLowerCase().includes(q) ||
        p.specs.ram.toLowerCase().includes(q) ||
        p.specs.storage.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q)
      );
    }

    // Filter by Price
    if (minPrice && !isNaN(Number(minPrice))) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Filter by Conditions
    if (conditions && typeof conditions === 'string') {
      const condList = conditions.split(',').filter(Boolean);
      if (condList.length > 0) {
        filtered = filtered.filter(p => condList.includes(p.condition));
      }
    }

    // Filter by RAM
    if (rams && typeof rams === 'string') {
      const ramList = rams.split(',').filter(Boolean).map(r => r.toUpperCase());
      if (ramList.length > 0) {
        filtered = filtered.filter(p => {
          const productRam = p.specs.ram.toUpperCase();
          return ramList.some(r => productRam.includes(r));
        });
      }
    }

    // Filter by Storage
    if (storages && typeof storages === 'string') {
      const storageList = storages.split(',').filter(Boolean).map(s => s.toUpperCase());
      if (storageList.length > 0) {
        filtered = filtered.filter(p => {
          const productStorage = p.specs.storage.toUpperCase();
          return storageList.some(s => productStorage.includes(s));
        });
      }
    }

    // Sorting
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.vendorRating - a.vendorRating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // featured default
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json(filtered);
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const vendor = vendors.find(v => v.id === product.vendorId);
    res.json({ ...product, vendor });
  });

  // POST /api/products (New Gadget listing)
  app.post('/api/products', (req: Request, res: Response) => {
    const data = req.body;
    if (!data.title || !data.price || !data.category) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      brand: data.brand || 'Generic',
      model: data.model || data.title,
      upc: data.upc || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      category: data.category,
      condition: data.condition || 'refurbished_a',
      conditionDescription: data.conditionDescription || 'Inspected and certified in great working order.',
      price: Number(data.price),
      originalPrice: Number(data.originalPrice) || Math.round(Number(data.price) * 1.25),
      vendorId: data.vendorId || 'ven-01',
      vendorName: data.vendorName || 'ApexTech Renewed',
      vendorRating: data.vendorRating || 4.9,
      vendorSalesCount: data.vendorSalesCount || 100,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80'
      ],
      serialNumber: data.serialNumber || `SN-${Date.now()}-VERIFIED`,
      batteryHealth: data.batteryHealth ? Number(data.batteryHealth) : 98,
      specs: {
        processor: data.specs?.processor || 'Multi-Core Processor',
        ram: data.specs?.ram || '16GB',
        storage: data.specs?.storage || '256GB',
        display: data.specs?.display || 'High-Resolution Retina Display',
        battery: data.specs?.battery || 'Long-lasting battery',
        os: data.specs?.os || 'Standard OS',
        connectivity: data.specs?.connectivity || 'Wi-Fi 6, Bluetooth 5.2',
        camera: data.specs?.camera || 'HD Camera system',
        color: data.specs?.color || 'Space Gray',
        ports: data.specs?.ports || 'USB-C',
        weight: data.specs?.weight || 'Standard'
      },
      status: 'active',
      description: data.description || 'Certified tech listing on ASASGADGETS with 48hr escrow protection.',
      warrantyMonths: Number(data.warrantyMonths) || 12,
      inStock: true,
      featured: Boolean(data.featured),
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);

    // Update vendor active listings count
    const vendor = vendors.find(v => v.id === newProduct.vendorId);
    if (vendor) {
      vendor.activeListingsCount += 1;
    }

    res.status(201).json(newProduct);
  });

  // PATCH /api/products/:id/toggle-status (Admin Upload/Offload)
  app.patch('/api/products/:id/toggle-status', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Toggle between 'active' and 'offloaded'
    const newStatus = product.status === 'active' ? 'offloaded' : 'active';
    product.status = newStatus;

    res.json({ 
      success: true, 
      productId: product.id, 
      status: product.status,
      message: `Product successfully ${product.status === 'active' ? 'uploaded/restored to' : 'offloaded/hidden from'} marketplace.`
    });
  });

  // DELETE /api/products/:id
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const [deleted] = products.splice(index, 1);
    res.json({ success: true, deletedId: deleted.id });
  });

  // GET /api/presets
  app.get('/api/presets', (req: Request, res: Response) => {
    res.json(SPEC_PRESETS);
  });

  // GET /api/presets/lookup/:query (UPC or Model number auto-fill)
  app.get('/api/presets/lookup/:query', (req: Request, res: Response) => {
    const q = req.params.query.toLowerCase().trim();
    const match = SPEC_PRESETS.find(p => 
      p.upc.toLowerCase() === q || 
      p.model.toLowerCase() === q ||
      p.title.toLowerCase().includes(q)
    );
    if (!match) {
      return res.status(404).json({ message: 'No preset found matching this UPC or model.' });
    }
    res.json(match);
  });

  // GET /api/vendors
  app.get('/api/vendors', (req: Request, res: Response) => {
    res.json(vendors);
  });

  // GET /api/orders
  app.get('/api/orders', (req: Request, res: Response) => {
    const { buyerId, vendorId } = req.query;
    let filtered = [...orders];
    if (buyerId && typeof buyerId === 'string') {
      filtered = filtered.filter(o => o.buyerId === buyerId);
    }
    if (vendorId && typeof vendorId === 'string') {
      filtered = filtered.filter(o => o.vendorId === vendorId);
    }
    res.json(filtered);
  });

  // POST /api/orders (Create simulated escrow order)
  app.post('/api/orders', (req: Request, res: Response) => {
    const { productId, buyerId, buyerName, buyerEmail, shippingAddress } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const shippingFee = 15000;
    const total = product.price + shippingFee;
    const inspectionDays = 2; // 48-hr escrow inspection period
    const inspectionEndsAt = new Date(Date.now() + inspectionDays * 24 * 60 * 60 * 1000).toISOString();

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      buyerId: buyerId || 'usr-buyer-01',
      buyerName: buyerName || 'Alex Mercer',
      buyerEmail: buyerEmail || 'alex.buyer@gmail.com',
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      price: product.price,
      shippingFee,
      total,
      status: 'escrow_held',
      serialNumber: product.serialNumber,
      shippingAddress: shippingAddress || 'Plot 12 Marina Road, Lagos Island, Lagos, Nigeria',
      createdAt: new Date().toISOString(),
      inspectionEndsAt
    };

    orders.unshift(newOrder);

    // Update vendor escrow balance
    const vendor = vendors.find(v => v.id === product.vendorId);
    if (vendor) {
      vendor.escrowBalance += product.price;
    }

    res.status(201).json(newOrder);
  });

  // GET /api/disputes
  app.get('/api/disputes', (req: Request, res: Response) => {
    res.json(disputes);
  });

  // POST /api/disputes
  app.post('/api/disputes', (req: Request, res: Response) => {
    const { orderId, buyerName, buyerEmail, sellerName, sellerId, productTitle, reason, description, escrowAmount } = req.body;
    const newDispute: Dispute = {
      id: `DISP-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      buyerName: buyerName || 'Buyer',
      buyerEmail: buyerEmail || 'buyer@example.com',
      sellerName: sellerName || 'Seller',
      sellerId: sellerId || 'ven-01',
      productTitle: productTitle || 'Tech Gadget',
      reason: reason || 'Dispute raised',
      description: description || 'Buyer opened an escrow dispute inquiry.',
      escrowAmount: Number(escrowAmount) || 100,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    disputes.unshift(newDispute);

    // Mark corresponding order as disputed if exists
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'disputed';
    }

    res.status(201).json(newDispute);
  });

  // PATCH /api/disputes/:id/resolve (Admin Escrow resolution: Release to Seller OR Refund Buyer)
  app.patch('/api/disputes/:id/resolve', (req: Request, res: Response) => {
    const { decision, note } = req.body; // 'resolved_seller' or 'resolved_buyer'
    const dispute = disputes.find(d => d.id === req.params.id);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    if (decision !== 'resolved_seller' && decision !== 'resolved_buyer') {
      return res.status(400).json({ error: 'Invalid decision: must be resolved_seller or resolved_buyer' });
    }

    dispute.status = decision;
    dispute.resolvedAt = new Date().toISOString();
    dispute.resolutionNote = note || `Admin settled escrow: ${decision === 'resolved_seller' ? 'Funds released to seller after proof verification.' : 'Funds refunded to buyer due to return guarantee.'}`;

    // Update order status
    const order = orders.find(o => o.id === dispute.orderId);
    if (order) {
      order.status = decision === 'resolved_seller' ? 'completed' : 'refunded';
    }

    res.json({ success: true, dispute });
  });

  // ==========================================
  // VITE & STATIC FILES
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASASGADGETS server running on http://localhost:${PORT}`);
  });
}

startServer();
