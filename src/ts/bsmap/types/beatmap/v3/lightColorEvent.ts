import type { TransitionType } from '../shared/constants.ts';
import type { EventBoxColor } from '../shared/constants.ts';
import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface ILightColorEvent {
   /** Relative beat time `<float>` to event box group. */
   b?: number;
   /**
    * Color `<int>` of base light color.
    * ```ts
    * -1 -> None
    * 0 -> Red
    * 1 -> Blue
    * 2 -> White
    * ```
    */
   c?: EventBoxColor;
   /**
    * Frequency `<int>` of base light color.
    *
    * Blinking frequency in beat time of the event, `0` is static.
    */
   f?: number;
   /**
    * Transition type `<int>` of base light color.
    * ```ts
    * 0 -> Instant
    * 1 -> Interpolate
    * 2 -> Extend
    * ```
    */
   i?: TransitionType;
   /**
    * Brightness `<float>` of base light color.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   s?: number;
   /**
    * Strobe brightness `<float>` of base light color.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   sb?: number;
   /** Strobe  fade `<int>` of base light color. */
   sf?: 0 | 1;
   customData?: ICustomDataBase;
}
