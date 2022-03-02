export interface IndexFilter {
    /** Type `<int>` of index filter.
     * ```ts
     * 1 -> Division
     * 2 -> Step And Offset
     * ```
     */
    f: 1 | 2;
    /** Param0 `<int>` in index filter. */
    p: number;
    /** Param1 `<int>` in index filter. */
    t: number;
    /** Reversed `<int>` in index filter. */
    r: 0 | 1;
}
