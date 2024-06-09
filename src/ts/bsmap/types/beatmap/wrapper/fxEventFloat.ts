import type { EaseType } from '../../../beatmap/shared/constants.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapFxEventFloatAttribute extends IWrapBaseObjectAttribute {
   /** Relative beat time `<float>` to event box group. */
   time: number;
   /** Ease type `<int>` of FX event. */
   easing: EaseType;
   /** Use previous event value `<int>` in FX event. */
   previous: 0 | 1;
   /** Value `<float>` of FX event. */
   value: number;
}

export interface IWrapFxEventFloat extends IWrapBaseObject, IWrapFxEventFloatAttribute {
   setPrevious(value: 0 | 1): this;
   setEasing(value: EaseType): this;
   setValue(value: number): this;
}
