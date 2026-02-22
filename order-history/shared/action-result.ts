import { ErrorCode } from "@/shared/errors-codes.js";

export type ActionResult<T> = 
    | { ok: true;   code:"SUCCESS",     status: 200,    data: T }
    | { ok: false;  code: ErrorCode;    status: number; message?: string };