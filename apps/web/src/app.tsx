import type { FormEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Boxes,
  Check,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Gamepad2,
  House,
  Link2,
  LogOut,
  MessageCircle,
  Mic2,
  MoreHorizontal,
  Pickaxe,
  RefreshCw,
  ScrollText,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
  UserX,
  Utensils,
} from "lucide-react";

import type { ChatMessage, ChatResponse } from "./lib/chat";
import type { ModCatalogResponse, ModCategory } from "./lib/mod-catalog";
import type { PortalPage } from "./lib/portal-navigation";
import { authClient } from "./lib/auth-client";
import { MOD_CATEGORIES } from "./lib/mod-catalog";
import { PORTAL_PATHS, portalPageFromPath } from "./lib/portal-navigation";

const SERVER_ADDRESS = "mc.xpr.im";
const PACK_RELEASE_DATE = "September 3, 2026";
const PACK_VERSION = "1.1.1";
const PAGE_TITLES: Record<PortalPage, string> = {
  account: "Account",
  admin: "Admin",
  chat: "Chat",
  faq: "FAQ",
  home: "Home",
  mods: "Mods",
  setup: "Setup",
  updates: "Updates",
};

const launchers = {
  prism: {
    name: "Prism Launcher",
    optionLabel: "Prism Launcher — recommended",
    downloadLabel: "Get Prism",
    downloadUrl: "https://prismlauncher.org/download/",
    install:
      "Download Prism, install it, then sign in with the Microsoft account that owns Minecraft: Java Edition.",
    import:
      "Choose Add Instance → Import, then select the downloaded Friends MC .mrpack file.",
    launch:
      "Open the Friends MC instance settings, give it 8–10 GB of memory, then launch.",
  },
  modrinth: {
    name: "Modrinth App",
    optionLabel: "Modrinth App",
    downloadLabel: "Get Modrinth",
    downloadUrl: "https://modrinth.com/app",
    install:
      "Download the official Modrinth App, install it, then sign in with the Microsoft account that owns Minecraft: Java Edition.",
    import:
      "Click + to create an instance, choose From file / Import, then select the Friends MC .mrpack file.",
    launch:
      "Open the imported Friends MC profile, set its memory to 8–10 GB, then press Play.",
  },
  sklauncher: {
    name: "SKlauncher 4",
    optionLabel: "SKlauncher 4",
    downloadLabel: "Get SKlauncher",
    downloadUrl: "https://next.skmedix.pl/downloads",
    install:
      "Download SKlauncher 4 only from the official skmedix.pl site, install it, then add the Microsoft account that owns Minecraft: Java Edition.",
    import:
      "Drag the Friends MC .mrpack onto SKlauncher, or choose Import Modpack and select the file.",
    launch:
      "Open the imported Friends MC instance, set maximum memory to 8–10 GB, then launch.",
  },
} as const;

type LauncherId = keyof typeof launchers;
type AuthProvider = "discord" | "google" | "microsoft";

type AuthProviderConfig = Record<AuthProvider, boolean>;

type LinkedAccount = {
  accountId: string;
  providerId: string;
};

type AccessRole = "admin" | "member";
type AccessStatus = "approved" | "blocked" | "pending";
type AccessAction = "approve" | "block" | "reset" | "promote" | "demote";

