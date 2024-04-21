// deno-lint-ignore-file no-explicit-any
import type { DistributionType } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type { IWrapFxEventFloat, IWrapFxEventFloatAttribute } from './fxEventFloat.ts';

export interface IWrapFxEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
   /** FX distribution `<float>` of FX event box. */
   fxDistribution: number;
   /**
    * FX distribution type `<int>` of FX event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   fxDistributionType: DistributionType;
   /** FX event list. */
   events: IWrapFxEventFloatAttribute<TBase>[];
}

export interface IWrapFxEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
      IWrapFxEventBoxAttribute<TBox, TBase, TFilter> {
   events: IWrapFxEventFloat<TBase>[];

   setFxDistribution(value: IWrapFxEventBox['fxDistribution']): this;
   setFxDistributionType(value: IWrapFxEventBox['fxDistributionType']): this;
   setAffectFirst(value: IWrapFxEventBox['affectFirst']): this;
   setEvents(value: IWrapFxEventFloat<TBase>[]): this;
}
