export type PortalPage =
  | "account"
  | "admin"
  | "chat"
  | "faq"
  | "home"
  | "mods"
  | "setup"
  | "updates";

export const PORTAL_PATHS: Record<PortalPage, string> = {
  account: "/account",
  admin: "/admin",
  chat: "/chat",
  faq: "/faq",
  home: "/",
  mods: "/mods",
  setup: "/setup",
  updates: "/updates",
};

export function portalPageFromPath(
  pathname: string,
  isAdmin: boolean,
): PortalPage {
  const normalized = `/${pathname.split("/").filter(Boolean).join("/")}`;

  if (normalized === PORTAL_PATHS.setup) return "setup";
  if (normalized === PORTAL_PATHS.mods) return "mods";
  if (normalized === PORTAL_PATHS.chat) return "chat";
  if (normalized === PORTAL_PATHS.faq) return "faq";
  if (normalized === PORTAL_PATHS.updates) return "updates";
  if (normalized === PORTAL_PATHS.account) return "account";
  if (normalized === PORTAL_PATHS.admin && isAdmin) return "admin";
  return "home";
}
