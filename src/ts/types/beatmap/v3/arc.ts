import { IBaseSlider } from './baseSlider';
import { ICustomDataSlider } from './custom/slider';

export interface IArc extends IBaseSlider {
   /**
    * Head control point length multiplier `<float>` of arc.
    *
    * Offset curve point from origin to the head direction of arc.
    */
   mu: number;
   /**
    * Tail control point length multiplier `<float>` of arc.
    *
    * Offset curve point to origin from the tail direction of arc.
    */
   tmu: number;
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
   tc: number;
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
   m: 0 | 1 | 2;
   customData?: ICustomDataSlider;
}
