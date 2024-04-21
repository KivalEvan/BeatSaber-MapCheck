// deno-lint-ignore-file no-explicit-any
import type { Axis } from '../shared/constants.ts';
import type { DistributionType } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type {
   IWrapLightTranslationEvent,
   IWrapLightTranslationEventAttribute,
} from './lightTranslationEvent.ts';

export interface IWrapLightTranslationEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
   /** Translation distribution `<float>` of light translation event box. */
   gapDistribution: number;
   /**
    * Translation distribution type `<int>` of light translation event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   gapDistributionType: DistributionType;
   /**
    * Axis `<int>` of light translation event box.
    * ```ts
    * 0 -> X
    * 1 -> Y
    * 2 -> Z
    * ```
    */
   axis: Axis;
   /** Flip translation `<int>` in light translation event box. */
   flip: 0 | 1;
   events: IWrapLightTranslationEventAttribute<TBase>[];
}

export interface IWrapLightTranslationEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
      IWrapLightTranslationEventBoxAttribute<TBox, TBase, TFilter> {
   events: IWrapLightTranslationEvent<TBase>[];

   setGapDistribution(value: IWrapLightTranslationEventBox['gapDistribution']): this;
   setGapDistributionType(value: IWrapLightTranslationEventBox['gapDistributionType']): this;
   setAxis(value: IWrapLightTranslationEventBox['axis']): this;
   setFlip(value: IWrapLightTranslationEventBox['flip']): this;
   setAffectFirst(value: IWrapLightTranslationEventBox['affectFirst']): this;
   setEvents(value: IWrapLightTranslationEvent<TBase>[]): this;
}
