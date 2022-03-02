import { BaseSlider } from './baseSlider';

/** Slider beatmap object. */
export interface Slider extends BaseSlider {
    /** Head control point length multiplier `<float>` of slider.
     * int */
    mu: number;
    /** Tail control point length multiplier `<float>` of slider.
     * float */
    tmu: number;
    /** Tail cut direction `<int>` of slider.
     * ```ts
     * 6 | 1 | 7
     * 2 | 8 | 3
     * 4 | 0 | 5
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    tc: number;
    /** Mid anchor mode `<int>` of slider.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    m: 0 | 1 | 2;
}
