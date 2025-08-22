// Image reliability monitoring utility
class ImageMonitor {
  private static instance: ImageMonitor;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;

  static getInstance(): ImageMonitor {
    if (!ImageMonitor.instance) {
      ImageMonitor.instance = new ImageMonitor();
    }
    return ImageMonitor.instance;
  }

  recordSuccess(src: string) {
    this.successCount++;
    console.log(`📊 Image Success: ${src} (Success rate: ${this.getSuccessRate()}%)`);
  }

  recordFailure(src: string) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    console.warn(`📊 Image Failure: ${src} (Success rate: ${this.getSuccessRate()}%)`);
    
    // Alert if failure rate is too high
    if (this.getFailureRate() > 20 && this.getTotalAttempts() > 5) {
      console.error('🚨 HIGH IMAGE FAILURE RATE DETECTED:', {
        failureRate: this.getFailureRate(),
        totalAttempts: this.getTotalAttempts(),
        lastFailure: new Date(this.lastFailureTime).toISOString()
      });
    }
  }

  getSuccessRate(): number {
    const total = this.getTotalAttempts();
    return total > 0 ? Math.round((this.successCount / total) * 100) : 100;
  }

  getFailureRate(): number {
    const total = this.getTotalAttempts();
    return total > 0 ? Math.round((this.failureCount / total) * 100) : 0;
  }

  getTotalAttempts(): number {
    return this.successCount + this.failureCount;
  }

  getStats() {
    return {
      successCount: this.successCount,
      failureCount: this.failureCount,
      successRate: this.getSuccessRate(),
      failureRate: this.getFailureRate(),
      totalAttempts: this.getTotalAttempts(),
      lastFailureTime: this.lastFailureTime
    };
  }

  reset() {
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    console.log('📊 Image monitor reset');
  }
}

export const imageMonitor = ImageMonitor.getInstance();