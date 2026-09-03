export type PortalPage = "account" | "admin" | "home" | "mods" | "setup";

export const PORTAL_PATHS: Record<PortalPage, string> = {
  account: "/account",
  admin: "/admin",
  home: "/",
  mods: "/mods",
  setup: "/setup",
};

export function portalPageFromPath(
  pathname: string,
  isAdmin: boolean,
): PortalPage {
  const normalized = `/${pathname.split("/").filter(Boolean).join("/")}`;

  if (normalized === PORTAL_PATHS.setup) return "setup";
  if (normalized === PORTAL_PATHS.mods) return "mods";
  if (normalized === PORTAL_PATHS.account) return "account";
  if (normalized === PORTAL_PATHS.admin && isAdmin) return "admin";
  return "home";
}
