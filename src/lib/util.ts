
export function randomEnum<T extends { [index: string]: string }>(enumType: T): T[keyof T] {
    const enumValues = Object.keys(enumType)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];

    const randomIndex = Math.floor(Math.random() * enumValues.length);

    return enumValues[randomIndex];
}

export function getEnumKey<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);

    return keys.length > 0 ? keys[0] : null;
}