import { IndexFilter } from './indexFilter';

export interface EventBox {
    /** Index filter of event box. */
    f: IndexFilter;
    /** Beat distribution param `<float>` of event box. */
    w: number;
    /** Distribution param type `<int>` of event box.
     * ```ts
     * 1 -> Wave
     * 2 -> Step
     * ```
     */
    d: 1 | 2;
}
