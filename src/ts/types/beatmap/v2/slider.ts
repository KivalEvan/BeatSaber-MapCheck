/** not a burst slider. */
export interface ISlider {
    /** Color type `<int>` of base slider.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    _colorType: 0 | 1;
    _headTime: number;
    _headLineIndex: number;
    _headLineLayer: number;
    /** Head control point length multiplier `<float>` of slider. */
    _headControlPointLengthMultiplier: number;
    /** Head cut direction `<int>` of slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    _headCutDirection: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    _tailTime: number;
    _tailLineIndex: number;
    _tailLineLayer: number;
    /** Tail control point length multiplier `<float>` of slider. */
    _tailControlPointLengthMultiplier: number;
    /** Tail cut direction `<int>` of slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    _tailCutDirection: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    /** Mid anchor mode `<int>` of slider.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    _sliderMidAnchorMode: 0 | 1 | 2;
}
