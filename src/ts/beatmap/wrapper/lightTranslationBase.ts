import { IWrapLightTranslationBase } from '../../types/beatmap/wrapper/lightTranslationBase';
import { WrapBaseObject } from './baseObject';

/** Light translation base beatmap class object. */
export abstract class WrapLightTranslationBase<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapLightTranslationBase<T>
{
    abstract get previous(): IWrapLightTranslationBase['previous'];
    abstract set previous(value: IWrapLightTranslationBase['previous']);
    abstract get easing(): IWrapLightTranslationBase['easing'];
    abstract set easing(value: IWrapLightTranslationBase['easing']);
    abstract get translation(): IWrapLightTranslationBase['translation'];
    abstract set translation(value: IWrapLightTranslationBase['translation']);

    setPrevious(value: IWrapLightTranslationBase['previous']) {
        this.previous = value;
        return this;
    }
    setEasing(value: IWrapLightTranslationBase['easing']) {
        this.easing = value;
        return this;
    }
    setTranslation(value: IWrapLightTranslationBase['translation']) {
        this.translation = value;
        return this;
    }

    isValid(): boolean {
        return (
            (this.previous === 0 || this.previous === 1) && this.easing >= -1 && this.easing <= 3
        );
    }
}
