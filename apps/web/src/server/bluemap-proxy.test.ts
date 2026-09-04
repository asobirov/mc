import { describe, expect, it } from "vitest";

import { blueMapLocation, blueMapTarget } from "./bluemap-proxy";

describe("BlueMap proxy", () => {
  it("strips the public map prefix and keeps the query string", () => {
    expect(
      blueMapTarget(
        "http://friends-mc:8100",
        "https://mc.xpr.im/map/maps/world/live/players.json?since=42",
      ).toString(),
    ).toBe("http://friends-mc:8100/maps/world/live/players.json?since=42");
  });

  it("maps the public root to the BlueMap root", () => {
    expect(
      blueMapTarget(
        "http://friends-mc:8100/",
        "https://mc.xpr.im/map/",
      ).toString(),
    ).toBe("http://friends-mc:8100/");
  });

  it("rewrites root-relative redirects back under the private map path", () => {
    expect(blueMapLocation("/index.html")).toBe("/map/index.html");
    expect(blueMapLocation("https://example.com/")).toBe(
      "https://example.com/",
    );
  });
});
