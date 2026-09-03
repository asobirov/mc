import { describe, expect, it } from "vitest";

import { isEmailAllowed, normalizeEmail, parseAllowedEmails } from "./access";

describe("email access control", () => {
  it("normalizes case and whitespace", () => {
    expect(normalizeEmail("  Friend@Example.COM ")).toBe("friend@example.com");
  });

  it("parses a comma-separated allowlist", () => {
    const emails = parseAllowedEmails(
      "owner@example.com, FRIEND@example.com, ",
    );

    expect([...emails]).toEqual(["owner@example.com", "friend@example.com"]);
  });

  it("only admits exact normalized addresses", () => {
    const emails = parseAllowedEmails("friend@example.com");

    expect(isEmailAllowed("FRIEND@example.com", emails)).toBe(true);
    expect(isEmailAllowed("stranger@example.com", emails)).toBe(false);
  });
});
