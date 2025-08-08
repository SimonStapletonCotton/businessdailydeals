import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 30 * 24 * 60 * 60 * 1000; // 30 days - extended for better UX
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: true, // Changed to true to refresh session on activity
    saveUninitialized: false,
    rolling: true, // Extend session on activity
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      maxAge: sessionTtl,
      sameSite: 'lax', // Allow cross-site requests for authentication
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const claims = tokens.claims();
    if (!claims) {
      verified(new Error("No claims in token"), false);
      return;
    }
    const user = {
      id: claims.sub,
      email: claims.email,
    };
    updateUserSession(user, tokens);
    // Ensure the ID is accessible after session updates
    user.id = claims.sub;
    await upsertUser(claims);
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Use the first domain from REPLIT_DOMAINS for localhost development
    const domain = req.hostname === 'localhost' ? process.env.REPLIT_DOMAINS!.split(",")[0] : req.hostname;
    passport.authenticate(`replitauth:${domain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Use the first domain from REPLIT_DOMAINS for localhost development
    const domain = req.hostname === 'localhost' ? process.env.REPLIT_DOMAINS!.split(",")[0] : req.hostname;
    passport.authenticate(`replitauth:${domain}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  
  console.log(`[AUTH DEBUG] isAuthenticated: ${req.isAuthenticated()}`);
  console.log(`[AUTH DEBUG] user:`, user);
  console.log(`[AUTH DEBUG] user.id:`, user?.id);
  console.log(`[AUTH DEBUG] user.claims.sub:`, user?.claims?.sub);

  if (!req.isAuthenticated()) {
    console.log(`[AUTH DEBUG] Authentication failed - not authenticated`);
    return res.status(401).json({ 
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Not authenticated"
    });
  }

  if (!user.expires_at) {
    return res.status(401).json({ 
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Session expired"
    });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    // Session is still valid, refresh it by touching the session
    req.session.touch();
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ 
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Session expired, please login again"
    });
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    req.session.touch(); // Touch session after refresh
    return next();
  } catch (error) {
    return res.status(401).json({ 
      message: "Unauthorized",
      loginUrl: "/api/login",
      redirectReason: "Failed to refresh session, please login again"
    });
  }
};
