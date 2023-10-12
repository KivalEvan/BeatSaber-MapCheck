import { ICustomDataBase } from '../shared/custom/customData';

export interface IFxEventFloat {
   /** Relative beat time `<float>` to event box group. */
   b: number;
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
   i: -1 | 0 | 1 | 2 | 3;
   /** Use previous event value `<int>` in FX event. */
   p: 0 | 1;
   /** Value `<float>` of FX event. */
   v: number;
   customData?: ICustomDataBase;
}
