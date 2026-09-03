import type { AccessAction, AccessRecord } from "./access";
import {
  accessUpdateForAction,
  isAdminEmail,
  normalizeAccessRecord,
} from "./access";
import { adminEmails, database } from "./auth";

type StoredUserRow = {
  accessStatus: unknown;
  createdAt: unknown;
  email: string;
  emailVerified: unknown;
  id: string;
  image: string | null;
  name: string;
  role: unknown;
  verified: unknown;
};

export type AccessUser = AccessRecord & {
  createdAt: number | string | null;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  name: string;
  protectedAdmin: boolean;
};

const selectUser = `
  SELECT id, name, email, emailVerified, image, createdAt,
         role, accessStatus, verified
  FROM "user"
`;

function publicUser(row: StoredUserRow): AccessUser {
  const createdAt =
    row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : typeof row.createdAt === "bigint"
        ? Number(row.createdAt)
        : typeof row.createdAt === "number" || typeof row.createdAt === "string"
          ? row.createdAt
          : null;

  return {
    ...normalizeAccessRecord(row),
    createdAt,
    email: row.email,
    emailVerified: row.emailVerified === true || row.emailVerified === 1,
    id: row.id,
    image: row.image,
    name: row.name,
    protectedAdmin: isAdminEmail(row.email, adminEmails),
  };
}

export function bootstrapAdminAccounts(): number {
  const update = database.prepare(`
    UPDATE "user"
    SET role = 'admin', accessStatus = 'approved', verified = 1
    WHERE lower(email) = ?
  `);
  let changed = 0;

  database.exec("BEGIN");
  try {
    for (const email of adminEmails) {
      changed += Number(update.run(email).changes);
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }

  return changed;
}

export function getAccessUser(id: string): AccessUser | null {
  const row = database.prepare(`${selectUser} WHERE id = ?`).get(id) as
    | StoredUserRow
    | undefined;
  return row ? publicUser(row) : null;
}

export function listAccessUsers(): AccessUser[] {
  const rows = database
    .prepare(
      `${selectUser}
       ORDER BY
         CASE accessStatus
           WHEN 'pending' THEN 0
           WHEN 'approved' THEN 1
           ELSE 2
         END,
         createdAt DESC`,
    )
    .all() as unknown as StoredUserRow[];
  return rows.map(publicUser);
}

export function updateAccessUser(
  id: string,
  action: AccessAction,
): AccessUser | null {
  const update = accessUpdateForAction(action);

  if (update.role !== undefined) {
    database
      .prepare('UPDATE "user" SET role = ? WHERE id = ?')
      .run(update.role, id);
  }
  if (update.accessStatus !== undefined) {
    database
      .prepare('UPDATE "user" SET accessStatus = ? WHERE id = ?')
      .run(update.accessStatus, id);
  }
  if (update.verified !== undefined) {
    database
      .prepare('UPDATE "user" SET verified = ? WHERE id = ?')
      .run(update.verified ? 1 : 0, id);
  }

  return getAccessUser(id);
}
