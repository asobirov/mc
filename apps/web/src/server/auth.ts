import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type * as NodeSqlite from "node:sqlite";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

import {
  initialAccessForEmail,
  parseAdminEmails,
  SIGNUP_EMAIL_UNVERIFIED,
} from "./access";
import { env } from "./env";

mkdirSync(dirname(env.SQLITE_PATH), { recursive: true });

// Dynamic loading keeps bundlers from rewriting the modern `node:sqlite`
// builtin to a third-party `sqlite` package.
const sqliteSpecifier = ["node", "sqlite"].join(":");
const { DatabaseSync } = (await import(sqliteSpecifier)) as typeof NodeSqlite;
export const database = new DatabaseSync(env.SQLITE_PATH);
database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

export const adminEmails = parseAdminEmails(env.AUTH_ADMIN_EMAILS);

const accountLinking = {
  allowDifferentEmails: true,
  disableImplicitLinking: true,
  enabled: true,
  trustedProviders: ["google"],
  requireLocalEmailVerified: false,
};

const socialProviders: NonNullable<
  Parameters<typeof betterAuth>[0]["socialProviders"]
> = {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
};

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
  socialProviders.discord = {
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  };
}

if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET) {
  socialProviders.microsoft = {
    clientId: env.MICROSOFT_CLIENT_ID,
    clientSecret: env.MICROSOFT_CLIENT_SECRET,
    disableProfilePhoto: true,
    tenantId: "consumers",
    mapProfileToUser: (profile) => {
      const email = profile.email ?? profile.preferred_username;
      return {
        email,
        // Consumer Microsoft aliases are proven as part of the interactive
        // sign-in, but Entra does not emit `email_verified` by default.
        emailVerified: Boolean(email),
      };
    },
  };
}

export const auth = betterAuth({
  appName: "Friends MC",
  database,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL],
  emailAndPassword: { enabled: false },
  socialProviders,
  account: { accountLinking },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "member",
        input: false,
      },
      accessStatus: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false,
      },
      verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
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
          if (!user.emailVerified) {
            throw new APIError("FORBIDDEN", {
              code: SIGNUP_EMAIL_UNVERIFIED,
              message: "The social provider did not verify this email address.",
            });
          }
          return Promise.resolve({
            data: {
              ...user,
              ...initialAccessForEmail(user.email, adminEmails),
            },
          });
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
