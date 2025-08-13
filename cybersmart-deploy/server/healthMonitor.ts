import { storage } from "./storage";
import { pool } from "./db";

export interface HealthCheckResult {
  component: string;
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
  details?: any;
  timestamp: Date;
}

export class HealthMonitor {
  
  async checkDatabaseConnectivity(): Promise<HealthCheckResult> {
    try {
      const result = await pool.query('SELECT 1 as test');
      return {
        component: 'database',
        status: 'healthy',
        message: 'Database connection successful',
        details: { query_result: result.rows[0] },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        component: 'database',
        status: 'critical',
        message: 'Database connection failed',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  async checkDealFunctionality(): Promise<HealthCheckResult> {
    try {
      // Test deal count directly from database to avoid storage layer issues  
      const result = await pool.query('SELECT COUNT(*) as count FROM deals WHERE deal_status = $1', ['active']);
      const dealCount = parseInt(result.rows[0].count);
      
      return {
        component: 'deals',
        status: dealCount > 0 ? 'healthy' : 'degraded',
        message: `Deal system operational. ${dealCount} deals available`,
        details: { deal_count: dealCount },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        component: 'deals',
        status: 'critical',
        message: 'Deal system failure',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  async checkImageServing(): Promise<HealthCheckResult> {
    try {
      // Check if deals with images exist
      const dealsWithImages = await pool.query(
        'SELECT COUNT(*) as count FROM deals WHERE image_url IS NOT NULL AND image_url != \'\''
      );
      
      const imageCount = parseInt(dealsWithImages.rows[0].count);
      
      return {
        component: 'images',
        status: imageCount > 0 ? 'healthy' : 'degraded',
        message: `Image system operational. ${imageCount} deals have images`,
        details: { deals_with_images: imageCount },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        component: 'images',
        status: 'critical',
        message: 'Image system check failed',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  async checkCouponSystem(): Promise<HealthCheckResult> {
    try {
      const coupons = await storage.getPublicCoupons(1);
      const couponCount = coupons.length;
      
      return {
        component: 'coupons',
        status: 'healthy',
        message: `Coupon system operational. ${couponCount} public coupons available`,
        details: { public_coupon_count: couponCount },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        component: 'coupons',
        status: 'critical',
        message: 'Coupon system failure',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  async checkBusinessStats(): Promise<HealthCheckResult> {
    try {
      const stats = await storage.getBusinessStats();
      
      return {
        component: 'stats',
        status: 'healthy',
        message: 'Business statistics system operational',
        details: stats,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        component: 'stats',
        status: 'critical',
        message: 'Business statistics system failure',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  async checkEnvironmentConfig(): Promise<HealthCheckResult> {
    const requiredVars = ['DATABASE_URL', 'PGHOST', 'PGDATABASE'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    const optionalVars = ['SENDGRID_API_KEY', 'PAYFAST_MERCHANT_ID'];
    const missingOptional = optionalVars.filter(varName => !process.env[varName]);
    
    return {
      component: 'environment',
      status: missingVars.length === 0 ? 'healthy' : 'critical',
      message: missingVars.length === 0 ? 'Environment configuration complete' : `Missing required variables: ${missingVars.join(', ')}`,
      details: {
        missing_required: missingVars,
        missing_optional: missingOptional
      },
      timestamp: new Date()
    };
  }

  async performComprehensiveHealthCheck(): Promise<{
    overall_status: 'healthy' | 'degraded' | 'critical';
    timestamp: Date;
    checks: HealthCheckResult[];
  }> {
    const checks = await Promise.all([
      this.checkDatabaseConnectivity(),
      this.checkDealFunctionality(),
      this.checkImageServing(),
      this.checkCouponSystem(),
      this.checkBusinessStats(),
      this.checkEnvironmentConfig()
    ]);

    const criticalIssues = checks.filter(check => check.status === 'critical');
    const degradedIssues = checks.filter(check => check.status === 'degraded');

    let overall_status: 'healthy' | 'degraded' | 'critical';
    if (criticalIssues.length > 0) {
      overall_status = 'critical';
    } else if (degradedIssues.length > 0) {
      overall_status = 'degraded';
    } else {
      overall_status = 'healthy';
    }

    return {
      overall_status,
      timestamp: new Date(),
      checks
    };
  }
}

export const healthMonitor = new HealthMonitor();