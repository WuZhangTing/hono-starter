import { z } from "@hono/zod-openapi";

import { RESPONSE_SUCCESS_CODE, RESPONSE_SUCCESS_MSG } from "@/constants/response.js";

import type { ZodSchema } from "../helpers/types";

function createSuccessSchema<T extends ZodSchema>(schema: T, type?: "isArray" | "isPager") {
  let dataType;

  if (type === "isArray") {
    dataType = z.array(schema).optional();
  }
  else if (type === "isPager") {
    dataType = z.object({
      items: z.array(schema).optional(),
      meta: z.object({
        totalItems: z.number(),
        currentPage: z.number(),
        itemsPerPage: z.number(),
        totalPages: z.number(),
        count: z.number(),
        hasNext:z.boolean(),
        hasPrev:z.boolean(),
      }),
    }).optional();
  }
  else {
    dataType = z.optional(schema);
  }

  return z.object({
    code: z.number().openapi({
      example: RESPONSE_SUCCESS_CODE,
    }),
    msg: z.string().openapi({
      example: RESPONSE_SUCCESS_MSG,
    }),
    data: dataType,
  });
}

export default createSuccessSchema;
