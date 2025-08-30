import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "@/constants/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGES } from "@/constants/http-status-phrases";

const notFound: NotFoundHandler = (c) => {
  return c.json({
    code: NOT_FOUND,
    message: `${NOT_FOUND_MESSAGES} - ${c.req.path}`,
  }, NOT_FOUND);
};

export default notFound;
