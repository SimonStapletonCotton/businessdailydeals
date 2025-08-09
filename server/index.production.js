// Production server for Cybersmart shared hosting
// Handles clustering since PM2 is not available

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const path = require('path');

if (cluster.isMaster) {
  console.log(`🚀 Business Daily Deals - Master process ${process.pid} starting`);
  console.log(`🔄 Starting ${Math.min(numCPUs, 2)} worker processes`); // Limit to 2 for shared hosting
  
  // Fork workers (limited for shared hosting)
  for (let i = 0; i < Math.min(numCPUs, 2); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });

} else {
  // Worker process
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Import your Express app configuration
  require('./server/index.ts').then(({ registerRoutes }) => {
    registerRoutes(app).then((server) => {
      server.listen(PORT, () => {
        console.log(`✅ Worker ${process.pid} serving on port ${PORT}`);
      });
    });
  }).catch(err => {
    console.error('❌ Worker startup failed:', err);
    process.exit(1);
  });

  // Worker-level graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`🛑 Worker ${process.pid} shutting down`);
    process.exit(0);
  });
}

// Global error handling
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});