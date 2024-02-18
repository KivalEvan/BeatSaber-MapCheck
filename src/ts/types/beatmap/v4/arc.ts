import { SliderMidAnchorMode } from '../shared/constants';
import { ICustomDataSlider } from '../v3/custom/slider';
import { IItem } from './item';

export interface IArc extends IItem {
   /**
    * Head control point length multiplier `<float>` of arc.
    *
    * Offset curve point from origin to the head direction of arc.
    */
   m?: number;
   /**
    * Tail control point length multiplier `<float>` of arc.
    *
    * Offset curve point to origin from the tail direction of arc.
    */
   tm?: number;
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
   a?: SliderMidAnchorMode;
   customData?: ICustomDataSlider;
}
