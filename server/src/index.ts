import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import compression from "compression";
import helmet from "helmet";

type BookingRequestInput = {
  name: string;
  contact: string;
  time: string;
  remarks?: string;
  expertId?: string;
};

type BookingRecord = BookingRequestInput & {
  id: string;
  createdAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  // Simple ID for demo purposes.
  // TODO(you): Use a DB-generated ID (UUID) once you connect Postgres/RDS.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function validateBookingInput(body: unknown): { ok: true; value: BookingRequestInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid JSON body." };
  const obj = body as Record<string, unknown>;

  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const contact = typeof obj.contact === "string" ? obj.contact.trim() : "";
  const time = typeof obj.time === "string" ? obj.time.trim() : "";
  const remarks = typeof obj.remarks === "string" ? obj.remarks.trim() : undefined;
  const expertId = typeof obj.expertId === "string" ? obj.expertId.trim() : undefined;

  if (!name) return { ok: false, error: "Missing field: name" };
  if (!contact) return { ok: false, error: "Missing field: contact" };
  if (!time) return { ok: false, error: "Missing field: time" };

  return { ok: true, value: { name, contact, time, remarks, expertId } };
}

const app = express();

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));

/**
 * Health check endpoint for ALB Target Group.
 * CDK will configure the target group to check this path.
 */
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", ts: nowIso() });
});

/**
 * Minimal “dynamic” endpoint: booking requests.
 *
 * IMPORTANT: This stores data in-memory so it will be lost whenever the task restarts.
 * TODO(you): For real deployment, connect to Postgres (RDS) and persist bookings.
 * - Put RDS in private subnets
 * - Put ECS tasks in private subnets
 * - Allow only ECS -> RDS security group ingress
 * - Store credentials in Secrets Manager / SSM Parameter Store (do NOT hardcode)
 */
const bookings: BookingRecord[] = [];

app.post("/api/bookings", (req, res) => {
  const parsed = validateBookingInput(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const record: BookingRecord = {
    ...parsed.value,
    id: createId(),
    createdAt: nowIso(),
  };
  bookings.push(record);

  // In production you’d log to CloudWatch via awslogs driver.
  console.log("[booking.created]", record);

  res.status(201).json({ id: record.id });
});

/**
 * Debug endpoint (NOT for production).
 * TODO(you): Protect admin/debug endpoints with auth (Cognito/OAuth) or remove them.
 */
app.get("/api/bookings", (req, res) => {
  const allow = process.env.NODE_ENV !== "production" || req.query.allow === "true";
  if (!allow) {
    res.status(404).end();
    return;
  }
  res.json({ items: bookings });
});

// ---------- Static frontend hosting ----------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * STATIC_DIR points to the built frontend (Vite) output directory.
 *
 * In Docker we copy `web/dist` into `server/public`, so the default works.
 * TODO(you): If you change the Docker layout, update STATIC_DIR accordingly.
 */
const STATIC_DIR =
  process.env.STATIC_DIR ?? path.join(__dirname, "..", "public");

app.use(express.static(STATIC_DIR, { maxAge: "1h", index: false }));

// For SPA routing (works for BrowserRouter). With HashRouter this is optional, but harmless.
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(STATIC_DIR, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`[server] listening on http://${host}:${port}`);
  console.log(`[server] serving static from: ${STATIC_DIR}`);
});


