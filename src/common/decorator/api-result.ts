import type { Context } from "hono";

import { RESPONSE_SUCCESS_CODE } from "@/constants/response";

/**
 * Defines the standard structure for an API response payload.
 * Using `readonly` is a good practice for data transfer objects.
 * @template T The type of the data payload.
 */
export class ResultData<T = any> {
  public readonly code: number;
  public readonly msg: string;
  public readonly data?: T;

  constructor(code: number, msg: string, data?: T) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

/**
 * Sends a standardized successful JSON response (HTTP 200).
 *
 * @template T The type of the data payload.
 * @param c The Hono context object.
 * @param data The data payload to send.
 * @param msg The success message.
 */
export function jsonOK<T>(c: Context, data?: T, msg = "success") {
  return c.json(new ResultData(RESPONSE_SUCCESS_CODE, msg, data), RESPONSE_SUCCESS_CODE);
}

/**
 * Sends a standardized failure JSON response.
 *
 * @param c The Hono context object.
 * @param error The error message.
 * @param code The business logic error code for the JSON body.
 */
export function jsonFail(c: Context, error = "fail", code = RESPONSE_SUCCESS_CODE) {
  // Failure responses typically don't include a 'data' field.
  if (!error.includes(":")) {
     return c.json(new ResultData(code, error, undefined), RESPONSE_SUCCESS_CODE);
  } else {
    const [code, errorMsg] = error.split(":");
    const errorCode = Number(code)
    return c.json(new ResultData(errorCode, errorMsg,undefined ), RESPONSE_SUCCESS_CODE);
  }
}
