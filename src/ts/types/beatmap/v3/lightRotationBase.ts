export interface ILightRotationBase {
    /** Add beat time `<float>` to event box group. */
    b: number;
    /** Use previous event rotation value `<int>` in light rotation. */
    p: 0 | 1;
    /** Ease type `<int>` of light rotation.
     * ```ts
     * 0 -> Linear
     * 1 -> EaseInQuad
     * 2 -> EaseOutQuad
     * 3 -> EaseInOutQuad
     * ```
     */
    e: number;
    /** Loop count `<int>` in light rotation. */
    l: number;
    /** Rotation value `<float>` of light rotation.
     * ```ts
     * Left-side -> Clockwise
     * Right-side -> Counter-Clockwise
     * ```
     */
    r: number;
    /** Rotation direction `<int>` of light rotation.
     * ```ts
     * 0 -> Automatic
     * 1 -> Clockwise
     * 2 -> Counter-clockwise
     * ```
     */
    o: 0 | 1 | 2;
}
