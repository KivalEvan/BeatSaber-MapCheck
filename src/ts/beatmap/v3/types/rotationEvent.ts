import { BaseObject } from './baseObject';

/** Rotation event beatmap object. */
export interface RotationEvent extends BaseObject {
    /** Execution time `<int>` of rotation event.
     * ```ts
     * 0 -> Early
     * 1 -> Late
     * ```
     */
    e: 0 | 1;
    /** Rotation value `<float>` of rotation event. */
    r: number;
}
