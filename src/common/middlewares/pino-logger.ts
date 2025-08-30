import { pinoLogger } from "hono-pino";
import * as fs from "node:fs";
import * as path from "node:path";
import pino from "pino";
import pretty from "pino-pretty";
import { createStream } from "rotating-file-stream";

import env from "@/env";

const isProduction = env.NODE_ENV === "production";

// 确保 logs 目录和子目录存在
const logsDir = path.resolve(process.cwd(), "logs");
const appLogsDir = path.resolve(logsDir, "app");
const errorLogsDir = path.resolve(logsDir, "error");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
if (!fs.existsSync(appLogsDir)) {
  fs.mkdirSync(appLogsDir, { recursive: true });
}
if (!fs.existsSync(errorLogsDir)) {
  fs.mkdirSync(errorLogsDir, { recursive: true });
}

// 创建日志轮转流
function createLogStream(filename: string, logType: "app" | "error") {
  const logDir = logType === "app" ? appLogsDir : errorLogsDir;

  // 生成带日期的文件名
  const generateFilename = () => {
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD 格式
    return `${filename.replace(".log", "")}-${dateStr}.log`;
  };

  return createStream(generateFilename, {
    size: `${env.LOGGER_MAX_SIZE}M`, // 文件最大 10MB
    interval: `${env.LOGGER_INTERVAL}d`, // 每天轮转
    compress: "gzip", // 启用 gzip 压缩
    path: logDir, // 日志目录
    maxFiles: env.LOGGER_MAX_DAYS,
  });
}

export function logger() {
  // 基础流：所有环境都会写入 JSON 格式的文件日志
  const streams: pino.StreamEntry[] = [
    // 应用日志 (info 及以上)
    {
      level: "info",
      stream: createLogStream("app", "app"),
    },
    // 错误日志 (error 及以上)
    {
      level: "error",
      stream: createLogStream("error", "error"),
    },
  ];

  // 控制台输出配置
  if (env.LOGGER_ENABLE_CONSOLE) {
    if (isProduction) {
      streams.push({
        level: env.LOGGER_LEVEL as pino.Level,
        stream: process.stdout,
      });
    } else {
      // 非生产环境：输出格式化的可读数据到控制台
      streams.push({
        level: env.LOGGER_LEVEL as pino.Level,
        stream: pretty({
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          messageFormat: "[{req.method}] {req.url} ({res.status}) - {responseTime}ms - {msg}",
        }),
      });
    }
  }

  const pinoInstance = pino({
    level: env.LOGGER_LEVEL || "info",
  }, pino.multistream(streams));

  return pinoLogger({
    pino: pinoInstance,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};
