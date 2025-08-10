#!/bin/bash

# Business Daily Deals - Stability Check Script
# Run this before any major changes or deployment

echo "=== Business Daily Deals Stability Check ==="
echo "Started: $(date)"

# 1. Health Check
echo "1. Testing API health..."
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    echo "✓ API health check passed"
else
    echo "✗ API health check failed"
    exit 1
fi

# 2. Deal Types Check
echo "2. Checking deal types..."
DEAL_RESPONSE=$(curl -s http://localhost:5000/api/deals)
if echo "$DEAL_RESPONSE" | grep -q '"dealType":"hot"' && echo "$DEAL_RESPONSE" | grep -q '"dealType":"regular"'; then
    echo "✓ Deal types are properly set"
else
    echo "✗ Deal types check failed"
fi

# 3. Image Serving Check
echo "3. Testing image serving..."
if curl -f -s -I http://localhost:5000/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg > /dev/null; then
    echo "✓ Image serving is working"
else
    echo "✗ Image serving check failed"
fi

# 4. Database Connection Check
echo "4. Testing database connection..."
if curl -s http://localhost:5000/api/business/stats | grep -q "activeSuppliers"; then
    echo "✓ Database connection working"
else
    echo "✗ Database connection check failed"
fi

# 5. Critical Files Check
echo "5. Checking critical files exist..."
CRITICAL_FILES=(
    "client/src/components/deal-card-fixed.tsx"
    "client/src/pages/find-me-deal.tsx"
    "client/src/pages/home-comprehensive.tsx"
    "server/routes.ts"
    "shared/schema.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
    fi
done

# 6. Check for hardcoded deal types
echo "6. Checking for hardcoded deal types..."
if grep -r "HOT DEAL" client/src/components/deal-card-fixed.tsx | grep -v "dealType"; then
    echo "✗ Found hardcoded 'HOT DEAL' in deal-card-fixed.tsx"
else
    echo "✓ No hardcoded deal types found"
fi

echo "=== Stability Check Complete ==="
echo "Finished: $(date)"