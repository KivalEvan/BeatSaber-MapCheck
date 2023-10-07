// deno-lint-ignore-file no-explicit-any
import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapFxEventFloatAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<T> {
   /** Relative beat time `<float>` to event box group. */
   time: number;
   /**
    * Ease type `<int>` of FX event.
    * ```ts
    * -1 -> Step
    * 0 -> Linear
    * 1 -> EaseInQuad
    * 2 -> EaseOutQuad
    * 3 -> EaseInOutQuad
    * ```
    */
   easing: -1 | 0 | 1 | 2 | 3;
   /** Use previous event value `<int>` in FX event. */
   previous: 0 | 1;
   /** Value `<float>` of FX event. */
   value: number;
}

export interface IWrapFxEventFloat<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapFxEventFloatAttribute<T> {
   setPrevious(value: 0 | 1): this;
   setEasing(value: -1 | 0 | 1 | 2 | 3): this;
   setValue(value: number): this;
}
