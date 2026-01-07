import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import cookieParser from "cookie-parser";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

/**
 * Parse CLI args like:
 *   --port 32107
 *   --port=32107
 */
function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) return process.argv[idx + 1];

  const withEquals = process.argv.find((a) => a.startsWith(flag + "="));
  if (withEquals) return withEquals.split("=").slice(1).join("=");

  return undefined;
}

app.use(cookieParser());
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

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
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Main server (the one that Vite/HMR hooks onto)
  const httpServer = createServer(app);

  await registerRoutes(httpServer, app);

  // Error handler: respond but DO NOT crash the server
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Prefer env PORT if present, otherwise use Dyad's --port, otherwise 5000.
  const portArg = getArgValue("--port");
  const envPort = process.env.PORT ?? (process.env as any).port;
  const mainPort = Number(envPort || portArg || 5000);

  httpServer.listen(mainPort, "0.0.0.0", () => {
    log(`serving on port ${mainPort}`);
    log(`env PORT=${process.env.PORT} env port=${(process.env as any).port} arg --port=${portArg}`, "debug");
  });

  /**
   * Dyad Preview often expects port 5000.
   * If our main server is not on 5000, also open a simple secondary listener on 5000.
   * (No HMR on this secondary port, but Preview will load.)
   */
  if (mainPort !== 5000) {
    const previewServer = createServer(app);

    previewServer.on("error", (e: any) => {
      log(`could not listen on 5000 for preview: ${e?.code || e?.message}`, "preview");
    });

    previewServer.listen(5000, "0.0.0.0", () => {
      log(`also listening on port 5000 for Dyad Preview`, "preview");
    });
  }
})();
