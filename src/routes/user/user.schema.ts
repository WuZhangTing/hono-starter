// import { z } from "@hono/zod-openapi";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { OmitTimeAndId, paginationSchema, timestamps } from "@/db/schema/common.schema";

export const userTable = pgTable("user", {
  id: uuid().defaultRandom(),
  username: varchar().notNull().unique(),
  password: varchar().notNull(),
  name: varchar(),
  avatar: varchar(),
  phone: varchar(),
  email: varchar().unique(),
  status: integer().notNull().default(1),
  ...timestamps,
});

export const seleUserSchema = createSelectSchema(userTable);
export const userQuerySchema = createSelectSchema(userTable).partial().extend(paginationSchema);

export const insertUserSchema = createInsertSchema(userTable, {
  status: schema => schema.min(0).max(1),
}).omit(OmitTimeAndId);

export const patchUserSchema = insertUserSchema.partial();
