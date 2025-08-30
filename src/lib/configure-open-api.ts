import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "./types";

import packageJSON from "../../package.json";
import env from "../env";

export default function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Hono starter API",
      description: "Hono starter API Documentation",
      version: packageJSON.version,
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );

  // eslint-disable-next-line no-console
  console.log(`🚀 OpenAPI Docs: http://localhost:${env.APP_PORT}/reference`);
}
