import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type * as NodeSqlite from "node:sqlite";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

import {
  isEmailAllowed,
  parseAllowedEmails,
  SIGNUP_EMAIL_UNVERIFIED,
  SIGNUP_NOT_INVITED,
} from "./access";
import { env } from "./env";

mkdirSync(dirname(env.SQLITE_PATH), { recursive: true });

// Dynamic loading keeps bundlers from rewriting the modern `node:sqlite`
// builtin to a third-party `sqlite` package.
const sqliteSpecifier = ["node", "sqlite"].join(":");
const { DatabaseSync } = (await import(sqliteSpecifier)) as typeof NodeSqlite;
const database = new DatabaseSync(env.SQLITE_PATH);
database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

export const allowedEmails = parseAllowedEmails(env.AUTH_ALLOWED_EMAILS);

const accountLinking = {
  enabled: true,
  trustedProviders: ["google"],
  requireLocalEmailVerified: false,
};

export const auth = betterAuth({
  appName: "Friends MC",
  database,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL],
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  account: { accountLinking },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: (user) => {
          if (!isEmailAllowed(user.email, allowedEmails)) {
            throw new APIError("FORBIDDEN", {
              code: SIGNUP_NOT_INVITED,
              message: "This email is not on the invite list.",
            });
          }
          if (!user.emailVerified) {
            throw new APIError("FORBIDDEN", {
              code: SIGNUP_EMAIL_UNVERIFIED,
              message: "The social provider did not verify this email address.",
            });
          }
          return Promise.resolve();
        },
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
});
