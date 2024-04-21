import type { DistributionType } from '../shared/constants.ts';
import type { IEventBox } from './eventBox.ts';

export interface IFxEventBox extends IEventBox {
   /** FX distribution `<float>` of FX event box. */
   s?: number;
   /**
    * FX distribution type `<int>` of FX event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t?: DistributionType;
   /** FX distribution should affect first event `<int>` of FX event box. */
   b?: 0 | 1;
   /** FX index `<int>` list. */
   l?: number[];
}