type AccessUser = {
  accessStatus: AccessStatus;
  createdAt: number | string | null;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  name: string;
  protectedAdmin: boolean;
  role: AccessRole;
  verified: boolean;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.77-5.61-4.14H3.04v2.62A10 10 0 0 0 12 22"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.85A6 6 0 0 1 6.07 12c0-.64.11-1.27.32-1.85V7.53H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.47z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.78.5 3.82 1.49l2.88-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.53l3.35 2.62C7.18 7.78 9.39 6.01 12 6.01"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19.54 5.34A16.65 16.65 0 0 0 15.44 4c-.18.32-.39.76-.53 1.1a15.4 15.4 0 0 0-4.82 0A11 11 0 0 0 9.55 4c-1.44.25-2.81.7-4.1 1.34C2.85 9.22 2.15 13 2.5 16.73a16.5 16.5 0 0 0 5.03 2.54c.41-.55.77-1.14 1.08-1.76a10.7 10.7 0 0 1-1.7-.82l.42-.33c3.27 1.5 6.82 1.5 10.05 0l.43.33c-.55.33-1.12.6-1.71.82.31.62.67 1.21 1.08 1.76a16.4 16.4 0 0 0 5.03-2.54c.41-4.33-.7-8.08-2.67-11.39M8.98 14.44c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2c1 0 1.8.91 1.79 2 0 1.1-.79 2-1.79 2m6.04 0c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2c1 0 1.8.91 1.79 2 0 1.1-.79 2-1.79 2"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path fill="#f35325" d="M2 2h9.5v9.5H2z" />
      <path fill="#81bc06" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#05a6f0" d="M2 12.5h9.5V22H2z" />
      <path fill="#ffba08" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

function ProviderIcon({ provider }: { provider: AuthProvider }) {
  if (provider === "discord") return <DiscordIcon />;
  if (provider === "microsoft") return <MicrosoftIcon />;
  return <GoogleIcon />;
}

async function loadAuthProviders(
  signal?: AbortSignal,
): Promise<AuthProviderConfig> {
  const response = await fetch("/api/config", { signal });
  if (!response.ok) throw new Error("Could not load sign-in options");
  const config = (await response.json()) as {
    authProviders?: Partial<AuthProviderConfig>;
  };
  return {
    discord: config.authProviders?.discord === true,
    google: config.authProviders?.google === true,
    microsoft: config.authProviders?.microsoft === true,
  };
}

function SignIn() {
  const [busyProvider, setBusyProvider] = useState<AuthProvider | null>(null);
  const error = new URLSearchParams(window.location.search).get("error");
  const errorMessage = error
    ? error === "SIGNUP_EMAIL_UNVERIFIED"
      ? "That login provider has not verified your email address."
      : "Sign-in did not finish. Please try again."
    : null;
  const [providers, setProviders] = useState<AuthProviderConfig>({
    discord: false,
    google: true,
    microsoft: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    void loadAuthProviders(controller.signal)
      .then(setProviders)
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  async function signIn(provider: AuthProvider) {
    setBusyProvider(provider);
    await authClient.signIn.social({ provider, callbackURL: "/" });
    setBusyProvider(null);
  }

  return (
    <main className="login-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="login-card">
        <div className="brand-mark" aria-hidden="true">
          <Pickaxe size={30} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">Private Minecraft server</p>
        <h1>Friends MC</h1>
        <p className="lede">
          The modpack, setup guide, and server details — kept between friends.
        </p>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        <div className="auth-buttons">
          <button
            className="auth-button google"
            disabled={busyProvider !== null}
            onClick={() => void signIn("google")}
            type="button"
          >
            <GoogleIcon />
            {busyProvider === "google"
              ? "Opening Google…"
              : "Continue with Google"}
          </button>
          {providers.discord ? (
            <button
              className="auth-button discord"
              disabled={busyProvider !== null}
              onClick={() => void signIn("discord")}
              type="button"
            >
              <DiscordIcon />
              {busyProvider === "discord"
                ? "Opening Discord…"
                : "Continue with Discord"}
            </button>
          ) : null}
          {providers.microsoft ? (
            <button
              className="auth-button microsoft"
              disabled={busyProvider !== null}
              onClick={() => void signIn("microsoft")}
              type="button"
            >
              <MicrosoftIcon />
              {busyProvider === "microsoft"
                ? "Opening Microsoft…"
                : "Continue with Microsoft"}
            </button>
          ) : null}
        </div>

        <p className="login-note">
          <ShieldCheck size={16} /> Sign in to request access from the server
          owner.
        </p>
      </section>
    </main>
  );
}

function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [providers, setProviders] = useState<AuthProviderConfig>({
    discord: false,
    google: true,
    microsoft: false,
  });
  const [loading, setLoading] = useState(true);
  const [busyProvider, setBusyProvider] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void Promise.all([authClient.listAccounts(), loadAuthProviders()])
      .then(([accountResult, providerConfig]) => {
        if (!active) return;
        if (accountResult.error) {
          throw new Error(
            accountResult.error.message ?? "Could not load connected accounts",
          );
        }
        setAccounts(accountResult.data);
        setProviders(providerConfig);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load connected accounts",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function connect(provider: AuthProvider) {
    setBusyProvider(provider);
    setError(null);
    const result = await authClient.linkSocial({
      callbackURL: "/",
      provider,
    });
    if (result.error) {
      setError(result.error.message ?? `Could not connect ${provider}`);
      setBusyProvider(null);
    }
  }

  const availableProviders = (
    ["google", "discord", "microsoft"] as const
  ).filter((provider) => providers[provider]);

  return (
    <section className="connections-section">
      <div className="section-heading connections-heading">
        <div>
          <p className="eyebrow">Your account</p>
          <h2>Connected sign-ins</h2>
        </div>
        <p>
          Use any connected provider to get back into this same Friends MC
          account.
        </p>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? (
        <p className="admin-empty">Checking connections…</p>
      ) : (
        <div className="connections-list">
          {availableProviders.map((provider) => {
            const connected = accounts.some(
              (account) => account.providerId === provider,
            );
            const label =
              provider === "google"
                ? "Google"
                : provider === "discord"
                  ? "Discord"
                  : "Microsoft";
            return (
              <article className={`connection-row ${provider}`} key={provider}>
                <span className="connection-icon">
                  <ProviderIcon provider={provider} />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>
                    {connected
                      ? "Connected"
                      : provider === "microsoft"
                        ? "Connect the Microsoft account you use for Minecraft"
                        : "Add another way to sign in"}
                  </span>
                </div>
                {connected ? (
                  <span className="connected-chip">
                    <Check size={14} /> Connected
                  </span>
                ) : (
                  <button
                    disabled={busyProvider !== null}
                    onClick={() => void connect(provider)}
                    type="button"
                  >
                    <Link2 size={15} />
                    {busyProvider === provider ? "Opening…" : "Connect"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
      <p className="connections-note">
        Linking Microsoft identifies your account here. Automatic Minecraft
        whitelist syncing will be added separately.
      </p>
    </section>
  );
}

function ModsCatalog() {
  const [catalog, setCatalog] = useState<ModCatalogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | ModCategory>(
    "all",
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ModCategory>
  >(() => new Set(["technology", "food"]));

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/mods", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the mod list");
        return (await response.json()) as ModCatalogResponse;
      })
      .then(setCatalog)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          reason instanceof Error ? reason.message : "Could not load mods",
        );
      });
    return () => controller.abort();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleMods =
    catalog?.mods.filter(
      (mod) =>
        (activeCategory === "all" || mod.category === activeCategory) &&
        (normalizedQuery.length === 0 ||
          mod.name.toLowerCase().includes(normalizedQuery) ||
          mod.description.toLowerCase().includes(normalizedQuery) ||
          mod.fileName.toLowerCase().includes(normalizedQuery)),
    ) ?? [];
  const categoryCounts = new Map(
    MOD_CATEGORIES.map((category) => [
      category.id,
      catalog?.mods.filter((mod) => mod.category === category.id).length ?? 0,
    ]),
  );
  const visibleGroups = MOD_CATEGORIES.map((category) => ({
    ...category,
    mods: visibleMods.filter((mod) => mod.category === category.id),
  })).filter((category) => category.mods.length > 0);

  function toggleCategory(category: ModCategory) {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <section className="mods-section">
      <div className="section-heading mods-heading">
        <div>
          <p className="eyebrow">Inside the pack</p>
          <h2>The full mod list</h2>
        </div>
        {catalog ? (
          <span>
            {catalog.mods.length} mods · Pack {catalog.version}
          </span>
        ) : null}
      </div>

      <label className="mods-search">
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">Search mods</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Create, cooking, voice chat…"
          type="search"
          value={query}
        />
        {catalog ? <span>{visibleMods.length} shown</span> : null}
      </label>

      {catalog ? (
        <div aria-label="Filter mods by category" className="mods-filters">
          <button
            className={activeCategory === "all" ? "active" : undefined}
            onClick={() => setActiveCategory("all")}
            type="button"
          >
            All <span>{catalog.mods.length}</span>
          </button>
          {MOD_CATEGORIES.filter(
            (category) => (categoryCounts.get(category.id) ?? 0) > 0,
          ).map((category) => (
            <button
              className={activeCategory === category.id ? "active" : undefined}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              {category.label}{" "}
              <span>{categoryCounts.get(category.id) ?? 0}</span>
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="mods-state error">{error}</p> : null}
      {!catalog && !error ? (
        <p className="mods-state">Reading the modpack…</p>
      ) : null}
      {catalog && visibleMods.length === 0 ? (
        <p className="mods-state">No mods match “{query}”.</p>
      ) : null}

      {catalog && visibleGroups.length > 0 ? (
        <div className="mods-groups">
          {visibleGroups.map((group) => {
            const isExpanded =
              normalizedQuery.length > 0 ||
              activeCategory !== "all" ||
              expandedCategories.has(group.id);

            return (
              <section
                className={`mod-group${isExpanded ? " expanded" : ""}`}
                key={group.id}
              >
                <button
                  aria-expanded={isExpanded}
                  className="mod-group-toggle"
                  onClick={() => toggleCategory(group.id)}
                  type="button"
                >
                  <div>
                    <h3>{group.label}</h3>
                    <p>{group.description}</p>
                  </div>
                  <span>{group.mods.length}</span>
                </button>
                {isExpanded ? (
                  <div className="mods-list">
                    {group.mods.map((mod) => (
                      <article
                        className="mod-row"
                        key={mod.fileName}
                        title={mod.fileName}
                      >
                        <span className="mod-icon">
                          {mod.iconUrl ? (
                            <img alt="" loading="lazy" src={mod.iconUrl} />
                          ) : (
                            <Box aria-hidden="true" size={17} />
                          )}
                        </span>
                        <div>
                          <strong>{mod.name}</strong>
                          <p>{mod.description}</p>
                        </div>
                        {mod.projectId ? (
                          <a
                            aria-label={`Open ${mod.name} on Modrinth`}
                            href={`https://modrinth.com/project/${mod.slug ?? mod.projectId}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <ExternalLink size={15} />
                          </a>
                        ) : (
                          <span className="bundled-label">Bundled</span>
                        )}
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [bridgeEnabled, setBridgeEnabled] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastId = useRef(0);
  const scrollArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const response = await fetch(`/api/chat?after=${lastId.current}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Could not load chat");
      const data = (await response.json()) as ChatResponse;
      if (!active) return;
      setBridgeEnabled(data.bridgeEnabled);
      if (data.messages.length > 0) {
        lastId.current = data.messages.at(-1)?.id ?? lastId.current;
        setMessages((current) => {
          const byId = new Map(current.map((message) => [message.id, message]));
          for (const message of data.messages) byId.set(message.id, message);
          return [...byId.values()].sort((left, right) => left.id - right.id);
        });
      }
      setError(null);
    }

    void load().catch(() => setError("Chat is temporarily unavailable"));
    const timer = window.setInterval(
      () => void load().catch(() => setError("Chat is reconnecting…")),
      3_000,
    );
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    scrollArea.current?.scrollTo({
      behavior: messages.length > 1 ? "smooth" : "auto",
      top: scrollArea.current.scrollHeight,
    });
  }, [messages]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const messageBody = body.trim();
    if (!messageBody || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({ body: messageBody }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as {
        error?: string;
        message?: ChatMessage;
        relayError?: string;
      };
      if (!response.ok || !data.message) {
        throw new Error(data.error ?? "Could not send message");
      }
      const sentMessage = data.message;
      lastId.current = Math.max(lastId.current, sentMessage.id);
      setMessages((current) => [...current, sentMessage]);
      setBody("");
      if (data.relayError) setError(data.relayError);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not send message",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat-section">
      <div className="chat-panel">
        <header>
          <div>
            <span className={`bridge-dot${bridgeEnabled ? " online" : ""}`} />
            {bridgeEnabled ? "Connected to game chat" : "Portal chat"}
          </div>
          <span>Approved members only</span>
        </header>
        <div aria-live="polite" className="chat-messages" ref={scrollArea}>
          {messages.length === 0 ? (
            <div className="chat-empty">
              <MessageCircle aria-hidden="true" />
              <strong>No messages yet</strong>
              <span>Say hello here or from inside Minecraft.</span>
            </div>
          ) : (
            messages.map((message) => (
              <article
                className={`chat-message ${message.source}`}
                key={message.id}
              >
                <div>
                  <strong>{message.authorName}</strong>
                  <span>{message.source === "game" ? "In game" : "Web"}</span>
                  <time dateTime={new Date(message.createdAt).toISOString()}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p>{message.body}</p>
              </article>
            ))
          )}
        </div>
        <form
          className="chat-composer"
          onSubmit={(event) => void sendMessage(event)}
        >
          <label>
            <span className="sr-only">Message server chat</span>
            <input
              maxLength={240}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Message friends in game…"
              value={body}
            />
          </label>
          <button disabled={sending || body.trim().length === 0} type="submit">
            <Send aria-hidden="true" size={17} />
            <span>{sending ? "Sending…" : "Send"}</span>
          </button>
        </form>
        {error ? <p className="chat-error">{error}</p> : null}
      </div>
    </section>
  );
}

function FrequentlyAskedQuestions({
  launcher,
  launcherId,
  selectLauncher,
}: {
  launcher: (typeof launchers)[LauncherId];
  launcherId: LauncherId;
  selectLauncher: (id: LauncherId) => void;
}) {
  return (
    <section className="faq-section">
      <article className="faq-item">
        <div className="faq-question">
          <span>01</span>
          <div>
            <p className="eyebrow">Client updates</p>
            <h2>How do I upgrade the modpack?</h2>
          </div>
        </div>
        <div className="faq-answer">
          <label className="launcher-picker">
            <span>Your launcher</span>
            <select
              onChange={(event) =>
                selectLauncher(event.target.value as LauncherId)
              }
              value={launcherId}
            >
              {Object.entries(launchers).map(([id, option]) => (
                <option key={id} value={id}>
                  {option.optionLabel}
                </option>
              ))}
            </select>
          </label>
          <ol>
            <li>
              <strong>Download the newest pack</strong>
              <p>
                Use the button below so your client matches the live server.
              </p>
            </li>
            <li>
              <strong>Import it as a new Friends MC instance</strong>
              <p>
                In {launcher.name}, choose Import / From file and select the new
                <code> .mrpack</code>. A fresh instance prevents removed mods
                from lingering and causing a mismatch.
              </p>
            </li>
            <li>
              <strong>Set 8–10 GB of memory, then launch</strong>
              <p>
                Sign in with the licensed Microsoft account you normally use.
                The server address is already included.
              </p>
            </li>
            <li>
              <strong>Delete the old instance after the new one works</strong>
              <p>
                Screenshots and personal map data can be copied first. Do not
                copy the old <code>mods</code> or <code>config</code> folders
                over.
              </p>
            </li>
          </ol>
          <a className="primary-button" href="/api/modpack">
            <Download size={18} /> Download v{PACK_VERSION} (latest)
          </a>
        </div>
      </article>
    </section>
  );
}

function PackUpdates() {
  return (
    <section className="updates-section">
      <article className="release-card current-release">
        <header>
          <div>
            <p className="eyebrow">Current release</p>
            <h2>Friends MC {PACK_VERSION}</h2>
          </div>
          <div className="release-meta">
            <span>Latest</span>
            <time dateTime="2026-09-03">{PACK_RELEASE_DATE}</time>
          </div>
        </header>
        <p className="release-summary">
          A bigger adventure update with Twilight Forest, new food integrations,
          and safer world generation. This is the version the live server
          expects.
        </p>
        <ul className="change-list">
          <li>
            <Check aria-hidden="true" />
            <div>
              <strong>Added The Twilight Forest 4.8.3345</strong>
              <p>
                A full new dimension with biomes, dungeons, progression, loot,
                and bosses.
              </p>
            </div>
          </li>
          <li>
            <Check aria-hidden="true" />
            <div>
              <strong>Added Twilight Flavors &amp; Delight 3.2.2</strong>
              <p>
                Connects the new dimension to Farmer&apos;s Delight with 35
                foods, four knives, and more cooking utility.
              </p>
            </div>
          </li>
          <li>
            <Check aria-hidden="true" />
            <div>
              <strong>Improved Twilight world-generation stability</strong>
              <p>
                Added the maintained thread-safety integration so Twilight
                generation works cleanly with the pack&apos;s performance stack.
              </p>
            </div>
          </li>
          <li>
            <Check aria-hidden="true" />
            <div>
              <strong>Fixed the bundled multiplayer server</strong>
              <p>
                The server now appears correctly in a newly imported instance,
                ready to join at {SERVER_ADDRESS}.
              </p>
            </div>
          </li>
          <li>
            <Check aria-hidden="true" />
            <div>
              <strong>Validated the full client and server</strong>
              <p>
                Clean-launch tested with all 199 client mods, then checked
                against a fresh server install and Twilight-generated chunks.
              </p>
            </div>
          </li>
        </ul>
        <div className="release-actions">
          <a className="primary-button" href="/api/modpack">
            <Download size={18} /> Download version {PACK_VERSION}
          </a>
          <span>Minecraft 1.21.1 · NeoForge 21.1.248</span>
        </div>
      </article>

      <aside className="update-note">
        <strong>Updating from an older pack?</strong>
        <p>
          Import this download as a new instance. Don&apos;t copy the old mods
          or config folders over; the FAQ has the short upgrade walkthrough.
        </p>
      </aside>
    </section>
  );
}

function AccessAdmin({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadUsers() {
    setError(null);
    const response = await fetch("/api/admin/users");
    if (!response.ok) throw new Error("Could not load access requests");
    const data = (await response.json()) as { users: AccessUser[] };
    setUsers(data.users);
  }

  useEffect(() => {
    void loadUsers()
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error ? reason.message : "Could not load users",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  async function act(user: AccessUser, action: AccessAction) {
    setBusyId(user.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        body: JSON.stringify({ action }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const data = (await response.json()) as {
        error?: string;
        user?: AccessUser;
      };
      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Could not update this person");
      }
      setUsers((current) =>
        current.map((item) => (item.id === data.user?.id ? data.user : item)),
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not update user",
      );
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = users.filter(
    (user) => user.accessStatus === "pending",
  ).length;

  return (
    <section className="admin-section">
      <div className="section-heading admin-heading">
        <div>
          <p className="eyebrow">Owner controls</p>
          <h2>Access requests</h2>
        </div>
        <button
          aria-label="Refresh access requests"
          className="refresh-button"
          onClick={() =>
            void loadUsers().catch(() => setError("Refresh failed"))
          }
          type="button"
        >
          <RefreshCw size={16} /> {pendingCount} pending
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? (
        <p className="admin-empty">Loading people…</p>
      ) : (
        <div className="people-list">
          {users.map((user) => {
            const isBusy = busyId === user.id;
            const isSelf = user.id === currentUserId;
            return (
              <article className="person-row" key={user.id}>
                <div className="person-avatar">
                  {user.image ? <img alt="" src={user.image} /> : user.name[0]}
                </div>
                <div className="person-copy">
                  <div>
                    <strong>{user.name || user.email.split("@")[0]}</strong>
                    {user.role === "admin" ? <Crown size={14} /> : null}
                  </div>
                  <span>{user.email}</span>
                </div>
                <span className={`access-chip ${user.accessStatus}`}>
                  {user.accessStatus}
                </span>
                <div className="person-actions">
                  {user.accessStatus !== "approved" ? (
                    <button
                      disabled={isBusy}
                      onClick={() => void act(user, "approve")}
                      type="button"
                    >
                      <UserCheck size={15} /> Approve
                    </button>
                  ) : null}
                  {user.accessStatus !== "blocked" &&
                  !isSelf &&
                  !user.protectedAdmin ? (
                    <button
                      className="danger"
                      disabled={isBusy}
                      onClick={() => void act(user, "block")}
                      type="button"
                    >
                      <UserX size={15} /> Block
                    </button>
                  ) : null}
                  {user.accessStatus === "blocked" && !user.protectedAdmin ? (
                    <button
                      disabled={isBusy}
                      onClick={() => void act(user, "reset")}
                      type="button"
                    >
                      Reset
                    </button>
                  ) : null}
                  {user.role === "member" ? (
                    <button
                      disabled={isBusy}
                      onClick={() => void act(user, "promote")}
                      type="button"
                    >
                      <Shield size={15} /> Make admin
                    </button>
                  ) : !isSelf && !user.protectedAdmin ? (
                    <button
                      disabled={isBusy}
                      onClick={() => void act(user, "demote")}
                      type="button"
                    >
                      Make member
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Portal({ user }: { user: AccessUser }) {
  const [copied, setCopied] = useState(false);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [launcherId, setLauncherId] = useState<LauncherId>(() => {
    const saved = window.localStorage.getItem("friends-mc-launcher");
    return saved && saved in launchers ? (saved as LauncherId) : "prism";
  });
  const launcher = launchers[launcherId];
  const fallbackName = user.email.split("@")[0] ?? "Friend";
  const displayName = user.name.trim().length > 0 ? user.name : fallbackName;
  const isAdmin = user.role === "admin";
  const page = portalPageFromPath(pathname, isAdmin);
  const navigationItems = [
    {
      href: PORTAL_PATHS.home,
      icon: <House aria-hidden="true" />,
      label: "Home",
      page: "home" as PortalPage,
    },
    {
      href: PORTAL_PATHS.setup,
      icon: <Gamepad2 aria-hidden="true" />,
      label: "Setup",
      page: "setup" as PortalPage,
    },
    {
      href: PORTAL_PATHS.mods,
      icon: <Boxes aria-hidden="true" />,
      label: "Mods",
      page: "mods" as PortalPage,
    },
    {
      href: PORTAL_PATHS.chat,
      icon: <MessageCircle aria-hidden="true" />,
      label: "Chat",
      page: "chat" as PortalPage,
    },
    {
      href: PORTAL_PATHS.faq,
      icon: <CircleHelp aria-hidden="true" />,
      label: "FAQ",
      page: "faq" as PortalPage,
    },
    {
      href: PORTAL_PATHS.updates,
      icon: <ScrollText aria-hidden="true" />,
      label: "Updates",
      page: "updates" as PortalPage,
    },
    {
      href: PORTAL_PATHS.account,
      icon: <CircleUserRound aria-hidden="true" />,
      label: "Account",
      page: "account" as PortalPage,
    },
    ...(isAdmin
      ? [
          {
            href: PORTAL_PATHS.admin,
            icon: <UsersRound aria-hidden="true" />,
            label: "Admin",
            page: "admin" as PortalPage,
          },
        ]
      : []),
  ];
  const primaryNavigationItems = navigationItems.filter((item) =>
    (["home", "setup", "mods", "chat"] as PortalPage[]).includes(item.page),
  );
  const moreNavigationItems = navigationItems.filter(
    (item) => !primaryNavigationItems.includes(item),
  );
  const moreIsActive = moreNavigationItems.some((item) => item.page === page);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = `${PAGE_TITLES[page]} · Friends MC`;
  }, [page]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.closest("details")?.removeAttribute("open");
    window.history.pushState({}, "", href);
    setPathname(href);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(SERVER_ADDRESS);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function selectLauncher(id: LauncherId) {
    setLauncherId(id);
    window.localStorage.setItem("friends-mc-launcher", id);
  }

  return (
    <main className="portal-shell">
      <header className="topbar">
        <a
          className="wordmark"
          href={PORTAL_PATHS.home}
          onClick={(event) => navigate(event, PORTAL_PATHS.home)}
        >
          <span className="wordmark-icon">
            <Pickaxe size={20} />
          </span>
          Friends MC
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {primaryNavigationItems.map((item) => (
            <a
              aria-current={page === item.page ? "page" : undefined}
              className={page === item.page ? "active" : undefined}
              href={item.href}
              key={item.page}
              onClick={(event) => navigate(event, item.href)}
            >
              {item.label}
            </a>
          ))}
          <details className="more-menu">
            <summary className={moreIsActive ? "active" : undefined}>
              More <MoreHorizontal aria-hidden="true" />
            </summary>
            <div className="more-menu-panel">
              {moreNavigationItems.map((item) => (
                <a
                  aria-current={page === item.page ? "page" : undefined}
                  className={page === item.page ? "active" : undefined}
                  href={item.href}
                  key={item.page}
                  onClick={(event) => navigate(event, item.href)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </details>
        </nav>
        <div className="account">
          <div>
            <strong>{displayName}</strong>
            <span>{user.email}</span>
          </div>
          <button
            aria-label="Sign out"
            className="icon-button"
            onClick={() => void authClient.signOut()}
            type="button"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {page === "home" ? (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="status-pill">
                <span /> Server online
              </div>
              <p className="eyebrow">
                Aeronautics · Minecraft 1.21.1 · Pack {PACK_VERSION}
              </p>
              <h1>
                Build strange things.
                <br />
                Bring snacks.
              </h1>
              <p>
                One download gets you the exact mods and settings the server
                expects. {launcher.name} handles the rest.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="/api/modpack">
                  <Download size={19} /> Download v{PACK_VERSION}
                </a>
                <button
                  className="server-button"
                  onClick={() => void copyAddress()}
                  type="button"
                >
                  <span>{SERVER_ADDRESS}</span>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="block block-one" />
              <div className="block block-two" />
              <div className="block block-three" />
              <Sparkles className="spark spark-one" />
              <Sparkles className="spark spark-two" />
            </div>
          </section>

          <section className="quick-grid">
            <article>
              <Mic2 />
              <div>
                <strong>Proximity voice</strong>
                <span>Press V in-game to configure</span>
              </div>
            </article>
            <article>
              <Utensils />
              <div>
                <strong>Cooking expanded</strong>
                <span>Farmer&apos;s Delight and friends</span>
              </div>
            </article>
            <article>
              <Gamepad2 />
              <div>
                <strong>Controller friendly</strong>
                <span>Included in the client pack</span>
              </div>
            </article>
          </section>

          <a
            className="release-banner"
            href={PORTAL_PATHS.updates}
            onClick={(event) => navigate(event, PORTAL_PATHS.updates)}
          >
            <div className="release-banner-version">
              <span>Latest modpack</span>
              <strong>v{PACK_VERSION}</strong>
            </div>
            <div>
              <strong>Twilight Forest update</strong>
              <p>See what changed and confirm you have the current pack.</p>
            </div>
            <span className="release-banner-link">
              Changelog <ChevronRight aria-hidden="true" />
            </span>
          </a>

          <section className="portal-links">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your portal</p>
                <h2>Everything in its place</h2>
              </div>
            </div>
            <div className="portal-link-grid">
              {navigationItems
                .filter((item) => item.page !== "home")
                .map((item) => (
                  <a
                    href={item.href}
                    key={item.page}
                    onClick={(event) => navigate(event, item.href)}
                  >
                    <span>{item.icon}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <p>
                        {
                          {
                            account:
                              "Connect accounts and manage your identity.",
                            admin: "Approve friends and manage server access.",
                            chat: "Talk with friends here and inside the game.",
                            faq: "Quick answers for installs and pack updates.",
                            home: "See the server overview and quick links.",
                            mods: "Browse the full modpack by category.",
                            setup: "Install the pack and join in three steps.",
                            updates:
                              "Check the latest version and see what changed.",
                          }[item.page]
                        }
                      </p>
                    </div>
                    <ChevronRight aria-hidden="true" />
                  </a>
                ))}
            </div>
          </section>

          <a
            className="chat-card"
            href={PORTAL_PATHS.chat}
            onClick={(event) => navigate(event, PORTAL_PATHS.chat)}
          >
            <div className="chat-icon">
              <MessageCircle />
            </div>
            <div>
              <p className="eyebrow">Live now</p>
              <h2>Server chat, wherever you are</h2>
              <p>
                Messages sent here appear in Minecraft, and in-game chat appears
                here.
              </p>
            </div>
            <ChevronRight aria-hidden="true" />
          </a>
        </>
      ) : (
        <section className="page-intro">
          <p className="eyebrow">
            {
              {
                account: "Your identity",
                admin: "Owner controls",
                chat: "Members only",
                faq: "Quick answers",
                mods: "Inside the pack",
                setup: "Player guide",
                updates: "Latest release",
              }[page]
            }
          </p>
          <h1>
            {
              {
                account: "Connected accounts",
                admin: "Manage access",
                chat: "Server chat, anywhere",
                faq: "Frequently asked questions",
                mods: "Browse the modpack",
                setup: "Join without the guesswork",
                updates: `Friends MC ${PACK_VERSION}`,
              }[page]
            }
          </h1>
          <p>
            {
              {
                account:
                  "Link the services you use and keep your Minecraft identity in one place.",
                admin:
                  "Approve new friends, block unknown accounts, and manage trusted admins.",
                chat: "Talk with people on the portal and players currently inside Minecraft.",
                faq: "Short, practical instructions for keeping your client ready to join.",
                mods: "Search every included mod and see what it adds before you play.",
                setup:
                  "Pick your launcher, import one file, and use the settings that work well with this server.",
                updates:
                  "See the current pack version, its changes, and the exact Minecraft and NeoForge versions it uses.",
              }[page]
            }
          </p>
        </section>
      )}

      {page === "setup" ? (
        <section className="setup-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Three short steps</p>
              <h2>Get into the server</h2>
            </div>
            <div className="launcher-controls">
              <label className="launcher-picker">
                <span>Your launcher</span>
                <select
                  onChange={(event) =>
                    selectLauncher(event.target.value as LauncherId)
                  }
                  value={launcherId}
                >
                  {Object.entries(launchers).map(([id, option]) => (
                    <option key={id} value={id}>
                      {option.optionLabel}
                    </option>
                  ))}
                </select>
              </label>
              <span className="setup-time">Usually 5–10 minutes</span>
            </div>
          </div>
          <ol className="steps">
            <li>
              <span className="step-number">01</span>
              <div>
                <h3>Install {launcher.name}</h3>
                <p>{launcher.install}</p>
              </div>
              <a href={launcher.downloadUrl} rel="noreferrer" target="_blank">
                {launcher.downloadLabel} <ChevronRight />
              </a>
            </li>
            <li>
              <span className="step-number">02</span>
              <div>
                <h3>Import the modpack</h3>
                <p>{launcher.import}</p>
              </div>
              <a href="/api/modpack">
                Download v{PACK_VERSION} <Download />
              </a>
            </li>
            <li>
              <span className="step-number">03</span>
              <div>
                <h3>Launch and join</h3>
                <p>
                  {launcher.launch} The multiplayer server is already saved in
                  the pack.
                </p>
              </div>
              <button onClick={() => void copyAddress()} type="button">
                Copy address <Copy />
              </button>
            </li>
          </ol>
        </section>
      ) : null}

      {page === "mods" ? <ModsCatalog /> : null}

      {page === "chat" ? <ChatRoom /> : null}

      {page === "faq" ? (
        <FrequentlyAskedQuestions
          launcher={launcher}
          launcherId={launcherId}
          selectLauncher={selectLauncher}
        />
      ) : null}

      {page === "updates" ? <PackUpdates /> : null}

      {page === "account" ? <ConnectedAccounts /> : null}

      {page === "admin" && isAdmin ? (
        <AccessAdmin currentUserId={user.id} />
      ) : null}

      <nav aria-label="Mobile navigation" className="mobile-nav">
        {primaryNavigationItems.map((item) => (
          <a
            aria-current={page === item.page ? "page" : undefined}
            className={page === item.page ? "active" : undefined}
            href={item.href}
            key={item.page}
            onClick={(event) => navigate(event, item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
        <details className="more-menu mobile-more-menu">
          <summary className={moreIsActive ? "active" : undefined}>
            <MoreHorizontal aria-hidden="true" />
            <span>More</span>
          </summary>
          <div className="more-menu-panel">
            {moreNavigationItems.map((item) => (
              <a
                aria-current={page === item.page ? "page" : undefined}
                className={page === item.page ? "active" : undefined}
                href={item.href}
                key={item.page}
                onClick={(event) => navigate(event, item.href)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </details>
      </nav>

      <footer>
        <span>Friends MC</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

function AccessState({
  status,
  refresh,
}: {
  status: "blocked" | "error" | "pending";
  refresh: () => void;
}) {
  const copy = {
    blocked: {
      eyebrow: "Access blocked",
      title: "This account can’t enter.",
      body: "Ask the server owner if you think this was a mistake.",
    },
    error: {
      eyebrow: "Connection issue",
      title: "We couldn’t check access.",
      body: "The server may be restarting. Try the check again in a moment.",
    },
    pending: {
      eyebrow: "Request received",
      title: "You’re waiting for approval.",
      body: "The server owner can now see your account. Once approved, this page opens automatically when you check again.",
    },
  }[status];

  return (
    <main className="login-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="login-card access-state-card">
        <div className="brand-mark" aria-hidden="true">
          {status === "blocked" ? <UserX /> : <ShieldCheck />}
        </div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="lede">{copy.body}</p>
        <div className="access-state-actions">
          {status !== "blocked" ? (
            <button className="primary-button" onClick={refresh} type="button">
              <RefreshCw size={17} /> Check again
            </button>
          ) : null}
          <button
            className="secondary-button"
            onClick={() => void authClient.signOut()}
            type="button"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

function AccessGate() {
  const [user, setUser] = useState<AccessUser | null>(null);
  const [state, setState] = useState<
    "blocked" | "error" | "loading" | "pending"
  >("loading");

  function refresh() {
    setState("loading");
    void fetch("/api/access", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Access check failed");
        return (await response.json()) as { user: AccessUser };
      })
      .then(({ user: nextUser }) => {
        setUser(nextUser);
        setState(nextUser.accessStatus === "blocked" ? "blocked" : "pending");
      })
      .catch(() => setState("error"));
  }

  useEffect(refresh, []);

  if (state === "loading") {
    return (
      <main className="loading">
        <div className="loader" />
        <span>Checking your access…</span>
      </main>
    );
  }

  if (user?.accessStatus === "approved" && user.verified) {
    return <Portal user={user} />;
  }

  return <AccessState refresh={refresh} status={state} />;
}

export function App() {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <main className="loading">
        <div className="loader" />
        <span>Loading the world…</span>
      </main>
    );
  }

  if (!session.data?.user) return <SignIn />;

  return <AccessGate />;
}
