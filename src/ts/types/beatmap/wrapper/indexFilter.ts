// deno-lint-ignore-file no-explicit-any
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';

export interface IWrapIndexFilterAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItemAttribute<T> {
   /**
    * Type `<int>` of index filter.
    * ```ts
    * 1 -> Division
    * 2 -> Step And Offset
    * ```
    */
   type: 1 | 2;
   /**
    * Parameter 0 `<int>` in index filter.
    * ```ts
    * Division -> Section
    * Step And Offset -> ID
    * ```
    */
   p0: number;
   /**
    * Parameter 1 `<int>` in index filter.
    * ```ts
    * Division -> ID
    * Step And Offset -> Step
    * ```
    */
   p1: number;
   /**
    * Reversed `<int>` in index filter.
    *
    * Reverse the order for distribution, does not reverse selection.
    */
   reverse: 0 | 1;
   /**
    * Chunks `<int>` of index filter.
    *
    * Pairs next ID by available denominator.
    */
   chunks: number;
   /**
    * Random type `<bitmask>` of index filter.
    * ```ts
    * 0 -> No Random
    * 1 -> Keep Order
    * 2 -> Random Elements
    * 3 -> All
    * ```
    */
   random: 0 | 1 | 2 | 3;
   /** Random seed `<int>` in index filter. */
   seed: number;
   /**
    * Limit (percentage) `<float>` of index filter.
    *
    * Select ID by percentage, rounded up to nearest ID. Defaults to 100% if value is 0.
    *
    * **RANGE:** `0-1` (0% to 100%) strict.
    */
   limit: number;
   /**
    * Limit also affects type `<bitmask>` in index filter.
    * ```ts
    * 0 -> None
    * 1 -> Duration
    * 2 -> Distribution
    * 3 -> All
    * ```
    *
    * Adjust to limited ID list and has no effect with `Step` type.
    */
   limitAffectsType: 0 | 1 | 2 | 3;
}

export interface IWrapIndexFilter<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapIndexFilterAttribute<T> {
   setType(value: 1 | 2): this;
   setP0(value: number): this;
   setP1(value: number): this;
   setReverse(value: 0 | 1): this;
   setChunks(value: number): this;
   setRandom(value: 0 | 1 | 2): this;
   setSeed(value: number): this;
   setLimit(value: number): this;
   setLimitAffectsType(value: 0 | 1 | 2): this;
}
