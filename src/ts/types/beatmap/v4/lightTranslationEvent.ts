import { EaseType } from '../shared/constants';
import { IItem } from './item';

export interface ILightTranslationEvent extends IItem {
   /** Use previous event translation value `<int>` in light translation. */
   p?: 0 | 1;
   /** Ease type `<int>` of light translation. */
   e?: EaseType;
   /** Translation value `<float>` of light translation. */
   t?: number;
}
