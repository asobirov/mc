export const SIGNUP_EMAIL_UNVERIFIED = "SIGNUP_EMAIL_UNVERIFIED";

export const accessRoles = ["admin", "member"] as const;
export const accessStatuses = ["approved", "blocked", "pending"] as const;
export const accessActions = [
  "approve",
  "block",
  "reset",
  "promote",
  "demote",
] as const;

export type AccessAction = (typeof accessActions)[number];
export type AccessRole = (typeof accessRoles)[number];
export type AccessStatus = (typeof accessStatuses)[number];

export type AccessRecord = {
  accessStatus: AccessStatus;
  role: AccessRole;
  verified: boolean;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseAdminEmails(value: string): ReadonlySet<string> {
  return new Set(value.split(",").map(normalizeEmail).filter(Boolean));
}

export function isAdminEmail(
  email: string,
  adminEmails: ReadonlySet<string>,
): boolean {
  return adminEmails.has(normalizeEmail(email));
}

export function initialAccessForEmail(
  email: string,
  adminEmails: ReadonlySet<string>,
): AccessRecord {
  if (isAdminEmail(email, adminEmails)) {
    return { accessStatus: "approved", role: "admin", verified: true };
  }

  return { accessStatus: "pending", role: "member", verified: false };
}

export function normalizeAccessRecord(record: {
  accessStatus?: unknown;
  role?: unknown;
  verified?: unknown;
}): AccessRecord {
  const role = accessRoles.includes(record.role as AccessRole)
    ? (record.role as AccessRole)
    : "member";
  const accessStatus = accessStatuses.includes(
    record.accessStatus as AccessStatus,
  )
    ? (record.accessStatus as AccessStatus)
    : "pending";

  return {
    accessStatus,
    role,
    verified: record.verified === true || record.verified === 1,
  };
}

export function canAccessPortal(record: AccessRecord): boolean {
  return record.accessStatus === "approved" && record.verified;
}

export function accessUpdateForAction(
  action: AccessAction,
): Partial<AccessRecord> {
  switch (action) {
    case "approve":
      return { accessStatus: "approved", verified: true };
    case "block":
      return { accessStatus: "blocked", verified: false };
    case "reset":
      return { accessStatus: "pending", verified: false };
    case "promote":
      return { accessStatus: "approved", role: "admin", verified: true };
    case "demote":
      return { role: "member" };
  }
}
