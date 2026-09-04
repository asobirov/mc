const MAP_PREFIX = "/map";

export function blueMapTarget(baseUrl: string, requestUrl: string) {
  const incoming = new URL(requestUrl);
  const target = new URL(baseUrl);
  const suffix = incoming.pathname.slice(MAP_PREFIX.length) || "/";

  target.pathname = `${target.pathname.replace(/\/$/, "")}${suffix}`;
  target.search = incoming.search;
  return target;
}

export function blueMapLocation(location: string | null) {
  if (!location?.startsWith("/")) return location;
  return `${MAP_PREFIX}${location}`;
}
