import { IEventBox } from '../../types/beatmap/v3/eventBox';
import { Serializable } from '../shared/serializable';
import { IndexFilter } from './indexFilter';

/** Base event box beatmap v3 class object. */
export abstract class EventBox<T extends IEventBox> extends Serializable<T> {
    private _f: IndexFilter;
    protected constructor(eventBox: Required<T>) {
        super(eventBox);
        this._f = IndexFilter.create(eventBox.f);
    }

    /** Index filter of event box. */
    get filter() {
        return this._f;
    }
    set filter(value: IndexFilter) {
        this._f = value;
    }

    /** Beat distribution `<float>` of event box. */
    get beatDistribution() {
        return this.data.w;
    }
    set beatDistribution(value: IEventBox['w']) {
        this.data.w = value;
    }

    /** Beat distribution type `<int>` of event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    get beatDistributionType() {
        return this.data.d;
    }
    set beatDistributionType(value: IEventBox['d']) {
        this.data.d = value;
    }

    setFilter(value: IndexFilter) {
        this.filter = value;
        return this;
    }
    setBeatDistribution(value: IEventBox['w']) {
        this.beatDistribution = value;
        return this;
    }
    setBeatDistributionType(value: IEventBox['d']) {
        this.beatDistributionType = value;
        return this;
    }
}
