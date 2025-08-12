// Simple demonstration of validation logic
// This shows the core validation process without database complexity

function validateCouponForRedemption(coupon, existingRedemptions = []) {
  console.log(`🔍 Validating coupon: ${coupon?.code || 'UNKNOWN'}\n`);
  
  // Step 1: Check if coupon exists
  if (!coupon) {
    console.log("❌ FAIL: Coupon does not exist");
    return { valid: false, canRedeem: false, reason: "Invalid coupon code" };
  }
  console.log("✅ PASS: Coupon exists");

  // Step 2: Check if already redeemed
  if (coupon.isRedeemed) {
    console.log(`❌ FAIL: Already redeemed on ${coupon.redeemedAt} at ${coupon.redemptionLocation || 'unknown location'}`);
    return { 
      valid: true, 
      canRedeem: false, 
      reason: `Already used on ${coupon.redeemedAt} at ${coupon.redemptionLocation}` 
    };
  }
  console.log("✅ PASS: Not yet redeemed");

  // Step 3: Check expiry
  if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
    console.log(`❌ FAIL: Expired on ${coupon.expiryDate}`);
    return { valid: true, canRedeem: false, reason: "Coupon expired" };
  }
  console.log("✅ PASS: Still valid (not expired)");

  // Step 4: Check redemption history for fraud patterns
  const failedAttempts = existingRedemptions.filter(r => !r.success);
  if (failedAttempts.length > 3) {
    console.log("⚠️  WARNING: Multiple failed redemption attempts detected");
  }

  console.log("🎉 RESULT: Coupon ready for redemption!\n");
  return { valid: true, canRedeem: true, reason: "Ready for redemption" };
}

// Demo scenarios
console.log("=== COUPON VALIDATION DEMO ===\n");

// Scenario 1: Valid coupon
const validCoupon = {
  code: "BDD-ABC123",
  isRedeemed: false,
  expiryDate: "2025-12-31",
  createdAt: "2025-08-10"
};

console.log("SCENARIO 1: Valid coupon");
validateCouponForRedemption(validCoupon);

// Scenario 2: Already redeemed coupon
const redeemedCoupon = {
  code: "BDD-XYZ789",
  isRedeemed: true,
  redeemedAt: "2025-08-10",
  redemptionLocation: "Main Branch Cape Town",
  expiryDate: "2025-12-31"
};

console.log("SCENARIO 2: Already redeemed coupon");
validateCouponForRedemption(redeemedCoupon);

// Scenario 3: Expired coupon
const expiredCoupon = {
  code: "BDD-OLD999",
  isRedeemed: false,
  expiryDate: "2025-07-31",
  createdAt: "2025-07-15"
};

console.log("SCENARIO 3: Expired coupon");
validateCouponForRedemption(expiredCoupon);

// Scenario 4: Non-existent coupon
console.log("SCENARIO 4: Non-existent coupon");
validateCouponForRedemption(null);

console.log("=== SECURITY DEMONSTRATION ===\n");

// Show how redemption attempt is logged
function logRedemptionAttempt(couponCode, success, location, failureReason = null) {
  const logEntry = {
    id: `log-${Date.now()}`,
    couponCode,
    attemptedAt: new Date().toISOString(),
    success,
    location,
    failureReason,
    ipAddress: "192.168.1.100", // Example IP
    userAgent: "Mozilla/5.0..." // Example user agent
  };
  
  console.log("📋 Audit Log Entry:", JSON.stringify(logEntry, null, 2));
  return logEntry;
}

// Example audit logs
console.log("AUDIT TRAIL EXAMPLES:\n");

console.log("1. Successful redemption:");
logRedemptionAttempt("BDD-ABC123", true, "Main Branch Johannesburg");

console.log("\n2. Failed attempt (already redeemed):");
logRedemptionAttempt("BDD-ABC123", false, "Branch 2 Durban", "Already redeemed on 2025-08-10 at Main Branch Johannesburg");

console.log("\n3. Failed attempt (expired):");
logRedemptionAttempt("BDD-OLD999", false, "Online Store", "Coupon expired on 2025-07-31");

console.log("\n=== KEY SECURITY BENEFITS ===");
console.log("✓ Prevents multiple redemptions across branches");
console.log("✓ Complete audit trail for all attempts");
console.log("✓ Location tracking shows exactly where used");  
console.log("✓ IP and user agent tracking for technical security");
console.log("✓ Clear error messages prevent customer confusion");
console.log("✓ Verification codes prove legitimate redemptions");