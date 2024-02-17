import { EaseType } from '../shared/constants';
import { LightRotationDirection } from '../shared/constants';
import { IItem } from './item';

export interface ILightRotationEvent extends IItem {
   /** Use previous event rotation value `<int>` in light rotation. */
   p?: 0 | 1;
   /** Ease type `<int>` of light rotation. */
   e?: EaseType;
   /** Loop count `<int>` in light rotation. */
   l?: number;
   /**
    * Rotation value `<float>` of light rotation.
    * ```ts
    * Left-side -> Clockwise
    * Right-side -> Counter-Clockwise
    * ```
    */
   r?: number;
   /**
    * Rotation direction `<int>` of light rotation.
    * ```ts
    * 0 -> Automatic
    * 1 -> Clockwise
    * 2 -> Counter-clockwise
    * ```
    */
   d?: LightRotationDirection;
}
