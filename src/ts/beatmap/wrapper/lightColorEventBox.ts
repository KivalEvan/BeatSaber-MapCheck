import { IWrapLightColorBase } from '../../types/beatmap/wrapper/lightColorBase';
import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { WrapEventBox } from './eventBox';

/** Light color event box beatmap class object. */
export abstract class WrapLightColorEventBox<T extends Record<keyof T, unknown>>
    extends WrapEventBox<T>
    implements IWrapLightColorEventBox
{
    abstract get brightnessDistribution(): IWrapLightColorEventBox['brightnessDistribution'];
    abstract set brightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']);
    abstract get brightnessDistributionType(): IWrapLightColorEventBox['brightnessDistributionType'];
    abstract set brightnessDistributionType(value: IWrapLightColorEventBox['brightnessDistributionType']);
    abstract get affectFirst(): IWrapLightColorEventBox['affectFirst'];
    abstract set affectFirst(value: IWrapLightColorEventBox['affectFirst']);
    abstract get events(): IWrapLightColorBase[];
    abstract set events(value: IWrapLightColorBase[]);

    setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']) {
        this.brightnessDistribution = value;
        return this;
    }
    setBrightnessDistributionType(value: IWrapLightColorEventBox['brightnessDistributionType']) {
        this.brightnessDistributionType = value;
        return this;
    }
    setAffectFirst(value: IWrapLightColorEventBox['affectFirst']) {
        this.affectFirst = value;
        return this;
    }
    abstract setEvents(value: IWrapLightColorBase[]): this;

    isValid(): boolean {
        return (
            super.isValid() &&
            (this.brightnessDistributionType === 1 || this.brightnessDistributionType === 2) &&
            (this.affectFirst === 0 || this.affectFirst === 1)
        );
    }
}
