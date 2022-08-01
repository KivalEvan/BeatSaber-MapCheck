interface IIndexFilterBase {
    /** Type `<int>` of index filter.
     * ```ts
     * 1 -> Division
     * 2 -> Step And Offset
     * ```
     */
    f: 1 | 2;
    /** Parameter 0 `<int>` in index filter. */
    p: number;
    /** Parameter 1 `<int>` in index filter. */
    t: number;
    /** Reversed `<int>` in index filter.
     *
     * Reverse the order for distribution, does not reverse selection.
     */
    r: 0 | 1;
}

interface IIndexFilterSection extends IIndexFilterBase {
    f: 1;
    /** Divide into sections `<int>` in index filter.
     *
     * ```ts
     * Default: 1
     * ```
     */
    p: number;
    /** Get section by ID `<int>` in index filter.
     *
     * Similar to typical array index starting from `0`.
     * ```ts
     * Default: 0
     * ```
     */
    t: number;
}

interface IIndexFilterStepOffset extends IIndexFilterBase {
    f: 2;
    /** Light ID `<int>` in index filter.
     *
     * Select the start ID in group event starting from `0`.
     * ```ts
     * Default: 0
     * ```
     */
    p: number;
    /** Skip step `<int>` in index filter.
     *
     * Jump by amount of step starting from start light ID.
     * ```ts
     * Default: 1
     * ```
     */
    t: number;
}

export type IIndexFilter = IIndexFilterSection | IIndexFilterStepOffset;
