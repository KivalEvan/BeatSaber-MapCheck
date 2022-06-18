import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { Serializable } from '../shared/serializable';

/** Index filter beatmap v3 class object. */
export class IndexFilter extends Serializable<IIndexFilter> {
    static default: Required<IIndexFilter> = {
        f: 1,
        p: 0,
        t: 0,
        r: 0,
    };

    private constructor(indexFilter: IIndexFilter) {
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
        });
    }

    toObject(): IIndexFilter {
        return {
            f: this.type,
            p: this.p0,
            t: this.p1,
            r: this.reverse,
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
}
