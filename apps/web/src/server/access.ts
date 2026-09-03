export const SIGNUP_NOT_INVITED = "SIGNUP_NOT_INVITED";
export const SIGNUP_EMAIL_UNVERIFIED = "SIGNUP_EMAIL_UNVERIFIED";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseAllowedEmails(value: string): ReadonlySet<string> {
  return new Set(value.split(",").map(normalizeEmail).filter(Boolean));
}

export function isEmailAllowed(
  email: string,
  allowedEmails: ReadonlySet<string>,
): boolean {
  return allowedEmails.has(normalizeEmail(email));
}
