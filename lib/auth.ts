import "server-only";

import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const env = z
  .object({
    secret: z.string().min(32),
    baseURL: z.string().url(),
  })
  .parse({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  });

const secureCookies = env.baseURL.startsWith("https://");

export const auth = betterAuth({
  appName: "PetCare",
  baseURL: env.baseURL,
  secret: env.secret,
  trustedOrigins: [env.baseURL],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  session: {
    expiresIn: 30 * 60,
    updateAge: 15 * 60,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 100 },
      "/sign-up/email": { window: 60 * 60, max: 20 },
    },
  },
  advanced: {
    useSecureCookies: secureCookies,
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure: secureCookies,
          path: "/",
        },
      },
    },
  },
});

const lockoutWindowMs = 15 * 60 * 1000;
const maxLoginFailures = 5;

function identifierHash(email: string): string {
  return createHmac("sha256", env.secret)
    .update(email.trim().toLowerCase())
    .digest("hex");
}

export async function getLoginLockout(email: string): Promise<number | null> {
  const row = await prisma.loginLockout.findUnique({
    where: { identifierHash: identifierHash(email) },
  });

  if (!row?.lockedUntil || row.lockedUntil <= new Date()) return null;
  return Math.ceil((row.lockedUntil.getTime() - Date.now()) / 1000);
}

export async function recordFailedLogin(email: string): Promise<number | null> {
  const now = new Date();
  const windowThreshold = new Date(now.getTime() - lockoutWindowMs);
  const lockedUntil = new Date(now.getTime() + lockoutWindowMs);

  await prisma.$executeRaw`
    INSERT INTO "LoginLockout" ("identifierHash", "failures", "windowStartedAt", "lockedUntil")
    VALUES (${identifierHash(email)}, 1, ${now}, NULL)
    ON CONFLICT ("identifierHash") DO UPDATE SET
      "failures" = CASE
        WHEN "LoginLockout"."windowStartedAt" <= ${windowThreshold} THEN 1
        ELSE "LoginLockout"."failures" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "LoginLockout"."windowStartedAt" <= ${windowThreshold} THEN ${now}
        ELSE "LoginLockout"."windowStartedAt"
      END,
      "lockedUntil" = CASE
        WHEN "LoginLockout"."windowStartedAt" <= ${windowThreshold} THEN NULL
        WHEN "LoginLockout"."failures" + 1 >= ${maxLoginFailures} THEN ${lockedUntil}
        ELSE NULL
      END
  `;

  return getLoginLockout(email);
}

export async function clearLoginFailures(email: string): Promise<void> {
  await prisma.loginLockout.deleteMany({
    where: { identifierHash: identifierHash(email) },
  });
}