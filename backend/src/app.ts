import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes/index.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { requestContextMiddleware } from "./middleware/context.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { csrfProtection } from "./middleware/csrf.js";
import { rateLimit } from "./middleware/rateLimit.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", env.nodeEnv === "production" ? 1 : 0);
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",").map((value) => value.trim()), credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(rateLimit({ keyPrefix: "api", windowMs: 15 * 60 * 1000, max: 400 }));
  app.use(csrfProtection);
  app.use(requestContextMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
