import { describe, expect, it } from "vitest";
import { fieldServiceMenu, fieldServicePages, mountainMenu, mountainPages, safariMenu, safariPages } from "./site-content";

describe("public navigation destinations", () => {
  it("includes every requested mountain menu destination", () => {
    expect(mountainMenu.map((item) => item.title)).toEqual([
      "Mountain private trek",
      "Mountain group treks",
      "Batian & Nelion climbing",
      "Climbing Kilimanjaro",
      "Kenya day trip",
      "Climbing Mount Elgon",
      "Mount Kenya flight tour",
    ]);
    expect(mountainMenu.every((item) => item.slug in mountainPages)).toBe(true);
  });

  it("includes every requested safari menu destination", () => {
    expect(safariMenu.map((item) => item.title)).toEqual([
      "Kenya wildlife safaris",
      "Northern Kenya safaris",
      "Kenya day trip safaris",
      "Tanzania wildlife safaris",
    ]);
    expect(safariMenu.every((item) => item.slug in safariPages)).toBe(true);
  });

  it("gives every field-service menu item a destination page", () => {
    expect(fieldServiceMenu.length).toBeGreaterThan(0);
    expect(fieldServiceMenu.every((item) => item.slug in fieldServicePages)).toBe(true);
  });
});