// deno-lint-ignore-file no-explicit-any
import type { EaseType } from '../shared/constants.ts';
import type { DistributionType } from '../shared/constants.ts';
import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';
import type { IWrapIndexFilter, IWrapIndexFilterAttribute } from './indexFilter.ts';

export interface IWrapEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapBaseItemAttribute<TBox> {
   /** Index filter of event box. */
   filter: IWrapIndexFilterAttribute<TFilter>;
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
   events: number[] | IWrapBaseObjectAttribute<TBase>[];
}

export interface IWrapEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapBaseItem<TBox>,
      IWrapEventBoxAttribute<TBox, TBase, TFilter> {
   events: number[] | IWrapBaseObject<TBase>[];

   setFilter(value: IWrapIndexFilter<TFilter>): this;
   setBeatDistribution(value: IWrapEventBox['beatDistribution']): this;
   setBeatDistributionType(value: IWrapEventBox['beatDistributionType']): this;
   setEasing(value: IWrapEventBox['easing']): this;
   setEvents(value: number[] | IWrapBaseObject<TBase>[]): this;
}
