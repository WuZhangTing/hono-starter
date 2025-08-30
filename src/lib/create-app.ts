import { OpenAPIHono } from "@hono/zod-openapi";

import notFound from "@/common/middlewares/exceptions/no-found";
import onError from "@/common/middlewares/exceptions/on-error";
import { logger } from "@/common/middlewares/pino-logger";
import defaultHook from "@/utils/openapi/default-hook";

import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false, // Disable strict mode
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  /** 使用pino日志 */
  app.use(logger());
  /** 404响应 */
  app.notFound(notFound);
  /** 错误处理 */
  app.onError(onError);

  return app;
}
