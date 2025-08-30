import { createRoute, z } from "@hono/zod-openapi";

import { OK } from "@/constants/http-status-codes";
import { createRouter } from "@/lib/create-app";
import jsonContent from "@/utils/openapi/helpers/json-content";

const router = createRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    tags: ["Index"],
    responses: {
      [OK]: jsonContent(
        z.object({
          message: z.string().default("Welcome to Hono starter API"),
        }),
        "Hono starter index api",
      ),
    },
  }), async (c) => {
    return c.json({ message: "Welcome to Hono starter API" }, OK);
  });

export default router;
