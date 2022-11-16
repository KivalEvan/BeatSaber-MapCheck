import { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject';
import { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox';
import { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter';
import { WrapBaseItem } from './baseItem';

/** Base event box beatmap class object. */
export abstract class WrapEventBox<
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapBaseItem<TBox>
    implements IWrapEventBox<TBox, TBase, TFilter>
{
    abstract get filter(): IWrapIndexFilter<TFilter>;
    abstract set filter(value: IWrapIndexFilter<TFilter>);
    abstract get beatDistribution(): IWrapEventBox<TBase>['beatDistribution'];
    abstract set beatDistribution(value: IWrapEventBox<TBase>['beatDistribution']);
    abstract get beatDistributionType(): IWrapEventBox<TBase>['beatDistributionType'];
    abstract set beatDistributionType(value: IWrapEventBox<TBase>['beatDistributionType']);
    abstract get easing(): IWrapEventBox<TBase>['easing'];
    abstract set easing(value: IWrapEventBox<TBase>['easing']);
    abstract get events(): IWrapBaseObject<TBase>[];
    abstract set events(val: IWrapBaseObject<TBase>[]);

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
