import { EventBox } from './eventBox';
import { LightColorBase } from './lightColorBase';

export interface LightColorEventBox extends EventBox {
    /** Brightness distribution param `<float>` of light color event box. */
    r: number;
    /** Brightness distribution param type `<int>` of light color event box.
     * ```ts
     * 1 -> Wave
     * 2 -> Step
     * ```
     */
    t: 1 | 2;
    /** Light color base data list. */
    e: LightColorBase[];
    /** Brigthness distribution should affect first base event `<int>` of light color event box. */
    b: 0 | 1;
}
