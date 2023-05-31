import { IWrapLightTranslationBase } from '../../types/beatmap/wrapper/lightTranslationBase';
import { IWrapLightTranslationEventBox } from '../../types/beatmap/wrapper/lightTranslationEventBox';
import { WrapEventBox } from './eventBox';

/** Light translation event box beatmap class object. */
export abstract class WrapLightTranslationEventBox<
        TBox extends { [P in keyof TBox]: TBox[P] },
        TBase extends { [P in keyof TBase]: TBase[P] },
        TFilter extends { [P in keyof TFilter]: TFilter[P] },
    >
    extends WrapEventBox<TBox, TBase, TFilter>
    implements IWrapLightTranslationEventBox<TBox>
{
    protected _translationDistribution!: IWrapLightTranslationEventBox['translationDistribution'];
    protected _translationDistributionType!: IWrapLightTranslationEventBox['translationDistributionType'];
    protected _axis!: IWrapLightTranslationEventBox['axis'];
    protected _flip!: IWrapLightTranslationEventBox['flip'];
    protected _affectFirst!: IWrapLightTranslationEventBox['affectFirst'];
    protected declare _events: IWrapLightTranslationBase<TBase>[];

    get translationDistribution(): IWrapLightTranslationEventBox['translationDistribution'] {
        return this._translationDistribution;
    }
    set translationDistribution(value: IWrapLightTranslationEventBox['translationDistribution']) {
        this._translationDistribution = value;
    }
    get translationDistributionType(): IWrapLightTranslationEventBox['translationDistributionType'] {
        return this._translationDistributionType;
    }
    set translationDistributionType(
        value: IWrapLightTranslationEventBox['translationDistributionType'],
    ) {
        this._translationDistributionType = value;
    }
    get axis(): IWrapLightTranslationEventBox['axis'] {
        return this._axis;
    }
    set axis(value: IWrapLightTranslationEventBox['axis']) {
        this._axis = value;
    }
    get flip(): IWrapLightTranslationEventBox['flip'] {
        return this._flip;
    }
    set flip(value: IWrapLightTranslationEventBox['flip']) {
        this._flip = value;
    }
    get affectFirst(): IWrapLightTranslationEventBox['affectFirst'] {
        return this._affectFirst;
    }
    set affectFirst(value: IWrapLightTranslationEventBox['affectFirst']) {
        this._affectFirst = value;
    }
    get events(): IWrapLightTranslationBase<TBase>[] {
        return this._events;
    }
    set events(value: IWrapLightTranslationBase<TBase>[]) {
        this._events = value;
    }

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
