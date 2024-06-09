import type { ExecutionTime } from '../shared/constants.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapRotationEventAttribute extends IWrapBaseObjectAttribute {
   /**
    * Execution time `<int>` of rotation event.
    * ```ts
    * 0 -> Early
    * 1 -> Late
    * ```
    */
   executionTime: ExecutionTime;
   /** Clockwise rotation value `<float>` of rotation event. */
   rotation: number;
}

export interface IWrapRotationEvent extends IWrapBaseObject, IWrapRotationEventAttribute {
   setExecutionTime(value: ExecutionTime): this;
   setRotation(value: number): this;
}
