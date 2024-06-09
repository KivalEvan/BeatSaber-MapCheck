import type { IWrapBaseSlider, IWrapBaseSliderAttribute } from './baseSlider.ts';
import type { ICustomDataSlider } from './custom/slider.ts';

export interface IWrapChainAttribute extends IWrapBaseSliderAttribute {
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
   customData: ICustomDataSlider;
}

export interface IWrapChain extends Omit<IWrapBaseSlider, 'customData'>, IWrapChainAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   setSliceCount(value: number): this;
   setSquish(value: number): this;
}
