// deno-lint-ignore-file no-explicit-any
import { ExecutionTime } from '../shared/constants';
import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapRotationEventAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<T> {
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

export interface IWrapRotationEvent<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapRotationEventAttribute<T> {
   setExecutionTime(value: ExecutionTime): this;
   setRotation(value: number): this;
}
