import { ExecutionTime } from '../shared/constants';
import { IItem } from './item';

export interface ISpawnRotation extends IItem {
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
