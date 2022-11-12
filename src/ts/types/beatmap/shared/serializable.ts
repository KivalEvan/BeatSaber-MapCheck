export interface ISerializable<T extends Record<keyof T, unknown> | Record<keyof T, unknown>[]> {
    readonly data: T;
    // deno-lint-ignore no-explicit-any
    toJSON(): Record<string, any>;
    serialize(): string;
    clone(): this;
}
