import type { SliderMidAnchorMode } from '../shared/constants.ts';
import type { ICustomDataBase } from '../shared/custom/customData.ts';

/** not a chain. */
export interface IArc {
   /**
    * Color type `<int>` of base arc.
    * ```ts
    * 0 -> Red
    * 1 -> Blue
    * ```
    */
   _colorType?: 0 | 1;
   _headTime?: number;
   _headLineIndex?: number;
   _headLineLayer?: number;
   /** Head control point length multiplier `<float>` of arc. */
   _headControlPointLengthMultiplier?: number;
   /**
    * Head cut direction `<int>` of arc.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    */
   _headCutDirection?: number;
   _tailTime?: number;
   _tailLineIndex?: number;
   _tailLineLayer?: number;
   /** Tail control point length multiplier `<float>` of arc. */
   _tailControlPointLengthMultiplier?: number;
   /**
    * Tail cut direction `<int>` of arc.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    */
   _tailCutDirection?: number;
   /**
    * Mid anchor mode `<int>` of arc.
    * ```ts
    * 0 -> Straight
    * 1 -> Clockwise
    * 2 -> Counter-Clockwise
    * ```
    */
   _sliderMidAnchorMode?: SliderMidAnchorMode;
   _customData?: ICustomDataBase;
}
