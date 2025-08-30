import { and, asc, eq, like } from "drizzle-orm";

import type { AppHandlers } from "@/lib/types";

import { jsonFail, jsonOK } from "@/common/decorator/api-result";
import db from "@/db";

import type { CreateRoute, DeleteOneRoute, GetOneRoute, ListRoute, UpdateRoute } from "./user.routes";

import { userTable } from "./user.schema";
import { paginate } from "../../helper/paginate";
import { ErrorEnum } from "@/constants/error-code";

/**
 * 获取用户列表
 */
export const list: AppHandlers<ListRoute> = async (c) => {
  const { pageSize, page, id, username, email, phone, status } = c.req.query();
  const limit = Number.parseInt(pageSize) || 10;
  const offset = (Number.parseInt(page) - 1) * limit || 0;

  const filters = [];

  if (id) {
    filters.push(eq(userTable.id, id));
  }

  if (username) {
    filters.push(like(userTable.username, `%${username}%`)); 
  }

  if (email) {
    filters.push(like(userTable.email, `%${email}%`)); 
  }

  if (phone) {
    filters.push(like(userTable.phone, `%${phone}%`)); 
  }

  if (status) {
    filters.push(eq(userTable.status, Number.parseInt(status)));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const user = await db.query.userTable.findMany({
    where,
    limit,
    offset,
    orderBy: [asc(userTable.createdAt)],
  });

  return jsonOK(c, await paginate(userTable, {pageSize,page}, user ))
};

/**
 * 新增用户
 */
export const create: AppHandlers<CreateRoute> = async (c) => {
  const user = await c.req.json();
  const example = await db.query.userTable.findFirst({
    where: eq(userTable.username, user.username),
  });
  if (example)
    return jsonFail(c, ErrorEnum.SYSTEM_USER_EXISTS);
  const [inserted] = await db.insert(userTable).values(user).returning();
  return jsonOK(c, inserted);
};

/**
 * 查询用户详情
 */
export const getOne: AppHandlers<GetOneRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });
  if (!user)
    return jsonFail(c, ErrorEnum.SYSTEM_USER_NOT_EXISTS);
  return jsonOK(c, user);
};

/**
 * 更新用户信息
 */
export const update: AppHandlers<UpdateRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });
  if (!user)
    return jsonFail(c, ErrorEnum.SYSTEM_USER_NOT_EXISTS);
  // 修改信息
  const updates = await c.req.json();
  await db.update(userTable).set(updates).where(eq(userTable.id, id));
  return jsonOK(c);
};

/**
 * 删除用户
 */
export const deleteOne: AppHandlers<DeleteOneRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });
  if (!user)
    return jsonFail(c, ErrorEnum.SYSTEM_USER_NOT_EXISTS);

  await db.delete(userTable).where(eq(userTable.id, id));
  return jsonOK(c);
};
