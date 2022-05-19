import { IIndexFilter } from './indexFilter';

export interface IEventBox {
    /** Index filter of event box. */
    f: IIndexFilter;
    /** Beat distribution `<float>` of event box. */
    w: number;
    /** Beat distribution type `<int>` of event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    d: 1 | 2;
}
