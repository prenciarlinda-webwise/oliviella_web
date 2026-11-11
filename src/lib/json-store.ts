import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

// Shared atomic-write + write-serialization helpers for the JSON files under
// data/ — the admin-editable "database" for this app (see products-data.ts
// and auth/admins-store.ts). This app runs as one persistent Node process on
// the VPS (not serverless), so an in-memory lock per file is enough to
// prevent a lost-update race between two near-simultaneous admin writes — no
// cross-instance locking needed.

const locks = new Map<string, Promise<unknown>>();

export function withFileLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const run = (locks.get(key) ?? Promise.resolve()).then(fn, fn);
  locks.set(
    key,
    run.catch(() => {}),
  );
  return run as Promise<T>;
}

export async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const tmp = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}

/** Result of a read-modify-write: `next` is written (null = no change). */
export type Mutation<T, R> = { next: T | null; result: R };

/**
 * Read, modify and write a JSON file as ONE locked step, so two concurrent
 * admin saves can't both read the old state and overwrite each other (and a
 * check like "is this the last system admin?" can't be raced).
 */
export function mutateJson<T, R>(
  key: string,
  read: () => Promise<T>,
  filePath: string,
  fn: (current: T) => Mutation<T, R> | Promise<Mutation<T, R>>,
): Promise<R> {
  return withFileLock(key, async () => {
    const { next, result } = await fn(await read());
    if (next !== null) await atomicWriteJson(filePath, next);
    return result;
  });
}
