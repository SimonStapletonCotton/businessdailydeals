#!/usr/bin/env node
// Business Daily Deals - Simplified Production Server for cPanel
// Direct server without module exports for cPanel compatibility

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting Business Daily Deals server...');
console.log('📂 Current directory:', __dirname);
console.log('🌐 Port:', PORT);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'production',
    promotional_period: 'FREE until February 20, 2026',
    server: 'Business Daily Deals v1.0'
  });
});

// Sample deals data
const sampleDeals = [
  {
    id: '1',
    title: 'Premium Office Furniture Sale',
    description: 'High-quality office furniture at wholesale prices. Perfect for startups and established businesses.',
    price: 'R2,500 - R15,000',
    originalPrice: 'R5,000 - R25,000',
    discount: '50%',
    supplier: 'Office Solutions SA',
    location: 'Johannesburg, GP',
    imageUrl: '/public-objects/business-furniture.jpg',
    dealType: 'hot',
    expiryDate: '2026-03-15'
  },
  {
    id: '2',
    title: 'Industrial Printing Services',
    description: 'Bulk printing services for marketing materials, business cards, and corporate stationery.',
    price: 'R0.50 per page',
    originalPrice: 'R1.20 per page',
    discount: '58%',
    supplier: 'PrintTech Solutions',
    location: 'Cape Town, WC',
    imageUrl: '/public-objects/printing-services.jpg',
    dealType: 'hot',
    expiryDate: '2026-04-01'
  },
  {
    id: '3',
    title: 'Bulk Stationery Package',
    description: 'Complete office stationery package for small to medium businesses.',
    price: 'R850',
    originalPrice: 'R1,200',
    discount: '29%',
    supplier: 'Stationery World',
    location: 'Durban, KZN',
    imageUrl: '/public-objects/office-supplies.jpg',
    dealType: 'regular',
    expiryDate: '2026-05-15'
  }
];

// API Routes
app.get('/api/deals', (req, res) => {
  console.log('Deals API called with query:', req.query);
  const { type } = req.query;
  
  let deals = sampleDeals;
  
  if (type === 'hot') {
    deals = sampleDeals.filter(deal => deal.dealType === 'hot');
  } else if (type === 'regular') {
    deals = sampleDeals.filter(deal => deal.dealType === 'regular');
  }
  
  console.log(`Returning ${deals.length} deals`);
  res.json(deals);
});

app.get('/api/business/stats', (req, res) => {
  console.log('Business stats API called');
  res.json({
    activeSuppliers: '1',
    totalDeals: '13',
    successfulConnections: '01',
    totalSavings: 10023
  });
});

// Catch-all for React Router
app.get('*', (req, res) => {
  console.log('Serving React app for:', req.path);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Business Daily Deals server running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 API test: http://localhost:${PORT}/test-api.html`);
});