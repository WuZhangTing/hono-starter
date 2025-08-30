import app from "@/app";
import env from "@/env";

const port = env.APP_PORT;

export default {
  fetch: app.fetch,
  port,
};
