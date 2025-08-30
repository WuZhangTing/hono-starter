import { createRoute } from "@hono/zod-openapi";

import { OK, UNPROCESSABLE_ENTITY } from "@/constants/http-status-codes";
import jsonContentOneOf from "@/utils/openapi/helpers/json-centent-one-of";
import jsonContent from "@/utils/openapi/helpers/json-content";
import jsonContentRequired from "@/utils/openapi/helpers/json-content-required";
import createErrorSchema from "@/utils/openapi/schema/create-error-schema";
import createSuccessSchema from "@/utils/openapi/schema/create-success-schema";
import IdUUIDParamsSchema from "@/utils/openapi/schema/uuid-params";

import { insertUserSchema, patchUserSchema, seleUserSchema, userQuerySchema } from "./user.schema";

const tags = ["User"];

export const list = createRoute({
  summary: "查询用户列表",
  path: "/user",
  method: "get",
  tags,
  request: {
    query: userQuerySchema as any,
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(seleUserSchema, "isArray"),
      "查询成功",
    ),
  },
});

export const create = createRoute({
  summary: "新增用户",
  path: "/user",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "新增用户",
    ) as any,
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(insertUserSchema),
      "新增用户成功",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "新增用户失败",
    ),
  },
});

export const getOne = createRoute({
  summary: "查询用户详情",
  path: "/user/{id}",
  method: "get",
  tags,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(seleUserSchema),
      "查询成功",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "查询错误",
    ),
  },
});

export const update = createRoute({
  summary: "更新用户信息",
  path: "/user/{id}",
  method: "patch",
  tags,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(
      patchUserSchema,
      "更新用户",
    ) as any,
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(seleUserSchema),
      "更新成功",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdUUIDParamsSchema),
        createErrorSchema(patchUserSchema),
      ],
      "更新失败",
    ),
  },
});

export const deleteOne = createRoute({
  summary: "删除用户",
  path: "/user/{id}",
  method: "delete",
  tags,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(IdUUIDParamsSchema),
      "删除成功",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "删除失败",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteOneRoute = typeof deleteOne;
