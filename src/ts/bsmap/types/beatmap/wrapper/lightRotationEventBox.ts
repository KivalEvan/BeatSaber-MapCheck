import type { DistributionType } from '../shared/constants.ts';
import type { Axis } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type {
   IWrapLightRotationEvent,
   IWrapLightRotationEventAttribute,
} from './lightRotationEvent.ts';

export interface IWrapLightRotationEventBoxAttribute extends IWrapEventBoxAttribute {
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
   events: IWrapLightRotationEventAttribute[];
}

export interface IWrapLightRotationEventBox
   extends IWrapEventBox,
      IWrapLightRotationEventBoxAttribute {
   events: IWrapLightRotationEvent[];

   setRotationDistribution(value: IWrapLightRotationEventBox['rotationDistribution']): this;
   setRotationDistributionType(value: IWrapLightRotationEventBox['rotationDistributionType']): this;
   setAxis(value: IWrapLightRotationEventBox['axis']): this;
   setFlip(value: IWrapLightRotationEventBox['flip']): this;
   setAffectFirst(value: IWrapLightRotationEventBox['affectFirst']): this;
   setEvents(value: IWrapLightRotationEvent[]): this;
}
