import { IWrapBaseObject } from './baseObject';

export interface IWrapRotationEvent extends IWrapBaseObject {
    /** Execution time `<int>` of rotation event.
     * ```ts
     * 0 -> Early
     * 1 -> Late
     * ```
     */
    executionTime: 0 | 1;
    /** Clockwise rotation value `<float>` of rotation event. */
    rotation: number;

    setExecutionTime(value: 0 | 1): this;
    setRotation(value: number): this;
}
