import {
    AuthError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    InternalServerError
} from "@/domain/errors";

import { ErrorCode } from "@/shared/errors-codes";
import { ActionResult } from "@/shared/action-result";

export const ERROR_CODE_TO_HTTP_STATUS: Record<ErrorCode, number> = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INVALID_INPUT: 400,
    INTERNAL_SERVER_ERROR: 500,
};

export function mapErrorToErrorCode(error: unknown): ErrorCode {
    if (error instanceof AuthError) {
        return "UNAUTHORIZED";
    }
    if (error instanceof ForbiddenError) {
        return "FORBIDDEN";
    }
    if (error instanceof NotFoundError) {
        return "NOT_FOUND";
    }
    if (error instanceof ValidationError) {
        return "INVALID_INPUT";
    }
    return "INTERNAL_SERVER_ERROR";
}

export async function withActionResult<T> (fn: () => Promise<T>): Promise<ActionResult<T>> {
    try {
        const data =  await fn();
        return { ok: true, data, status: 200, code: "SUCCESS" };
    } catch (error) {
        const code = mapErrorToErrorCode(error);
        return { ok: false, code: code, status: ERROR_CODE_TO_HTTP_STATUS[code] };
    }
}
