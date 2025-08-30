import type { PgTable } from "drizzle-orm/pg-core";

import db from "@/db";

// 定义通用分页结果接口
interface PaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    count: number;
    hasNext:boolean;
    hasPrev:boolean;
  };
}

// 定义分页参数接口
interface PaginationParams {
  page: string;
  pageSize: string;
}

export async function paginate<T>(table: PgTable, params: PaginationParams, data: Array<T>): Promise<PaginatedResult<T>> {
  const totalItems = await db.$count(table);
  const currentPage = Number.parseInt(params.page) || 1;
  const itemsPerPage = Number.parseInt(params.pageSize) || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  return {
    items: data,
    meta: {
      totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
      count: data.length,
      hasNext,
      hasPrev,
    },
  };
}
