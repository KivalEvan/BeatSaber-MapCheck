import { EaseType } from '../shared/constants';
import { IItem } from './item';

export interface IFxEventFloat extends IItem {
   /** Use previous event value `<int>` in FX event. */
   p?: 0 | 1;
   /** Ease type `<int>` of FX event. */
   e?: EaseType;
   /** Value `<float>` of FX event. */
   v?: number;
}
