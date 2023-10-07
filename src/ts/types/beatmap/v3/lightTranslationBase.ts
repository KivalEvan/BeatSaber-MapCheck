import { ICustomDataBase } from '../shared/custom/customData';

export interface ILightTranslationBase {
   /** Relative beat time `<float>` to event box group. */
   b: number;
   /**
    * Ease type `<int>` of light translation.
    * ```ts
    * -1 -> Step
    * 0 -> Linear
    * 1 -> EaseInQuad
    * 2 -> EaseOutQuad
    * 3 -> EaseInOutQuad
    * ```
    */
   e: -1 | 0 | 1 | 2 | 3;
   /** Use previous event translation value `<int>` in light translation. */
   p: 0 | 1;
   /** Translation value `<float>` of light translation. */
   t: number;
   customData?: ICustomDataBase;
}
