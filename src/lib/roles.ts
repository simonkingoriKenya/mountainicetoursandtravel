export const APP_ROLES = ["admin", "ops_manager", "guide", "finance"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export function canManageOperations(roles: AppRole[]) {
  return roles.some((role) => APP_ROLES.includes(role));
}

export function hasAdminRole(roles: AppRole[]) {
  return roles.includes("admin");
}