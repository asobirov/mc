import { describe, expect, it } from "vitest";

import {
  accessUpdateForAction,
  canAccessPortal,
  initialAccessForEmail,
  normalizeAccessRecord,
  normalizeEmail,
  parseAdminEmails,
} from "./access";

describe("access control", () => {
  it("normalizes admin emails", () => {
    expect(normalizeEmail("  Owner@Example.COM ")).toBe("owner@example.com");
    expect([
      ...parseAdminEmails("owner@example.com, ADMIN@example.com, "),
    ]).toEqual(["owner@example.com", "admin@example.com"]);
  });

  it("bootstraps owners and puts everyone else in review", () => {
    const admins = parseAdminEmails("owner@example.com");

    expect(initialAccessForEmail("OWNER@example.com", admins)).toEqual({
      accessStatus: "approved",
      role: "admin",
      verified: true,
    });
    expect(initialAccessForEmail("friend@example.com", admins)).toEqual({
      accessStatus: "pending",
      role: "member",
      verified: false,
    });
  });

  it("treats legacy or malformed rows as untrusted", () => {
    expect(normalizeAccessRecord({})).toEqual({
      accessStatus: "pending",
      role: "member",
      verified: false,
    });
    expect(normalizeAccessRecord({ verified: 1 })).toEqual({
      accessStatus: "pending",
      role: "member",
      verified: true,
    });
  });

  it("requires both approval and owner verification", () => {
    expect(
      canAccessPortal({
        accessStatus: "approved",
        role: "member",
        verified: true,
      }),
    ).toBe(true);
    expect(
      canAccessPortal({
        accessStatus: "approved",
        role: "member",
        verified: false,
      }),
    ).toBe(false);
  });

  it("maps admin actions to minimal safe updates", () => {
    expect(accessUpdateForAction("approve")).toEqual({
      accessStatus: "approved",
      verified: true,
    });
    expect(accessUpdateForAction("block")).toEqual({
      accessStatus: "blocked",
      verified: false,
    });
    expect(accessUpdateForAction("promote")).toEqual({
      accessStatus: "approved",
      role: "admin",
      verified: true,
    });
  });
});
