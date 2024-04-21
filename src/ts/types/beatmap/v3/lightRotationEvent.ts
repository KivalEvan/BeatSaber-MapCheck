import type { EaseType } from '../shared/constants.ts';
import type { LightRotationDirection } from '../shared/constants.ts';
import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface ILightRotationEvent {
   /** Relative beat time `<float>` to event box group. */
   b?: number;
   /** Ease type `<int>` of light rotation. */
   e?: EaseType;
   /** Loop count `<int>` in light rotation. */
   l?: number;
   /**
    * Rotation direction `<int>` of light rotation.
    * ```ts
    * 0 -> Automatic
    * 1 -> Clockwise
    * 2 -> Counter-clockwise
    * ```
    */
   o?: LightRotationDirection;
   /** Use previous event rotation value `<int>` in light rotation. */
   p?: 0 | 1;
   /**
    * Rotation value `<float>` of light rotation.
    * ```ts
    * Left-side -> Clockwise
    * Right-side -> Counter-Clockwise
    * ```
    */
   r?: number;
   customData?: ICustomDataBase;
}
