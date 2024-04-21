// deno-lint-ignore-file no-explicit-any
import type { IWrapBaseSlider, IWrapBaseSliderAttribute } from './baseSlider.ts';

export interface IWrapChainAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseSliderAttribute<T> {
   /**
    * Slice count or element `<int>` in chain.
    *
    * **NOTE:** Must be more than `0`, the head counts as `1`.
    */
   sliceCount: number;
   /**
    * Length multiplier `<float>` of element in chain.
    * ```ts
    * 1 -> Normal length
    * 0.5 -> Half length
    * 0.25 -> Quarter length
    * ```
    *
    * **WARNING:** Value `0` will crash the game.
    */
   squish: number;
}

export interface IWrapChain<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseSlider<T>,
      IWrapChainAttribute<T> {
   setSliceCount(value: number): this;
   setSquish(value: number): this;
}
