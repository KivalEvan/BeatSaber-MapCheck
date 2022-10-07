import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { Serializable } from '../shared/serializable';

/** Index filter beatmap v3 class object. */
export class IndexFilter extends Serializable<IIndexFilter> {
    static default: Required<IIndexFilter> = {
        f: 1,
        p: 0,
        t: 0,
        r: 0,
        c: 0,
        l: 0,
        d: 0,
        n: 0,
        s: 0,
    };

    protected constructor(indexFilter: IIndexFilter) {
        super(indexFilter);
        if (this.data.f === 1) {
            this.p0 = this.p0 ? this.p0 : 1;
        }
    }

    static create(indexFilter: Partial<IIndexFilter> = {}): IndexFilter {
        return new IndexFilter({
            f: indexFilter.f ?? IndexFilter.default.f,
            p: indexFilter.p ?? IndexFilter.default.p,
            t: indexFilter.t ?? IndexFilter.default.t,
            r: indexFilter.r ?? IndexFilter.default.r,
            c: indexFilter.c ?? IndexFilter.default.c,
            l: indexFilter.l ?? IndexFilter.default.l,
            d: indexFilter.d ?? IndexFilter.default.d,
            n: indexFilter.n ?? IndexFilter.default.n,
            s: indexFilter.s ?? IndexFilter.default.s,
        });
    }

    toJSON(): IIndexFilter {
        return {
            f: this.type,
            p: this.p0,
            t: this.p1,
            r: this.reverse,
            c: this.chunks,
            l: this.limit,
            d: this.limitAffectsType,
            n: this.random,
            s: this.seed,
        };
    }

    /** Type `<int>` of index filter.
     * ```ts
     * 1 -> Division
     * 2 -> Step And Offset
     * ```
     */
    get type() {
        return this.data.f;
    }
    set type(value: IIndexFilter['f']) {
        this.data.f = value;
    }

    /** Parameter 0 `<int>` in index filter. */
    get p0() {
        return this.data.p;
    }
    set p0(value: IIndexFilter['p']) {
        this.data.p = value;
    }

    /** Parameter 1 `<int>` in index filter. */
    get p1() {
        return this.data.t;
    }
    set p1(value: IIndexFilter['t']) {
        this.data.t = value;
    }

    /** Reversed `<int>` in index filter. */
    get reverse() {
        return this.data.r;
    }
    set reverse(value: IIndexFilter['r']) {
        this.data.r = value;
    }

    /** Chunks `<int>` of index filter.
     *
     * Pairs next ID by available denominator.
     */
    get chunks() {
        return this.data.c;
    }
    set chunks(value: IIndexFilter['c']) {
        this.data.c = value;
    }

    /** Limit (percentage) `<float>` of index filter.
     *
     * Select ID by percentage, rounded up to nearest ID. Disabled if 0.
     *
     * Range: `0-1` (0% to 100%) strict.
     */
    get limit() {
        return this.data.l;
    }
    set limit(value: IIndexFilter['l']) {
        this.data.l = value;
    }

    /** Limit also affects type `<int>` in index filter.
     * ```ts
     * 0 -> None
     * 1 -> Duration
     * 2 -> Distribution
     * ```
     * Adjust to limited ID list and has no effect with `Step` type.
     */
    get limitAffectsType() {
        return this.data.d;
    }
    set limitAffectsType(value: IIndexFilter['d']) {
        this.data.d = value;
    }

    /** Random type `<int>` of index filter.
     * ```ts
     * 0 -> No Random
     * 1 -> Keep Order
     * 2 -> Random Elements
     * ```
     */
    get random() {
        return this.data.n;
    }
    set random(value: IIndexFilter['n']) {
        this.data.n = value;
    }

    /** Random seed `<int>` in index filter. */
    get seed() {
        return this.data.s;
    }
    set seed(value: IIndexFilter['s']) {
        this.data.s = value;
    }
}
