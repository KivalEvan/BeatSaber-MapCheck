import { IBaseItem } from './baseItem';

interface IIndexFilterBase extends IBaseItem {
   /**
    * Type `<int>` of index filter.
    * ```ts
    * 1 -> Division
    * 2 -> Step And Offset
    * ```
    */
   f: 1 | 2;
   /** Parameter 0 `<int>` in index filter. */
   p: number;
   /** Parameter 1 `<int>` in index filter. */
   t: number;
   /**
    * Reversed `<int>` in index filter.
    *
    * Reverse the order for distribution, does not reverse selection.
    */
   r: 0 | 1;
   /**
    * Chunks `<int>` of index filter.
    *
    * Pairs next ID by available denominator.
    */
   c: number;
   /**
    * Random type `<bitmask>` of index filter.
    * ```ts
    * 0 -> No Random
    * 1 -> Keep Order
    * 2 -> Random Elements
    * 3 -> All
    * ```
    */
   n: 0 | 1 | 2 | 3;
   /** Random seed `<int>` in index filter. */
   s: number;
   /**
    * Limit (percentage) `<float>` of index filter.
    *
    * Select ID by percentage, rounded up to nearest ID. Disabled if 0.
    *
    * **RANGE:** `0-1` (0% to 100%) strict.
    */
   l: number;
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
   d: 0 | 1 | 2 | 3;
}

interface IIndexFilterSection extends IIndexFilterBase {
   f: 1;
   /** Divide into sections `<int>` in index filter. */
   p: number;
   /**
    * Get section by ID `<int>` in index filter.
    *
    * Similar to typical array index starting from `0`.
    */
   t: number;
}

interface IIndexFilterStepOffset extends IIndexFilterBase {
   f: 2;
   /**
    * Light ID `<int>` in index filter.
    *
    * Select the start ID in group event starting from `0`.
    */
   p: number;
   /**
    * Skip step `<int>` in index filter.
    *
    * Jump by amount of step starting from start light ID.
    */
   t: number;
}

export type IIndexFilter = IIndexFilterSection | IIndexFilterStepOffset;
