import { describe, expect, it } from "vitest";
import { convertUsd, rentalTotal, tourEstimate, tours } from "./tours";

describe("user-stated tour rates and pricing controls", () => {
  it("preserves the stated USD prices for the principal routes", () => {
    expect(tours.find((tour) => tour.slug === "sirimon-chogoria")?.startingUsd).toBe(1120);
    expect(tours.find((tour) => tour.slug === "sirimon-chogoria")?.highestUsd).toBe(1350);
    expect(tours.find((tour) => tour.slug === "naro-moru")?.startingUsd).toBe(820);
    expect(tours.find((tour) => tour.slug === "machame")?.startingUsd).toBe(2250);
    expect(tours.find((tour) => tour.slug === "lemosho")?.startingUsd).toBe(2520);
    expect(tours.find((tour) => tour.slug === "meru")?.startingUsd).toBe(920);
  });

  it("converts between the five listed currencies and calculates rentals by day", () => {
    expect(convertUsd(100, "USD")).toBe(100);
    expect(convertUsd(100, "EUR")).toBe(92);
    expect(convertUsd(100, "GBP")).toBe(79);
    expect(convertUsd(100, "CAD")).toBe(136);
    expect(convertUsd(100, "KES")).toBe(12900);
    expect(rentalTotal(8, 3, 2, "USD")).toBe("$48");
  });

  it("shows resident and non-resident park fee treatment without inventing fees", () => {
    expect(tourEstimate(tours[0], 1, "USD", "resident").label).toContain("Resident / citizen");
    expect(tourEstimate(tours[0], 1, "USD", "resident").label).toContain("park fees checked separately");
    expect(tourEstimate(tours[0], 1, "USD", "non_resident").label).toContain("Non-resident");
  });
});
