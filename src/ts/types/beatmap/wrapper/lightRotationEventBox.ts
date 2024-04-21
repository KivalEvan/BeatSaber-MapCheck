// deno-lint-ignore-file no-explicit-any
import type { DistributionType } from '../shared/constants.ts';
import type { Axis } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type {
   IWrapLightRotationEvent,
   IWrapLightRotationEventAttribute,
} from './lightRotationEvent.ts';

export interface IWrapLightRotationEventBoxAttribute<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
   /** Rotation distribution `<float>` of light rotation event box. */
   rotationDistribution: number;
   /**
    * Rotation distribution type `<int>` of light rotation event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   rotationDistributionType: DistributionType;
   /**
    * Axis `<int>` of light rotation event box.
    * ```ts
    * 0 -> X
    * 1 -> Y
    * 2 -> Z
    * ```
    */
   axis: Axis;
   /** Flip rotation `<int>` in light rotation event box. */
   flip: 0 | 1;
   events: IWrapLightRotationEventAttribute<TBase>[];
}

export interface IWrapLightRotationEventBox<
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
      IWrapLightRotationEventBoxAttribute<TBox, TBase, TFilter> {
   events: IWrapLightRotationEvent<TBase>[];

   setRotationDistribution(value: IWrapLightRotationEventBox['rotationDistribution']): this;
   setRotationDistributionType(value: IWrapLightRotationEventBox['rotationDistributionType']): this;
   setAxis(value: IWrapLightRotationEventBox['axis']): this;
   setFlip(value: IWrapLightRotationEventBox['flip']): this;
   setAffectFirst(value: IWrapLightRotationEventBox['affectFirst']): this;
   setEvents(value: IWrapLightRotationEvent<TBase>[]): this;
}
