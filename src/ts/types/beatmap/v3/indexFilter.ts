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
    /** Reversed `<int>` in index filter. */
    r: 0 | 1;
}

interface IIndexFilterSection extends IIndexFilterBase {
    f: 1;
    /** Divide into sections `<int>` in index filter. */
    p: number;
    /** Get section by ID `<int>` in index filter. */
    t: number;
}

interface IIndexFilterStepOffset extends IIndexFilterBase {
    f: 2;
    /** Light ID `<int>` in index filter. */
    p: number;
    /** Skip step `<int>` in index filter. */
    t: number;
}

export type IIndexFilter = IIndexFilterSection | IIndexFilterStepOffset;
