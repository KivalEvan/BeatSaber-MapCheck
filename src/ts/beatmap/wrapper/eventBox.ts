import { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox';
import { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter';
import { WrapBaseItem } from './baseItem';

/** Base event box beatmap class object. */
export abstract class WrapEventBox<T extends Record<keyof T, unknown>>
    extends WrapBaseItem<T>
    implements IWrapEventBox
{
    abstract get filter(): IWrapIndexFilter;
    abstract set filter(value: IWrapIndexFilter);
    abstract get beatDistribution(): IWrapEventBox['beatDistribution'];
    abstract set beatDistribution(value: IWrapEventBox['beatDistribution']);
    abstract get beatDistributionType(): IWrapEventBox['beatDistributionType'];
    abstract set beatDistributionType(value: IWrapEventBox['beatDistributionType']);

    setFilter(value: IWrapIndexFilter) {
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

    isValid(): boolean {
        return this.beatDistributionType === 1 || this.beatDistributionType === 2;
    }
}
