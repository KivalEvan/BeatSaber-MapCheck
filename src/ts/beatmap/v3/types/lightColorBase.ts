/** Basic building block of beatmap light. */
export interface LightColorBase {
    /** Beat time `<float>` of base light color. */
    b: number;
    /** Transition type `<int>` of base light color.
     * ```ts
     * 0 -> Instant
     * 1 -> Interpolate
     * 2 -> Extend
     * ```
     */
    i: 0 | 1 | 2;
    /** Color `<int>` of base light color.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    c: 0 | 1;
    /** Brightness `<float>` of base light color. */
    s: number;
    /** Frequency `<int>` of base light color. */
    f: number;
}
