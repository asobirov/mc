import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Crown,
  Download,
  Gamepad2,
  Link2,
  LogOut,
  MessageCircle,
  Mic2,
  Pickaxe,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserX,
  Utensils,
} from "lucide-react";

import { authClient } from "./lib/auth-client";

const SERVER_ADDRESS = "mc.xpr.im";

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
      "Open the Friends MC instance settings, give it 6–8 GB of memory, then launch.",
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
      "Open the imported Friends MC profile, set its memory to 6–8 GB, then press Play.",
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
      "Open the imported Friends MC instance, set maximum memory to 6–8 GB, then launch.",
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
  const [launcherId, setLauncherId] = useState<LauncherId>(() => {
    const saved = window.localStorage.getItem("friends-mc-launcher");
    return saved && saved in launchers ? (saved as LauncherId) : "prism";
  });
  const launcher = launchers[launcherId];
  const fallbackName = user.email.split("@")[0] ?? "Friend";
  const displayName = user.name.trim().length > 0 ? user.name : fallbackName;

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
        <a className="wordmark" href="/">
          <span className="wordmark-icon">
            <Pickaxe size={20} />
          </span>
          Friends MC
        </a>
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

      <section className="hero">
        <div className="hero-copy">
          <div className="status-pill">
            <span /> Server online
          </div>
          <p className="eyebrow">Aeronautics · Minecraft 1.21.1</p>
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
              <Download size={19} /> Download modpack
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
              Download <Download />
            </a>
          </li>
          <li>
            <span className="step-number">03</span>
            <div>
              <h3>Launch and join</h3>
              <p>
                {launcher.launch} The multiplayer server is already saved in the
                pack.
              </p>
            </div>
            <button onClick={() => void copyAddress()} type="button">
              Copy address <Copy />
            </button>
          </li>
        </ol>
      </section>

      <ConnectedAccounts />

      <section className="chat-card">
        <div className="chat-icon">
          <MessageCircle />
        </div>
        <div>
          <p className="eyebrow">Coming next</p>
          <h2>Server chat, wherever you are</h2>
          <p>
            Discord integration will keep game chat and the group channel in
            sync.
          </p>
        </div>
      </section>

      {user.role === "admin" ? <AccessAdmin currentUserId={user.id} /> : null}

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
