import { describe, expect, it, vi } from "vitest";
import type { CloudflareBindings } from "@/lib/cloudflare-bindings";
import { handleCloudflareApi } from "@/lib/cloudflare-api";

const validInquiry = {
  name: "Amina Example",
  email: "amina@example.test",
  phone: "+254700000000",
  service: "Mount Kenya trek",
  travel_dates: "August",
  party_size: 2,
  nationality: "resident",
  message: "Please send route details.",
};

function createBindings(rateCount = "0") {
  const insertedValues: unknown[] = [];
  const kvPut = vi.fn(async () => {});
  const bindings: CloudflareBindings = {
    DB: {
      prepare: () => ({
        async run() {
          return { success: true };
        },
        bind: (...values) => {
          insertedValues.push(...values);
          return {
            async run() {
              return { success: true };
            },
          };
        },
      }),
    },
    RATE_LIMIT: {
      get: vi.fn(async () => rateCount),
      put: kvPut,
    },
  };
  return { bindings, insertedValues, kvPut };
}

function request(body: unknown) {
  return new Request("https://example.test/api/inquiries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });
}

describe("Cloudflare public inquiry endpoint", () => {
  it("stores a validated enquiry in D1 and applies the KV rate limit", async () => {
    const { bindings, insertedValues, kvPut } = createBindings();
    const response = await handleCloudflareApi(request(validInquiry), bindings);

    expect(response?.status).toBe(201);
    expect(insertedValues).toHaveLength(10);
    expect(insertedValues[1]).toBe("Amina Example");
    expect(insertedValues[8]).toBe("Please send route details.");
    expect(kvPut).toHaveBeenCalledWith(expect.stringMatching(/^public-inquiry:/), "1", {
      expirationTtl: 3600,
    });
  });

  it("rejects invalid enquiries without writing to D1", async () => {
    const { bindings, insertedValues, kvPut } = createBindings();
    const response = await handleCloudflareApi(
      request({ ...validInquiry, party_size: 0 }),
      bindings,
    );

    expect(response?.status).toBe(400);
    expect(insertedValues).toHaveLength(0);
    expect(kvPut).not.toHaveBeenCalled();
  });

  it("returns a service-unavailable response if Cloudflare bindings are missing", async () => {
    const response = await handleCloudflareApi(request(validInquiry), {});
    expect(response?.status).toBe(503);
  });

  it("rejects requests after the per-IP KV limit is reached", async () => {
    const { bindings, insertedValues, kvPut } = createBindings("5");
    const response = await handleCloudflareApi(request(validInquiry), bindings);

    expect(response?.status).toBe(429);
    expect(insertedValues).toHaveLength(0);
    expect(kvPut).not.toHaveBeenCalled();
  });
});
