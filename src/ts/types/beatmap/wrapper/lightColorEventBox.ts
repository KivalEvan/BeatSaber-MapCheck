// deno-lint-ignore-file no-explicit-any
import type { DistributionType } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type { IWrapLightColorEvent, IWrapLightColorEventAttribute } from './lightColorEvent.ts';

export interface IWrapLightColorEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
   /**
    * Brightness distribution `<float>` of light color event box.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   brightnessDistribution: number;
   /**
    * Brightness distribution type `<int>` of light color event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   brightnessDistributionType: DistributionType;
   events: IWrapLightColorEventAttribute<TBase>[];
}

export interface IWrapLightColorEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
      IWrapLightColorEventBoxAttribute<TBox, TBase, TFilter> {
   events: IWrapLightColorEvent<TBase>[];

   setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']): this;
   setBrightnessDistributionType(
      value: IWrapLightColorEventBox['brightnessDistributionType'],
   ): this;
   setAffectFirst(value: IWrapLightColorEventBox['affectFirst']): this;
   setEvents(value: IWrapLightColorEvent<TBase>[]): this;
}
