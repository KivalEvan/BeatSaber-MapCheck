import { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject';
import { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox';
import { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter';
import { WrapBaseItem } from './baseItem';

/** Base event box beatmap class object. */
export abstract class WrapEventBox<
        TBox extends { [P in keyof TBox]: TBox[P] },
        TBase extends { [P in keyof TBase]: TBase[P] },
        TFilter extends { [P in keyof TFilter]: TFilter[P] },
    >
    extends WrapBaseItem<TBox>
    implements IWrapEventBox<TBox, TBase, TFilter>
{
    protected _filter!: IWrapIndexFilter<TFilter>;
    protected _beatDistribution!: IWrapEventBox<TBase>['beatDistribution'];
    protected _beatDistributionType!: IWrapEventBox<TBase>['beatDistributionType'];
    protected _easing!: IWrapEventBox<TBase>['easing'];
    protected _events!: IWrapBaseObject<TBase>[];

    get filter(): IWrapIndexFilter<TFilter> {
        return this._filter;
    }
    set filter(value: IWrapIndexFilter<TFilter>) {
        this._filter = value;
    }
    get beatDistribution(): IWrapEventBox<TBase>['beatDistribution'] {
        return this._beatDistribution;
    }
    set beatDistribution(value: IWrapEventBox<TBase>['beatDistribution']) {
        this._beatDistribution = value;
    }
    get beatDistributionType(): IWrapEventBox<TBase>['beatDistributionType'] {
        return this._beatDistributionType;
    }
    set beatDistributionType(value: IWrapEventBox<TBase>['beatDistributionType']) {
        this._beatDistributionType = value;
    }
    get easing(): IWrapEventBox<TBase>['easing'] {
        return this._easing;
    }
    set easing(value: IWrapEventBox<TBase>['easing']) {
        this._easing = value;
    }
    get events(): IWrapBaseObject<TBase>[] {
        return this._events;
    }
    set events(value: IWrapBaseObject<TBase>[]) {
        this._events = value;
    }

    setFilter(value: IWrapIndexFilter<TFilter>) {
        this.filter = value;
        return this;
    }
    setBeatDistribution(value: IWrapEventBox['beatDistribution']) {
        this.beatDistribution = value;
        return this;
    }
    setBeatDistributionType(value: IWrapEventBox['beatDistributionType']) {
        this.beatDistributionType = value;
        return this;
    }
    setEasing(value: IWrapEventBox['easing']) {
        this.easing = value;
        return this;
    }
    abstract setEvents(value: IWrapBaseObject<TBase>[]): this;

    isValid(): boolean {
        return (
            (this.beatDistributionType === 1 || this.beatDistributionType === 2) &&
            this.easing >= 0 &&
            this.easing <= 3 &&
            this.events.every((e) => e.isValid()) &&
            this.filter.isValid()
        );
    }
}
