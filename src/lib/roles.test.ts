import { describe, expect, it } from "vitest";
import { canManageOperations, hasAdminRole } from "./roles";

describe("operations role access", () => {
  it("allows each staff role and denies users with no staff role", () => {
    expect(canManageOperations(["admin"])).toBe(true);
    expect(canManageOperations(["ops_manager"])).toBe(true);
    expect(canManageOperations(["guide"])).toBe(true);
    expect(canManageOperations(["finance"])).toBe(true);
    expect(canManageOperations([])).toBe(false);
  });

  it("grants role administration to admins only", () => {
    expect(hasAdminRole(["admin"])).toBe(true);
    expect(hasAdminRole(["finance"])).toBe(false);
  });
});