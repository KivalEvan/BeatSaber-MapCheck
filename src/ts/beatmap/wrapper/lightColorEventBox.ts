import { IWrapLightColorBase } from '../../types/beatmap/wrapper/lightColorBase';
import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { WrapEventBox } from './eventBox';

/** Light color event box beatmap class object. */
export abstract class WrapLightColorEventBox<
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBox<TBox, TBase, TFilter>
    implements IWrapLightColorEventBox<TBox, TBase, TFilter>
{
    abstract get brightnessDistribution(): IWrapLightColorEventBox['brightnessDistribution'];
    abstract set brightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']);
    abstract get brightnessDistributionType(): IWrapLightColorEventBox['brightnessDistributionType'];
    abstract set brightnessDistributionType(
        value: IWrapLightColorEventBox['brightnessDistributionType'],
    );
    abstract get affectFirst(): IWrapLightColorEventBox['affectFirst'];
    abstract set affectFirst(value: IWrapLightColorEventBox['affectFirst']);
    abstract get events(): IWrapLightColorBase<TBase>[];
    abstract set events(value: IWrapLightColorBase<TBase>[]);

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
    abstract setEvents(value: IWrapLightColorBase<TBase>[]): this;

    isValid(): boolean {
        return (
            super.isValid() &&
            (this.brightnessDistributionType === 1 || this.brightnessDistributionType === 2) &&
            (this.affectFirst === 0 || this.affectFirst === 1)
        );
    }
}
