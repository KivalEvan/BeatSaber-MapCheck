export type Only<T, U> = {
    [P in keyof T]: T[P];
} & {
    [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type DeepPartial<T> = {
    // deno-lint-ignore ban-types
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ObjectToReturn<T> = {
    // deno-lint-ignore ban-types
    [P in keyof T]: T[P] extends object ? () => T[P] : T[P];
};
