import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { z } from "zod";

const { directDatabaseUrl } = z
  .object({ directDatabaseUrl: z.url() })
  .parse({
    directDatabaseUrl: process.env.DIRECT_DATABASE_URL ?? process.env.DIRECT_URL,
  });

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: directDatabaseUrl });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}