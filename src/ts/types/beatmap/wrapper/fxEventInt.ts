// deno-lint-ignore-file no-explicit-any
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapFxEventIntAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObjectAttribute<T> {
   /** Relative beat time `<float>` to event box group. */
   time: number;
   /** Use previous event value `<int>` in FX event. */
   previous: 0 | 1;
   /** Value `<int>` of FX event. */
   value: number;
}

export interface IWrapFxEventInt<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapFxEventIntAttribute<T> {
   setPrevious(value: 0 | 1): this;
   setValue(value: number): this;
}
