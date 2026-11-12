import { describe, expect, it } from "vitest";
import { fieldServiceMenu, fieldServicePages, mountainMenu, mountainPages, safariMenu, safariPages } from "./site-content";

describe("public navigation destinations", () => {
  it("includes every requested mountain menu destination", () => {
    expect(mountainMenu.map((item) => item.title)).toEqual([
      "Mount Kenya Private Treks",
      "Mount Kenya Group Departures",
      "Technical Climbing — Batian & Nelion",
      "Climb Kilimanjaro",
      "Mount Elgon Trek",
      "Mount Kenya Day Hike",
    ]);
    expect(mountainMenu.every((item) => item.slug in mountainPages)).toBe(true);
  });

  it("includes every requested safari menu destination", () => {
    expect(safariMenu.map((item) => item.title)).toEqual([
      "Kenya Wildlife Safaris",
      "Northern Kenya Safaris",
      "Tanzania Wildlife Safaris",
      "Kenya Day Trip Safaris",
    ]);
    expect(safariMenu.every((item) => item.slug in safariPages)).toBe(true);
  });

  it("gives every field-service menu item a destination page", () => {
    expect(fieldServiceMenu.length).toBeGreaterThan(0);
    expect(fieldServiceMenu.every((item) => item.slug in fieldServicePages)).toBe(true);
  });
});