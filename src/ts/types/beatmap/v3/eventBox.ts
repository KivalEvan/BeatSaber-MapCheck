import { IBaseItem } from './baseItem';
import { IIndexFilter } from './indexFilter';

export interface IEventBox extends IBaseItem {
   /** Index filter of event box. */
   f: IIndexFilter;
   /** Beat distribution `<float>` of event box. */
   w: number;
   /**
    * Beat distribution type `<int>` of event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   d: 1 | 2;
   /**
    * Easing `<int>` of distribution.
    * ```ts
    * 0 -> Linear
    * 1 -> EaseInQuad
    * 2 -> EaseOutQuad
    * 3 -> EaseInOutQuad
    * ```
    */
   i: 0 | 1 | 2 | 3;
}
