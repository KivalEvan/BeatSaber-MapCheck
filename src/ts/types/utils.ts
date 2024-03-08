// deno-lint-ignore-file ban-types no-explicit-any
export type Primitive = string | Function | number | boolean | Symbol | undefined | null;

export type Only<T, U> = {
   [P in keyof T]: T[P];
} & {
   [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepWritable<T> = {
   -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};

export type DeepPartial<T> = {
   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequiredIgnore<T, Ignore extends string = ''> = {
   [P in keyof T]-?: T[P] extends object
      ? P extends Ignore
         ? T[P]
         : DeepRequiredIgnore<T[P], Ignore>
      : T[P];
};

export type LooseAutocomplete<T extends string | number> = T extends string
   ? T | (string & {})
   : T | (number & {});

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

// stuff from stackoverflow https://stackoverflow.com/questions/55539387/deep-omit-with-typescript
/** Deeply omit members of an array of interface or array of type. */
export type DeepOmitArray<T extends any[], K> = {
   [P in keyof T]: DeepOmit<T[P], K>;
};

/** Deeply omit members of an interface or type. */
export type DeepOmit<T, K> = T extends Primitive
   ? T
   : OmitNever<{
        [P in Exclude<keyof T, K>]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
           ? TP extends Primitive
              ? TP // leave primitives and functions alone
              : TP extends any[]
                ? DeepOmitArray<TP, K> // Array special handling
                : DeepOmit<TP, K>
           : never;
     }>;

/** Deeply omit members of an array of interface or array of type, making all members optional. */
export type PartialDeepOmitArray<T extends any[], K> = Partial<{
   [P in Partial<keyof T>]: Partial<PartialDeepOmit<T[P], K>>;
}>;

/** Deeply omit members of an interface or type, making all members optional. */
export type PartialDeepOmit<T, K> = T extends Primitive
   ? T
   : Partial<{
        [P in Exclude<keyof T, K>]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
           ? TP extends Primitive
              ? TP // leave primitives and functions alone
              : TP extends any[]
                ? PartialDeepOmitArray<TP, K> // Array special handling
                : Partial<PartialDeepOmit<TP, K>>
           : never;
     }>;

export type ExcludeMethod<T> = Pick<
   T,
   { [P in keyof T]: T[P] extends Function ? never : P }[keyof T]
>;

export type DeepExcludeMethodArray<T extends any[]> = {
   [P in keyof T]: DeepExcludeMethod<T[P]>;
};

export type DeepExcludeMethod<T> = T extends Primitive
   ? T
   : {
        [P in Exclude<keyof T, Function>]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
           ? TP extends Exclude<Primitive, Function>
              ? TP // leave primitives
              : TP extends Function
                ? never
                : TP extends any[]
                  ? DeepExcludeMethodArray<TP> // Array special handling
                  : DeepExcludeMethod<TP>
           : never;
     };

export type PartialWrapper<T> = Partial<DeepOmit<ExcludeMethod<T>, 'data'>>;

export type DeepPartialWrapper<T> = DeepPartial<DeepOmit<DeepExcludeMethod<T>, 'data'>>;

export type Nullable<T> = T extends Primitive
   ? T | null
   : {
        [P in keyof T]?: Nullable<T[P]>;
     };

/** INTERNAL USE ONLY */
export type _ObtainCustomData<T extends Record<string, unknown>> =
   T['customData'] extends Record<string, unknown>
      ? T['customData']
      : T['_customData'] extends Record<string, unknown>
        ? T['_customData']
        : Record<string, unknown>;
