#!/usr/bin/env node
// Standalone admin-account bootstrap/reset tool. Run interactively, over SSH
// on the VPS (that's where the persistent data/ disk the running app reads
// actually lives): `node scripts/create-admin.mjs`
//
// This is also the ONLY password-reset path in v1 — there is no in-app
// "forgot password" flow.
//
// Deliberately standalone — no imports from src/. This repo has no
// "type": "module" in package.json, so a bare `node` entry importing named
// exports from TS source is fragile here (ambiguous CJS/ESM resolution). The
// scrypt hash format below MUST stay byte-for-byte in sync with
// src/lib/auth/password.ts — "scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>".

import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${derivedKey.toString("base64")}`;
}

async function readAdmins() {
  try {
    return JSON.parse(await readFile(ADMINS_PATH, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return [];
  }
}

async function writeAdmins(admins) {
  const dir = path.dirname(ADMINS_PATH);
  await mkdir(dir, { recursive: true });
  const tmp = path.join(dir, `.admins.json.${process.pid}.${Date.now()}.tmp`);
  await writeFile(tmp, JSON.stringify(admins, null, 2), "utf8");
  await rename(tmp, ADMINS_PATH);
}

async function promptPassword(rl) {
  const password = (await rl.question("New password (min 12 characters): ")).trim();
  if (password.length < 12) {
    console.error("Password must be at least 12 characters. Aborting.");
    return null;
  }
  const confirm = (await rl.question("Confirm password: ")).trim();
  if (password !== confirm) {
    console.error("Passwords do not match. Aborting.");
    return null;
  }
  return password;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log("Olivella admin account tool\n");

    let action = "";
    while (action !== "create" && action !== "reset-password") {
      action = (await rl.question('Action — "create" or "reset-password": ')).trim().toLowerCase();
    }

    const email = (await rl.question("Email: ")).trim().toLowerCase();
    if (!email || !email.includes("@")) {
      console.error("That doesn't look like a valid email. Aborting.");
      process.exitCode = 1;
      return;
    }

    const admins = await readAdmins();
    const existing = admins.find((a) => a.email === email);

    if (action === "create") {
      if (existing) {
        console.error(
          `An admin with email ${email} already exists. Use "reset-password" instead.`,
        );
        process.exitCode = 1;
        return;
      }

      let role = "";
      while (role !== "system" && role !== "shop") {
        role = (await rl.question('Role — "system" or "shop": ')).trim().toLowerCase();
      }

      const password = await promptPassword(rl);
      if (!password) {
        process.exitCode = 1;
        return;
      }

      const timestamp = new Date().toISOString();
      admins.push({
        id: randomUUID(),
        email,
        passwordHash: await hashPassword(password),
        role,
        passwordChangedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      await writeAdmins(admins);
      console.log(`\nCreated ${role} admin: ${email}`);
    } else {
      if (!existing) {
        console.error(`No admin found with email ${email}.`);
        process.exitCode = 1;
        return;
      }

      const password = await promptPassword(rl);
      if (!password) {
        process.exitCode = 1;
        return;
      }

      const timestamp = new Date().toISOString();
      existing.passwordHash = await hashPassword(password);
      existing.passwordChangedAt = timestamp;
      existing.updatedAt = timestamp;
      await writeAdmins(admins);
      console.log(
        `\nPassword reset for ${email}. Any existing session for this account is now invalid.`,
      );
    }
  } finally {
    rl.close();
  }
}

main();
