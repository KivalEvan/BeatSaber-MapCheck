import type { EaseType } from '../shared/constants.ts';
import type { DistributionType } from '../shared/constants.ts';
import type { IBaseItem } from './baseItem.ts';
import type { IIndexFilter } from './indexFilter.ts';

export interface IEventBox extends IBaseItem {
   /** Index filter of event box. */
   f?: IIndexFilter;
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
   /** Easing `<int>` of distribution. */
   i?: EaseType;
}
