// deno-lint-ignore-file no-explicit-any
import { ModType } from '../shared/modCheck';
import { IWrapBaseSlider, IWrapBaseSliderAttribute } from './baseSlider';

export interface IWrapArcAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
    extends IWrapBaseSliderAttribute<T> {
    /** Head control point length multiplier `<float>` of arc.
     * ```ts
     * 0 -> Flat Start
     * 1 -> Curved Start
     * ```
     * ---
     * Range: `0-1`
     */
    lengthMultiplier: number;
    /** Tail control point length multiplier `<float>` of arc.
     * ```ts
     * 0 -> Flat End
     * 1 -> Curved End
     * ```
     * ---
     * Range: `0-1`
     */
    tailLengthMultiplier: number;
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
    tailDirection: number;
    /** Mid anchor mode `<int>` of arc.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    midAnchor: 0 | 1 | 2;
}

export interface IWrapArc<T extends { [P in keyof T]: T[P] } = Record<string, any>>
    extends IWrapBaseSlider<T>,
        IWrapArcAttribute<T> {
    setLengthMultiplier(value: number): this;
    setTailLengthMultiplier(value: number): this;
    setTailDirection(value: number): this;
    setMidAnchor(value: 0 | 1 | 2): this;

    /** Get arc and return standardised tail note angle.
     * ```ts
     * const arcTailAngle = arc.getTailAngle();
     * ```
     */
    getTailAngle(type?: ModType): number;
}
