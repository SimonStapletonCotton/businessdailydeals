import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import { initializeDatabase } from "./db-selector";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("🚀 Starting Business Daily Deals B2B Marketplace...");
    
    // Log environment information for debugging
    log(`🌐 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    log(`🚢 PORT: ${process.env.PORT || 'not set (will default to 5000)'}`);
    log(`💾 DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'not set'}`);
    
    // Verify required environment variables
    const requiredEnvVars = ['DATABASE_URL'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      log(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
      log(`🔍 Available environment variables: ${Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('KEY')).join(', ')}`);
      process.exit(1);
    }
    
    log("✅ Environment variables verified");

    // Test database connection before starting server
    try {
      await testDatabaseConnection();
    } catch (error) {
      log(`❌ Database connection test failed: ${error}`);
      process.exit(1);
    }

    // Register API routes BEFORE Vite middleware to ensure proper routing
    const server = await registerRoutes(app);
    log("✅ Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      log(`❌ Error ${status}: ${message}`);
      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log("✅ Vite development server setup complete");
    } else {
      serveStatic(app);
      log("✅ Static file serving enabled for production");
    }

    // Use PORT environment variable for production deployment compatibility
    // Default to 5000 for development, but prefer production PORT if available
    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🎉 Business Daily Deals server successfully started on port ${port}`);
      log(`🌐 Environment: ${app.get("env")}`);
      log(`📊 Health check available at: http://0.0.0.0:${port}/api/health`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      log('🔄 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      log('🔄 SIGINT received, shutting down gracefully...');
      server.close(() => {
        log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    log(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
})();
