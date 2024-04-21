// deno-lint-ignore-file no-explicit-any
import type { EventBoxColor } from '../shared/constants.ts';
import type { TransitionType } from '../shared/constants.ts';
import type { EaseType } from '../shared/constants.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapLightColorEventAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<T> {
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
    * Transition type `<int>` of base light color.
    * ```ts
    * 0 -> Instant
    * 1 -> Interpolate
    * 2 -> Extend
    * ```
    */
   transition: TransitionType;
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

export interface IWrapLightColorEvent<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapLightColorEventAttribute<T> {
   setPrevious(value: 0 | 1): this;
   setTransition(value: TransitionType): this;
   setColor(value: EventBoxColor): this;
   setBrightness(value: number): this;
   setFrequency(value: number): this;
   setStrobeBrightness(value: number): this;
   setStrobeFade(value: 0 | 1): this;
   setEasing(value: EaseType): this;
}
