// deno-lint-ignore no-explicit-any
export interface ISerializable<T extends Record<string, any> | Record<string, any>[]> {
    readonly data: Required<T>;
    toJSON(): Required<T>;
    serialize(): string;
    clone<U extends this>(): U;
}
