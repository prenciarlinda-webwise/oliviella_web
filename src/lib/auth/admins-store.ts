import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { atomicWriteJson, withFileLock } from "@/lib/json-store";

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

export async function writeAdmins(next: AdminRecord[]): Promise<void> {
  await withFileLock("admins", () => atomicWriteJson(ADMINS_PATH, next));
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
