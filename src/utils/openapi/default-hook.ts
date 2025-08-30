import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "@/constants/http-status-codes";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        code: UNPROCESSABLE_ENTITY,
        msg: result.error.issues.map(issue => `${issue.path}(${issue.message})`).join(", "),
      },
      UNPROCESSABLE_ENTITY,
    );
  }
};

export default defaultHook;
