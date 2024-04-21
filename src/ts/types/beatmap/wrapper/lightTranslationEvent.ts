// deno-lint-ignore-file no-explicit-any
import type { EaseType } from '../shared/constants.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapLightTranslationEventAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<T> {
   /** Relative beat time `<float>` to event box group. */
   time: number;
   /** Ease type `<int>` of light translation. */
   easing: EaseType;
   /** Use previous event translation value `<int>` in light translation. */
   previous: 0 | 1;
   /** Translation value `<float>` of light translation. */
   translation: number;
}

export interface IWrapLightTranslationEvent<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObject<T>,
      IWrapLightTranslationEventAttribute<T> {
   setPrevious(value: 0 | 1): this;
   setEasing(value: EaseType): this;
   setTranslation(value: number): this;
}
