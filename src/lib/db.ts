import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. Reused across hot reloads in development so the
 * dev server doesn't exhaust the database connection pool.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
