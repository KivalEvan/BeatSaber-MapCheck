import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface IFxEventInt {
   /** Relative beat time `<float>` to event box group. */
   b?: number;
   /** Use previous event value `<int>` in FX event. */
   p?: 0 | 1;
   /** Value `<int>` of FX event. */
   v?: number;
   customData?: ICustomDataBase;
}
