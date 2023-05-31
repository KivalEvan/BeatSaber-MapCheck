import { IBaseSlider } from './baseSlider';
import { ICustomDataSlider } from './custom/slider';

export interface IArc extends IBaseSlider {
    /** Head control point length multiplier `<float>` of arc.
     * ```ts
     * 0 -> Flat Start
     * 1 -> Curved Start
     * ```
     * ---
     * Range: `0-1`
     */
    mu: number;
    /** Tail control point length multiplier `<float>` of arc.
     * ```ts
     * 0 -> Flat End
     * 1 -> Curved End
     * ```
     * ---
     * Range: `0-1`
     */
    tmu: number;
    /** Tail cut direction `<int>` of arc.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended, assumes down-directional.
     */
    tc: number;
    /** Mid anchor mode `<int>` of arc.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    m: 0 | 1 | 2;
    customData?: ICustomDataSlider;
}
