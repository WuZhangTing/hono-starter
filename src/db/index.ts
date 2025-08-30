import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "@/env";

import * as schema from "./schema/index";

export type DrizzleDB = NodePgDatabase<typeof schema>;

const client = new Pool({
  connectionString: env.DB_URL!,
});
const db = drizzle(client, { schema }) as DrizzleDB;

export default db;
