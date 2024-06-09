import type { EaseType } from '../shared/constants.ts';
import type { DistributionType } from '../shared/constants.ts';
import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';
import type { IWrapIndexFilter, IWrapIndexFilterAttribute } from './indexFilter.ts';

export interface IWrapEventBoxAttribute extends IWrapBaseItemAttribute {
   /** Index filter of event box. */
   filter: IWrapIndexFilterAttribute;
   /** Beat distribution `<float>` of event box. */
   beatDistribution: number;
   /**
    * Beat distribution type `<int>` of event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   beatDistributionType: DistributionType;
   /** Easing `<int>` of distribution. */
   easing: EaseType;
   /** Event distribution should affect first event `<int>` of event box. */
   affectFirst: 0 | 1;
   events: IWrapBaseObjectAttribute[];
}

export interface IWrapEventBox extends IWrapBaseItem, IWrapEventBoxAttribute {
   events: IWrapBaseObject[];

   setFilter(value: IWrapIndexFilter): this;
   setBeatDistribution(value: IWrapEventBox['beatDistribution']): this;
   setBeatDistributionType(value: IWrapEventBox['beatDistributionType']): this;
   setEasing(value: IWrapEventBox['easing']): this;
   setEvents(value: number[] | IWrapBaseObject[]): this;
}
