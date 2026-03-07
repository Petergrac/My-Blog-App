/**
 * prisma.ts — Prisma v7 dual-client setup
 *
 * Prisma v7 REQUIRES either `adapter` or `accelerateUrl` on every PrismaClient
 * constructor call. `datasourceUrl` and `datasources` were removed in v7.
 *
 * Two clients are exported:
 *
 *  - `directPrisma` (named, also the default export) — Direct TCP via
 *    @prisma/adapter-pg + pg Pool.
 *    Use for: ALL writes, $transaction(), and reads that don't need caching.
 *
 *  - `prismaAccelerate` (named) — Routes through Prisma Accelerate.
 *    Use for: read-heavy queries where you want the `cacheStrategy` option.
 *    Do NOT use for $transaction() — Accelerate and interactive transactions
 *    are incompatible; the timeout option is silently ignored with Accelerate.
 *
 * Required env vars:
 *   DATABASE_URL        = prisma+postgres://... (your Accelerate URL)
 *   DIRECT_DATABASE_URL = postgresql://...      (raw Postgres connection string)
 *
 * Required packages (install if not already present):
 *   npm install pg @prisma/adapter-pg
 *   npm install --save-dev @types/pg
 */

import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const { Pool } = pg;

const globalForPrisma = global as unknown as {
  pool: pg.Pool;
  prisma: PrismaClient;
  prismaAccelerate: ReturnType<typeof buildAccelerateClient>;
};

// ---------------------------------------------------------------------------
// Direct client — uses pg driver adapter (Prisma v7 requirement)
// ---------------------------------------------------------------------------
// The Pool is cached on global too: pg.Pool manages its own internal connection
// pool, so creating a new Pool instance on every hot-reload wastes connections.
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DIRECT_DATABASE_URL,
  });

const adapter = new PrismaPg(pool);

const directPrisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Accelerate client — for cached reads only
// ---------------------------------------------------------------------------
function buildAccelerateClient() {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
  }).$extends(withAccelerate());
}

const prismaAccelerate =
  globalForPrisma.prismaAccelerate ?? buildAccelerateClient();

// ---------------------------------------------------------------------------
// Singleton — prevents multiple instances on Next.js hot-reload in dev
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = directPrisma;
  globalForPrisma.prismaAccelerate = prismaAccelerate;
}

export default directPrisma;
export { directPrisma, prismaAccelerate };
