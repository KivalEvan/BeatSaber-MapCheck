import type { Axis } from '../shared/constants.ts';
import type { IEventBoxCommon } from './eventBoxCommon.ts';

export interface ILightRotationEventBox extends IEventBoxCommon {
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
   f?: 0 | 1;
}
