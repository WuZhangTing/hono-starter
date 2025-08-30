import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR } from "@/constants/http-status-codes";
import env from "@/env";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== INTERNAL_SERVER_ERROR
    ? (currentStatus as ContentfulStatusCode)
    : INTERNAL_SERVER_ERROR;

  return c.json(
    {
      code: 500,
      message: err.message,
      stack: env.NODE_ENV === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
