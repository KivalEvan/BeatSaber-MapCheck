import type { EventBoxColor } from '../shared/constants.ts';
import type { EaseType } from '../shared/constants.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapLightColorEventAttribute extends IWrapBaseObjectAttribute {
   /** Relative beat time `<float>` to event box group. */
   time: number;
   previous: 0 | 1;
   /**
    * Color `<int>` of base light color.
    * ```ts
    * -1 -> None
    * 0 -> Red
    * 1 -> Blue
    * 2 -> White
    * ```
    */
   color: EventBoxColor;
   /**
    * Frequency `<int>` of base light color.
    *
    * Blinking frequency in beat time of the event, `0` is static.
    */
   frequency: number;
   /**
    * Brightness `<float>` of base light color.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   brightness: number;
   /**
    * Strobe brightness `<float>` of base light color.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   strobeBrightness: number;
   /** Strobe  fade `<int>` of base light color. */
   strobeFade: 0 | 1;
   easing: EaseType;
}

export interface IWrapLightColorEvent extends IWrapBaseObject, IWrapLightColorEventAttribute {
   setPrevious(value: 0 | 1): this;
   setColor(value: EventBoxColor): this;
   setBrightness(value: number): this;
   setFrequency(value: number): this;
   setStrobeBrightness(value: number): this;
   setStrobeFade(value: 0 | 1): this;
   setEasing(value: EaseType): this;
}
