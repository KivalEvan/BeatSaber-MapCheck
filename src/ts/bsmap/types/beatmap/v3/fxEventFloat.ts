import type { EaseType } from '../shared/constants.ts';
import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface IFxEventFloat {
   /** Relative beat time `<float>` to event box group. */
   b?: number;
   /** Ease type `<int>` of FX event. */
   i?: EaseType;
   /** Use previous event value `<int>` in FX event. */
   p?: 0 | 1;
   /** Value `<float>` of FX event. */
   v?: number;
   customData?: ICustomDataBase;
}
