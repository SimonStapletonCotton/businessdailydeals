#!/bin/bash
echo "🏗️ Building Business Daily Deals for Production Deployment"
echo "📦 Target: www.businessdailydeals.co.za (Cybersmart)"
echo ""

# Set production environment
export NODE_ENV=production

# Build the application
echo "⚡ Building frontend and backend..."
npm run build

echo ""
echo "✅ Production build complete!"
echo "📁 Built files ready in dist/ directory"
echo ""
echo "📋 Next Steps:"
echo "1. Download dist/ folder contents"
echo "2. Upload to Cybersmart cPanel File Manager"
echo "3. Place in public_html/businessdailydeals.co.za/"
echo "4. MySQL will activate automatically"
echo ""
echo "🎉 Your marketplace will be live at www.businessdailydeals.co.za"