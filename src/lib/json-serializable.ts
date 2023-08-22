export type JsonSerializable<T> =
    T extends string | number | boolean | null ? T :
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends Function ? never :
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object ? { [K in keyof T]: JsonSerializable<T[K]> } :
    never;

