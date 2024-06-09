import type { RandomType } from '../shared/constants.ts';
import type { IndexFilterType } from '../shared/constants.ts';
import type { LimitAlsoAffectsType } from '../shared/constants.ts';
import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';

export interface IWrapIndexFilterAttribute extends IWrapBaseItemAttribute {
   /**
    * Type `<int>` of index filter.
    * ```ts
    * 1 -> Division
    * 2 -> Step And Offset
    * ```
    */
   type: IndexFilterType;
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
   random: RandomType;
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
   limitAffectsType: LimitAlsoAffectsType;
}

export interface IWrapIndexFilter extends IWrapBaseItem, IWrapIndexFilterAttribute {
   setType(value: IndexFilterType): this;
   setP0(value: number): this;
   setP1(value: number): this;
   setReverse(value: 0 | 1): this;
   setChunks(value: number): this;
   setRandom(value: RandomType): this;
   setSeed(value: number): this;
   setLimit(value: number): this;
   setLimitAffectsType(value: LimitAlsoAffectsType): this;
}
