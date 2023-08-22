
export function randomEnum<T extends { [index: string]: string }>(enumType: T): T[keyof T] {
    const values = Object.keys(enumType);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumType[enumKey] as T[keyof T];
}

export function getEnumKey<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);

    return keys.length > 0 ? keys[0] : null;
}

export function nameFormat(name: string): string {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export type ErrorWithMessage = {
    message: string
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    )
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError

    try {
        return new Error(JSON.stringify(maybeError))
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError))
    }
}

export function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message
}