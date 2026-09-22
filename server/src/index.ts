import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env, isProd } from "./env.js";
import { authRouter } from "./auth.js";
import { applicationsRouter } from "./applications.js";
import { recommendRouter } from "./recommend.js";
import { staffRouter } from "./staff.js";

const app = express();

app.disable("x-powered-by");
if (isProd) app.set("trust proxy", 1); // behind the host's load balancer: use the real client IP

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }),
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

// CSRF defence for cookie sessions: state-changing requests must come from our own site.
// (Cookies are also SameSite=Lax, and only JSON bodies are accepted.)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("origin") !== env.CLIENT_ORIGIN) {
    res.status(403).json({ code: "bad_origin", error: "Request blocked." });
    return;
  }
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/recommend", recommendRouter);
app.use("/api/staff", staffRouter);

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required." });
    return;
  }
  // TODO: send an email or save to a database.
  console.log("Contact form submission:", { name, email, message });
  res.json({ ok: true });
});

// Never leak internals; log the message only (no request bodies — they hold personal data).
app.use((err: Error & { status?: number; code?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ code: "file_too_large", error: "That file is too large. The limit is 10 MB." });
    return;
  }
  if (err.code?.startsWith("LIMIT_")) {
    res.status(400).json({ code: "validation", error: "Please check your upload and try again." });
    return;
  }
  const status = err.status && err.status < 500 ? err.status : 500;
  if (status === 500) console.error("Unhandled error:", err.message);
  res.status(status).json({ code: "error", error: status === 500 ? "Something went wrong." : "Bad request." });
});

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
