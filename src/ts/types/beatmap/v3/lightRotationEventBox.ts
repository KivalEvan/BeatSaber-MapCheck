import type { Axis } from '../shared/constants.ts';
import type { DistributionType } from '../shared/constants.ts';
import type { IEventBox } from './eventBox.ts';
import type { ILightRotationEvent } from './lightRotationEvent.ts';

export interface ILightRotationEventBox extends IEventBox {
   /** Rotation distribution `<float>` of light rotation event box. */
   s?: number;
   /**
    * Rotation distribution type `<int>` of light rotation event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t?: DistributionType;
   /**
    * Axis `<int>` of light rotation event box.
    * ```ts
    * 0 -> X
    * 1 -> Y
    * 2 -> Z
    * ```
    */
   a?: Axis;
   /** Flip rotation `<int>` in light rotation event box. */
   r?: 0 | 1;
   /** Rotation distribution should affect first event `<int>` of light rotation event box. */
   b?: 0 | 1;
   /** Light rotation base data list. */
   l: ILightRotationEvent[];
}
