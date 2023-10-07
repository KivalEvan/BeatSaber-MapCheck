// deno-lint-ignore-file no-explicit-any
import { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox';

export interface IWrapFxEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxAttribute<TBox, number, TFilter> {
   /** FX distribution `<float>` of FX event box. */
   fxDistribution: number;
   /**
    * FX distribution type `<int>` of FX event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   fxDistributionType: 1 | 2;
   /** FX index `<int>` list. */
   events: number[];
}

export interface IWrapFxEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBox<TBox, number, TFilter>,
      IWrapFxEventBoxAttribute<TBox, TFilter> {
   events: number[];

   setFxDistribution(value: IWrapFxEventBox['fxDistribution']): this;
   setFxDistributionType(value: IWrapFxEventBox['fxDistributionType']): this;
   setAffectFirst(value: IWrapFxEventBox['affectFirst']): this;
   setEvents(value: number[]): this;
}
