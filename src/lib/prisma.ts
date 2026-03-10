/**
 * prisma.ts — Prisma v7 direct client
 *
 * Prisma v7 REQUIRES either `adapter` or `accelerateUrl` on every PrismaClient
 * constructor call. `datasourceUrl` and `datasources` were removed in v7.
 *
 * This project uses a direct Postgres connection via @prisma/adapter-pg + pg.
 *
 * Required env vars:
 *   DATABASE_URL = postgresql://... (raw Postgres connection string)
 *
 * Required packages (install if not already present):
 *   npm install pg @prisma/adapter-pg
 *   npm install --save-dev @types/pg
 */

import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { Pool } = pg;

const globalForPrisma = global as unknown as {
  pool: pg.Pool;
  prisma: PrismaClient;
};

// ---------------------------------------------------------------------------
// Direct client — uses pg driver adapter (Prisma v7 requirement)
// ---------------------------------------------------------------------------
// The Pool is cached on global too: pg.Pool manages its own internal connection
// pool, so creating a new Pool instance on every hot-reload wastes connections.
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

const adapter = new PrismaPg(pool);

const directPrisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Singleton — prevents multiple instances on Next.js hot-reload in dev
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = directPrisma;
}

export default directPrisma;
export { directPrisma };
