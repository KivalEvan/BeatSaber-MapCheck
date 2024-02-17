import { DistributionType } from '../shared/constants';
import { EaseType } from '../shared/constants';
import { IItem } from './item';

export interface IEventBoxCommon extends IItem {
   /** Beat distribution `<float>` of event box. */
   w?: number;
   /**
    * Beat distribution type `<int>` of event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   d?: DistributionType;
   /** Distribution `<float>` of event box. */
   s?: number;
   /**
    * Distribution type `<int>` of event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t?: DistributionType;
   /** Distribution should affect first event `<int>` of event box. */
   b?: 0 | 1;
   /** Easing `<int>` of distribution. */
   e?: EaseType;
}
