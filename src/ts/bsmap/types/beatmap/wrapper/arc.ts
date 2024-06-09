import type { SliderMidAnchorMode } from '../shared/constants.ts';
import type { IWrapBaseSlider, IWrapBaseSliderAttribute } from './baseSlider.ts';
import type { ICustomDataSlider } from './custom/slider.ts';
import type { GetAngleFn } from '../shared/functions.ts';

export interface IWrapArcAttribute extends IWrapBaseSliderAttribute {
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
   customData: ICustomDataSlider;
}

export interface IWrapArc extends Omit<IWrapBaseSlider, 'customData'>, IWrapArcAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   setLengthMultiplier(value: number): this;
   setTailLengthMultiplier(value: number): this;
   setTailDirection(value: number): this;
   setMidAnchor(value: SliderMidAnchorMode): this;

   /**
    * Get standardised tail note angle.
    *
    * @example
    * ```ts
    * import type { IWrapArc } from './arc.ts';
    * let arc!: IWrapArc;
    * const optionalFn = (object: IWrapArc) => object.customData.value;
    * const arcTailAngle = arc.getTailAngle(optionalFn);
    * ```
    *
    * Custom function are used to return any arbitrary data first if value exist, otherwise returns base value.
    */
   getTailAngle(fn?: GetAngleFn<this>): number;
}
