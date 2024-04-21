// deno-lint-ignore-file no-explicit-any
import type { SliderMidAnchorMode } from '../shared/constants.ts';
import type { ModType } from '../shared/modCheck.ts';
import type { IWrapBaseSlider, IWrapBaseSliderAttribute } from './baseSlider.ts';

export interface IWrapArcAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseSliderAttribute<T> {
   /**
    * Head control point length multiplier `<float>` of arc.
    *
    * Offset curve point from origin to the head direction of arc.
    */
   lengthMultiplier: number;
   /**
    * Tail control point length multiplier `<float>` of arc.
    *
    * Offset curve point to origin from the tail direction of arc.
    */
   tailLengthMultiplier: number;
   /**
    * Tail cut direction `<int>` of arc.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    *
    * **WARNING:** Dot-directional is not recommended, assumes down-directional.
    */
   tailDirection: number;
   /**
    * Mid anchor mode `<int>` of arc.
    * ```ts
    * 0 -> Straight
    * 1 -> Clockwise
    * 2 -> Counter-Clockwise
    * ```
    *
    * **NOTE:** The visual will only be applied under specific condition.
    */
   midAnchor: SliderMidAnchorMode;
}

export interface IWrapArc<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseSlider<T>,
      IWrapArcAttribute<T> {
   setLengthMultiplier(value: number): this;
   setTailLengthMultiplier(value: number): this;
   setTailDirection(value: number): this;
   setMidAnchor(value: SliderMidAnchorMode): this;

   /**
    * Get arc and return standardised tail note angle.
    * ```ts
    * const arcTailAngle = arc.getTailAngle();
    * ```
    */
   getTailAngle(type?: ModType): number;
}
