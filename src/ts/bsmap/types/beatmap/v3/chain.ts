import type { IBaseSlider } from './baseSlider.ts';
import type { ICustomDataSlider } from './custom/slider.ts';

export interface IChain extends IBaseSlider {
   /**
    * Slice count or element `<int>` in chain.
    *
    * **NOTE:** Must be more than `0`, the head counts as `1`.
    */
   sc?: number;
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
   s?: number;
   customData?: ICustomDataSlider;
}
