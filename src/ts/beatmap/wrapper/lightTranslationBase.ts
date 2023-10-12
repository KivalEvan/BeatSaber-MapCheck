import { IWrapLightTranslationBase } from '../../types/beatmap/wrapper/lightTranslationBase';
import { WrapBaseObject } from './baseObject';

/** Light translation base beatmap class object. */
export abstract class WrapLightTranslationBase<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapLightTranslationBase<T>
{
   protected _previous!: IWrapLightTranslationBase['previous'];
   protected _easing!: IWrapLightTranslationBase['easing'];
   protected _translation!: IWrapLightTranslationBase['translation'];

   get previous(): IWrapLightTranslationBase['previous'] {
      return this._previous;
   }
   set previous(value: IWrapLightTranslationBase['previous']) {
      this._previous = value;
   }
   get easing(): IWrapLightTranslationBase['easing'] {
      return this._easing;
   }
   set easing(value: IWrapLightTranslationBase['easing']) {
      this._easing = value;
   }
   get translation(): IWrapLightTranslationBase['translation'] {
      return this._translation;
   }
   set translation(value: IWrapLightTranslationBase['translation']) {
      this._translation = value;
   }

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
      return (this.previous === 0 || this.previous === 1) && this.easing >= -1 && this.easing <= 3;
   }
}
