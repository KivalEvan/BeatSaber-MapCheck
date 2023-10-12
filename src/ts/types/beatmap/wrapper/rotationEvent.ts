// deno-lint-ignore-file no-explicit-any
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
   executionTime: 0 | 1;
   /** Clockwise rotation value `<float>` of rotation event. */
   rotation: number;
}

export interface IWrapRotationEvent<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapRotationEventAttribute<T> {
   setExecutionTime(value: 0 | 1): this;
   setRotation(value: number): this;
}
