import { EventBox } from './eventBox';
import { LightRotationBase } from './lightRotationBase';

export interface LightRotationEventBox extends EventBox {
    /** Rotation distribution param `<float>` of light rotation event box. */
    s: number;
    /** Rotation distribution param type `<int>` of light rotation event box.
     * ```ts
     * 1 -> Wave
     * 2 -> Step
     * ```
     */
    t: 1 | 2;
    /** Axis `<int>` of light rotation event box.
     * ```ts
     * 0 -> X
     * 1 -> Y
     * ```
     */
    a: 0 | 1;
    /** Light rotation base data list. */
    l: LightRotationBase[];
    /** Flip rotation `<int>` in light rotation event box. */
    r: 0 | 1;
    /** Rotation distribution should affect first base event `<int>` of light rotation event box. */
    b: 0 | 1;
}
