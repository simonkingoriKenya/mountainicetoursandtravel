import type { CloudflareBindings } from "@/lib/cloudflare-bindings";

const MAX_BODY_BYTES = 12_000;
const MAX_REQUESTS_PER_HOUR = 5;
const RATE_LIMIT_TTL_SECONDS = 60 * 60;

type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  travel_dates: string;
  party_size: number;
  nationality: "resident" | "non_resident";
  message: string;
};

export async function handleCloudflareApi(
  request: Request,
  rawBindings: unknown,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/inquiries") return null;
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, { allow: "POST" });
  }

  const bindings = rawBindings as CloudflareBindings;
  if (!bindings.DB || !bindings.RATE_LIMIT) {
    return json({ error: "Cloudflare inquiry storage is not configured." }, 503);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: "The enquiry is too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json({ error: "The enquiry could not be read." }, 400);
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return json({ error: "The enquiry is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "Send a valid enquiry." }, 400);
  }

  const payload = validateInquiry(body);
  if (!payload) return json({ error: "Check the enquiry details and try again." }, 400);

  try {
    const ipAddress = request.headers.get("cf-connecting-ip") ?? "unknown";
    const key = `public-inquiry:${await sha256(ipAddress)}`;
    const requestCount = Number((await bindings.RATE_LIMIT.get(key)) ?? "0");
    if (!Number.isFinite(requestCount) || requestCount >= MAX_REQUESTS_PER_HOUR) {
      return json({ error: "Too many enquiries. Please try again later." }, 429);
    }
    await bindings.RATE_LIMIT.put(key, String(requestCount + 1), {
      expirationTtl: RATE_LIMIT_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Cloudflare KV rate limiting failed.", error);
    return json({ error: "Enquiry service is temporarily unavailable." }, 503);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  try {
    const result = await bindings.DB.prepare(
      `INSERT INTO inquiries (
        id, name, email, phone, service, travel_dates, party_size,
        nationality, status, source, message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', 'website', ?, ?)`,
    )
      .bind(
        id,
        payload.name,
        payload.email,
        payload.phone,
        payload.service,
        payload.travel_dates,
        payload.party_size,
        payload.nationality,
        payload.message,
        createdAt,
      )
      .run();
    if (result.success === false) throw new Error("D1 insert failed.");
  } catch (error) {
    console.error("Cloudflare D1 inquiry insert failed.", error);
    return json({ error: "Enquiry service is temporarily unavailable." }, 503);
  }

  return json({ id }, 201);
}

function validateInquiry(value: unknown): InquiryPayload | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const name = boundedText(body["name"], 2, 140);
  const email = boundedText(body["email"], 5, 254);
  const phone = boundedText(body["phone"], 0, 80);
  const service = boundedText(body["service"], 2, 160);
  const travelDates = boundedText(body["travel_dates"], 0, 120);
  const message = boundedText(body["message"], 0, 3_000);
  const partySize = body["party_size"];
  const nationality = body["nationality"];

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone === null ||
    !service ||
    travelDates === null ||
    message === null ||
    typeof partySize !== "number" ||
    !Number.isInteger(partySize) ||
    partySize < 1 ||
    partySize > 30 ||
    (nationality !== "resident" && nationality !== "non_resident")
  ) {
    return null;
  }

  return {
    name,
    email,
    phone,
    service,
    travel_dates: travelDates,
    party_size: partySize,
    nationality,
    message,
  };
}

function boundedText(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length >= min && text.length <= max ? text : null;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(
  body: Record<string, string>,
  status: number,
  extraHeaders: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...extraHeaders },
  });
}
