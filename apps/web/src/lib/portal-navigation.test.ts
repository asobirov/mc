import { describe, expect, it } from "vitest";

import { PORTAL_PATHS, portalPageFromPath } from "./portal-navigation";

describe("portal navigation", () => {
  it("maps public portal paths to their page", () => {
    expect(portalPageFromPath(PORTAL_PATHS.home, false)).toBe("home");
    expect(portalPageFromPath("/setup/", false)).toBe("setup");
    expect(portalPageFromPath(PORTAL_PATHS.mods, false)).toBe("mods");
    expect(portalPageFromPath(PORTAL_PATHS.account, false)).toBe("account");
  });

  it("keeps the admin page behind the admin role", () => {
    expect(portalPageFromPath(PORTAL_PATHS.admin, true)).toBe("admin");
    expect(portalPageFromPath(PORTAL_PATHS.admin, false)).toBe("home");
  });

  it("falls back safely for unknown paths", () => {
    expect(portalPageFromPath("/not-a-real-page", true)).toBe("home");
  });
});
