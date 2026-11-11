import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { mutateJson, type Mutation } from "@/lib/json-store";

export type AdminRole = "system" | "shop";

export type AdminRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  /** Bumped on every password reset — invalidates any session issued before this. */
  passwordChangedAt: string;
  createdAt: string;
  updatedAt: string;
};

const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");

export async function readAdmins(): Promise<AdminRecord[]> {
  try {
    const raw = await fs.readFile(ADMINS_PATH, "utf8");
    return JSON.parse(raw) as AdminRecord[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return [];
  }
}

/** Locked read-modify-write of the admin list — use this for every change. */
export function mutateAdmins<R>(
  fn: (current: AdminRecord[]) => Mutation<AdminRecord[], R> | Promise<Mutation<AdminRecord[], R>>,
): Promise<R> {
  return mutateJson("admins", readAdmins, ADMINS_PATH, fn);
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const admins = await readAdmins();
  return admins.find((a) => a.email === normalized);
}

export async function findAdminById(id: string): Promise<AdminRecord | undefined> {
  const admins = await readAdmins();
  return admins.find((a) => a.id === id);
}
