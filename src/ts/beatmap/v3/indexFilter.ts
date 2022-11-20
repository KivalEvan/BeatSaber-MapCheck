import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapIndexFilter } from '../wrapper/indexFilter';

/** Index filter beatmap v3 class object. */
export class IndexFilter extends WrapIndexFilter<Required<IIndexFilter>> {
    static default: ObjectReturnFn<Required<IIndexFilter>> = {
        f: 1,
        p: 0,
        t: 0,
        r: 0,
        c: 0,
        n: 0,
        s: 0,
        l: 0,
        d: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(indexFilter: Required<IIndexFilter>) {
        super(indexFilter);
        if (this.data.f === 1) {
            this.p0 = this.p0 ? this.p0 : 1;
        }
    }

    static create(): IndexFilter;
    static create(indexFilter: PartialWrapper<IWrapIndexFilter<Required<IIndexFilter>>>): IndexFilter;
    static create(indexFilter: Partial<IIndexFilter>): IndexFilter;
    static create(
        indexFilter: Partial<IIndexFilter> & PartialWrapper<IWrapIndexFilter<Required<IIndexFilter>>>,
    ): IndexFilter;
    static create(
        indexFilter: Partial<IIndexFilter> & PartialWrapper<IWrapIndexFilter<Required<IIndexFilter>>> = {},
    ): IndexFilter {
        return new IndexFilter({
            f: indexFilter.type ?? indexFilter.f ?? IndexFilter.default.f,
            p: indexFilter.p0 ?? indexFilter.p ?? IndexFilter.default.p,
            t: indexFilter.p1 ?? indexFilter.t ?? IndexFilter.default.t,
            r: indexFilter.reverse ?? indexFilter.r ?? IndexFilter.default.r,
            c: indexFilter.chunks ?? indexFilter.c ?? IndexFilter.default.c,
            n: indexFilter.random ?? indexFilter.n ?? IndexFilter.default.n,
            s: indexFilter.seed ?? indexFilter.s ?? IndexFilter.default.s,
            l: indexFilter.limit ?? indexFilter.l ?? IndexFilter.default.l,
            d: indexFilter.limitAffectsType ?? indexFilter.d ?? IndexFilter.default.d,
            customData: indexFilter.customData ?? IndexFilter.default.customData(),
        });
    }

    toJSON(): Required<IIndexFilter> {
        return {
            f: this.type,
            p: this.p0,
            t: this.p1,
            r: this.reverse,
            c: this.chunks,
            n: this.random,
            s: this.seed,
            l: this.limit,
            d: this.limitAffectsType,
            customData: deepCopy(this.customData),
        };
    }

    get type() {
        return this.data.f;
    }
    set type(value: IIndexFilter['f']) {
        this.data.f = value;
    }

    get p0() {
        return this.data.p;
    }
    set p0(value: IIndexFilter['p']) {
        this.data.p = value;
    }

    get p1() {
        return this.data.t;
    }
    set p1(value: IIndexFilter['t']) {
        this.data.t = value;
    }

    get reverse() {
        return this.data.r;
    }
    set reverse(value: IIndexFilter['r']) {
        this.data.r = value;
    }

    get chunks() {
        return this.data.c;
    }
    set chunks(value: IIndexFilter['c']) {
        this.data.c = value;
    }

    get random() {
        return this.data.n;
    }
    set random(value: IIndexFilter['n']) {
        this.data.n = value;
    }

    get seed() {
        return this.data.s;
    }
    set seed(value: IIndexFilter['s']) {
        this.data.s = value;
    }

    get limit() {
        return this.data.l;
    }
    set limit(value: IIndexFilter['l']) {
        this.data.l = value;
    }

    get limitAffectsType() {
        return this.data.d;
    }
    set limitAffectsType(value: IIndexFilter['d']) {
        this.data.d = value;
    }

    get customData(): NonNullable<IIndexFilter['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IIndexFilter['customData']>) {
        this.data.customData = value;
    }
}
