import type { HttpError } from "@sveltejs/kit";

/**
 * Throws an error if the condition is not true
 *
 * @param condition Condition to check
 * @param reason Message or error to throw. Defaults to 'Assertion failed'
 */
export function assert(condition: unknown, reason?: string | Error | HttpError): asserts condition {
    if (!condition) {
        if (!reason) {
            throw new Error('Assertion failed');
        }
        else if (typeof reason === 'string') {
            throw new Error(reason);
        }
        else {
            throw reason;
        }
    }
}

