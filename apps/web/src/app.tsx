import { useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Download,
  Gamepad2,
  LogOut,
  MessageCircle,
  Mic2,
  Pickaxe,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";

import { authClient } from "./lib/auth-client";

const SERVER_ADDRESS = "mc.xpr.im";

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

function SignIn() {
  const [busyProvider, setBusyProvider] = useState<"discord" | "google" | null>(
    null,
  );
  const error = new URLSearchParams(window.location.search).get("error");
  const errorMessage =
    error === "SIGNUP_NOT_INVITED"
      ? "That account is not on the server invite list yet."
      : error
        ? "Sign-in did not finish. Please try again."
        : null;

  async function signIn(provider: "discord" | "google") {
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
        </div>

        <p className="login-note">
          <ShieldCheck size={16} /> Only invited, verified accounts can enter.
        </p>
      </section>
    </main>
  );
}

function Portal({ name, email }: { name: string; email: string }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(SERVER_ADDRESS);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
            <strong>{name}</strong>
            <span>{email}</span>
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
            expects. Prism Launcher handles the rest.
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
          <span>Usually 5–10 minutes</span>
        </div>
        <ol className="steps">
          <li>
            <span className="step-number">01</span>
            <div>
              <h3>Install Prism Launcher</h3>
              <p>
                Use Prism or another launcher that can import Modrinth{" "}
                <code>.mrpack</code> files.
              </p>
            </div>
            <a
              href="https://prismlauncher.org/download/"
              rel="noreferrer"
              target="_blank"
            >
              Get Prism <ChevronRight />
            </a>
          </li>
          <li>
            <span className="step-number">02</span>
            <div>
              <h3>Import the modpack</h3>
              <p>
                Choose <b>Add Instance → Import</b>, then select the downloaded
                Friends MC file.
              </p>
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
                Give Minecraft 6–8 GB of memory. The multiplayer server is
                already saved in the pack.
              </p>
            </div>
            <button onClick={() => void copyAddress()} type="button">
              Copy address <Copy />
            </button>
          </li>
        </ol>
      </section>

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

      <footer>
        <span>Friends MC</span>
        <span>Private by design · {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
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

  const fallbackName = session.data.user.email.split("@")[0] ?? "Friend";
  const displayName =
    session.data.user.name.trim().length > 0
      ? session.data.user.name
      : fallbackName;

  return <Portal email={session.data.user.email} name={displayName} />;
}
