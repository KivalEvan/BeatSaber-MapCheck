import { EaseType } from '../shared/constants';
import { DistributionType } from '../shared/constants';
import { IBaseItem } from './baseItem';
import { IIndexFilter } from './indexFilter';

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
