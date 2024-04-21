import type { ExecutionTime } from '../shared/constants.ts';
import type { IBaseObject } from './baseObject.ts';

export interface IRotationEvent extends IBaseObject {
   /**
    * Execution time `<int>` of rotation event.
    * ```ts
    * 0 -> Early
    * 1 -> Late
    * ```
    */
   e?: ExecutionTime;
   /** Clockwise rotation value `<float>` of rotation event. */
   r?: number;
}
