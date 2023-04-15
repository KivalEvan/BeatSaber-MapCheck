import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { IWrapLightTranslationBase } from '../../types/beatmap/wrapper/lightTranslationBase';
import { IWrapLightTranslationEventBox } from '../../types/beatmap/wrapper/lightTranslationEventBox';
import { WrapEventBox } from './eventBox';

/** Light translation event box beatmap class object. */
export abstract class WrapLightTranslationEventBox<
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBox<TBox, TBase, TFilter>
    implements IWrapLightTranslationEventBox<TBox>
{
    abstract get translationDistribution(): ILightTranslationEventBox['s'];
    abstract set translationDistribution(value: ILightTranslationEventBox['s']);
    abstract get translationDistributionType(): ILightTranslationEventBox['t'];
    abstract set translationDistributionType(value: ILightTranslationEventBox['t']);
    abstract get axis(): ILightTranslationEventBox['a'];
    abstract set axis(value: ILightTranslationEventBox['a']);
    abstract get flip(): ILightTranslationEventBox['r'];
    abstract set flip(value: ILightTranslationEventBox['r']);
    abstract get affectFirst(): ILightTranslationEventBox['b'];
    abstract set affectFirst(value: ILightTranslationEventBox['b']);
    abstract get events(): IWrapLightTranslationBase<TBase>[];
    abstract set events(value: IWrapLightTranslationBase<TBase>[]);

    setTranslationDistribution(value: IWrapLightTranslationEventBox['translationDistribution']) {
        this.translationDistribution = value;
        return this;
    }
    setTranslationDistributionType(
        value: IWrapLightTranslationEventBox['translationDistributionType'],
    ) {
        this.translationDistributionType = value;
        return this;
    }
    setAxis(value: IWrapLightTranslationEventBox['axis']) {
        this.axis = value;
        return this;
    }
    setFlip(value: IWrapLightTranslationEventBox['flip']) {
        this.flip = value;
        return this;
    }
    setAffectFirst(value: IWrapLightTranslationEventBox['affectFirst']) {
        this.affectFirst = value;
        return this;
    }
    abstract setEvents(value: IWrapLightTranslationBase<TBase>[]): this;

    isValid(): boolean {
        return (
            super.isValid() &&
            (this.translationDistributionType === 1 || this.translationDistributionType === 2) &&
            (this.axis === 0 || this.axis === 1) &&
            (this.flip === 0 || this.flip === 1) &&
            (this.affectFirst === 0 || this.affectFirst === 1)
        );
    }
}
