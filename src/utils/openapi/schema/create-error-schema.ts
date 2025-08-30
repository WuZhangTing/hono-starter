import { z } from "@hono/zod-openapi";

import { RESPONSE_ERROR_CODE } from "@/constants/response.js";

import type { ZodIssue, ZodSchema } from "../helpers/types.js";

function createErrorSchema<T extends ZodSchema>(schema: T) {
  const { error } = schema.safeParse(
    schema._def.type === "array" ? [schema.element._def.type === "string" ? 123 : "invalid"] : {},
  );

  const example = error
    ? error.issues.map((issue: ZodIssue) => `${issue.path}(${issue.message})`).join(", ")
    : `fieldName:(Expected string, received undefined)`; // example

  return z.object({
    code: z.number().openapi({
      example: RESPONSE_ERROR_CODE,
    }),
    msg: z.string().openapi({
      example,
    }),
  });
}

export default createErrorSchema;
