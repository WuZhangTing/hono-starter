import { timestamp } from "drizzle-orm/pg-core";
import z from "zod";

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

export const paginationSchema = {
  page: z
    .string()
    .optional()
    .default("1")
    .transform(val => Number.parseInt(val, 10))
    .refine(val => !Number.isNaN(val) && val > 0, {
      message: "Page must be a positive integer",
    }),
  pageSize: z
    .string()
    .optional()
    .default("10")
    .transform(val => Number.parseInt(val, 10))
    .refine(val => !Number.isNaN(val) && val > 0 && val <= 100, {
      message: "Size must be a positive integer and <= 100",
    }),
};

// 去除创建时间和更新时间
export const OmitTime = {
  createdAt: true,
  updatedAt: true,
} as const;

// 去除创建时间和更新时间和id
export const OmitTimeAndId = {
  ...OmitTime,
  id: true,
} as const;
