import { IEventBox } from '../../types/beatmap/v3/eventBox';
import { Serializable } from '../shared/serializable';
import { IndexFilter } from './indexFilter';

export abstract class EventBox<T extends IEventBox> extends Serializable<T> {
    private f: IndexFilter;
    protected constructor(eventBox: Required<T>) {
        super(eventBox);
        this.f = IndexFilter.create(eventBox.f);
    }

    /** Index filter of event box. */
    get filter() {
        return this.f;
    }
    set filter(value: IndexFilter) {
        this.f = value;
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
