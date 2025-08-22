#!/bin/bash

# Business Daily Deals - Stability Check Script
# Prevents functionality degradation over time

echo "=== Business Daily Deals Stability Check ==="
echo "Starting comprehensive system health verification..."
echo "Timestamp: $(date)"
echo

# Check if server is running
echo "1. Checking server availability..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
    echo "Attempting to restart workflow..."
    exit 1
fi

# Check detailed system health
echo
echo "2. Performing comprehensive health check..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health/detailed)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | grep -o '"overall_status":"[^"]*"' | cut -d'"' -f4)

echo "Overall system status: $HEALTH_STATUS"

if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo "✅ All systems operational"
elif [ "$HEALTH_STATUS" = "degraded" ]; then
    echo "⚠️  System degradation detected"
    echo "Detailed report:"
    echo $HEALTH_RESPONSE | jq '.' 2>/dev/null || echo $HEALTH_RESPONSE
elif [ "$HEALTH_STATUS" = "critical" ]; then
    echo "❌ Critical system issues detected"
    echo "Detailed report:"
    echo $HEALTH_RESPONSE | jq '.' 2>/dev/null || echo $HEALTH_RESPONSE
    exit 1
else
    echo "❓ Unknown health status"
    echo $HEALTH_RESPONSE
fi

# Test critical functionality
echo
echo "3. Testing critical functionality..."

# Test image serving
echo "Testing image serving..."
if curl -s -I http://localhost:5000/public-objects/test.jpg | head -1 | grep -q "404\|200"; then
    echo "✅ Image serving endpoint accessible"
else
    echo "⚠️  Image serving may have issues"
fi

# Test deal retrieval
echo "Testing deal retrieval..."
DEALS_RESPONSE=$(curl -s http://localhost:5000/api/deals)
DEALS_COUNT=$(echo $DEALS_RESPONSE | grep -o '"id"' | wc -l)
echo "✅ Retrieved $DEALS_COUNT deals"

# Test business stats
echo "Testing business statistics..."
STATS_RESPONSE=$(curl -s http://localhost:5000/api/business/stats)
if echo $STATS_RESPONSE | grep -q "activeSuppliers"; then
    echo "✅ Business statistics functional"
else
    echo "⚠️  Business statistics may have issues"
fi

echo
echo "=== Stability Check Complete ==="
echo "Timestamp: $(date)"

# Return appropriate exit code
if [ "$HEALTH_STATUS" = "critical" ]; then
    exit 1
else
    exit 0
fi