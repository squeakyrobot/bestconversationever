
export function randomEnum<T extends { [index: string]: string }>(enumType: T): T[keyof T] {
    const values = Object.keys(enumType);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumType[enumKey] as T[keyof T];
}

export function getEnumKey<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);

    return keys.length > 0 ? keys[0] : null;
}