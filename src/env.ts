import type { ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import * as path from "node:path";
import { z } from "zod";

// eslint-disable-next-line node/no-process-env
const NODE_ENV = process.env.NODE_ENV;

let envFile;
switch (NODE_ENV) {
  case "production":
    envFile = ".env.production";
    break;
  case "test":
    envFile = ".env.test";
    break;
  case "development":
  default:
    envFile = ".env.development";
    break;
}

expand(config({
  path: path.resolve(
    process.cwd(),
    envFile,
  ),
}));

const EnvSchema = z.object({
  APP_NAME: z.coerce.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_PORT: z.coerce.number(),

  // logger
  LOGGER_LEVEL: z.enum(["debug", "info", "warn", "error", ""]).default("info"),
  LOGGER_ENABLE_CONSOLE: z.coerce.boolean().default(true),
  LOGGER_MAX_DAYS: z.coerce.number().default(7),
  LOGGER_MAX_SIZE: z.coerce.number().default(10),
  LOGGER_INTERVAL: z.coerce.number().default(1),

  // db
  DB_HOST: z.coerce.string(),
  DB_PORT: z.coerce.number().default(15432),
  DB_DATABASE: z.coerce.string(),
  DB_USERNAME: z.coerce.string(),
  DB_PASSWORD: z.coerce.string(),
  DB_URL: z.coerce.string(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env;

try {
// eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid env:");
  console.error(z.flattenError(error).fieldErrors);
  process.exit(1);
}

export default env;
