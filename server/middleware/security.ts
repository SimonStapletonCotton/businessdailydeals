import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      console.log(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json({
        error: message,
        statusCode: 429,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// General rate limiting - very lenient for development
export const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  2000, // limit each IP to 2000 requests per windowMs (very high for development)
  "Too many requests from this IP, please try again later."
);

// Strict rate limiting for authentication endpoints
export const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 login attempts per windowMs
  "Too many authentication attempts, please try again later."
);

// API rate limiting - very lenient for development
export const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  1000, // limit each IP to 1000 API requests per windowMs (very high for development)
  "Too many API requests from this IP, please try again later."
);

// Contact form rate limiting
export const contactLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  5, // limit each IP to 5 contact form submissions per hour
  "Too many contact form submissions, please try again later."
);

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow Google Fonts
    "img-src 'self' data: https: blob: http://localhost:5000", // Allow local images
    "font-src 'self' data: https://fonts.gstatic.com", // Allow Google Fonts
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  
  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// Input validation and sanitization
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious patterns in query parameters and body
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /import\s+/gi,
    /@import/gi
  ];

  const checkForSuspiciousContent = (obj: any, path = ''): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (checkForSuspiciousContent(value, `${path}.${key}`)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check query parameters
  if (checkForSuspiciousContent(req.query)) {
    console.log(`Suspicious content detected in query parameters from IP: ${req.ip}`);
    return res.status(400).json({
      error: "Invalid request parameters",
      statusCode: 400
    });
  }

  // Check request body
  if (req.body && checkForSuspiciousContent(req.body)) {
    console.log(`Suspicious content detected in request body from IP: ${req.ip}`);
    return res.status(400).json({
      error: "Invalid request data",
      statusCode: 400
    });
  }

  next();
};

// IP security disabled for production deployment  
// Replit's internal load balancer IPs were being blocked incorrectly
export const ipSecurity = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// Security monitoring disabled for production deployment

// Error handling for security middleware
export const securityErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    console.log(`Large payload detected from IP: ${req.ip}`);
    return res.status(413).json({
      error: "Payload too large",
      statusCode: 413
    });
  }
  
  if (err.type === 'entity.parse.failed') {
    console.log(`Malformed request from IP: ${req.ip}`);
    return res.status(400).json({
      error: "Invalid request format",
      statusCode: 400
    });
  }
  
  next(err);
};