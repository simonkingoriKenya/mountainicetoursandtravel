import { describe, expect, it } from "vitest";
import { fieldNotes } from "./editorial-content";

describe("field-note links", () => {
  it("provides unique, readable article destinations for the blog cards", () => {
    const slugs = fieldNotes.map((note) => note.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(fieldNotes.every((note) => note.title.length > 0 && note.paragraphs.length > 0)).toBe(true);
  });
});
