import type { IWrapLightTranslationEvent } from '../../types/beatmap/wrapper/lightTranslationEvent.ts';
import { WrapBaseObject } from './baseObject.ts';

/** Light translation base beatmap class object. */
export abstract class WrapLightTranslationEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapLightTranslationEvent<T>
{
   protected _previous!: IWrapLightTranslationEvent['previous'];
   protected _easing!: IWrapLightTranslationEvent['easing'];
   protected _translation!: IWrapLightTranslationEvent['translation'];

   get previous(): IWrapLightTranslationEvent['previous'] {
      return this._previous;
   }
   set previous(value: IWrapLightTranslationEvent['previous']) {
      this._previous = value;
   }
   get easing(): IWrapLightTranslationEvent['easing'] {
      return this._easing;
   }
   set easing(value: IWrapLightTranslationEvent['easing']) {
      this._easing = value;
   }
   get translation(): IWrapLightTranslationEvent['translation'] {
      return this._translation;
   }
   set translation(value: IWrapLightTranslationEvent['translation']) {
      this._translation = value;
   }

   setPrevious(value: IWrapLightTranslationEvent['previous']): this {
      this.previous = value;
      return this;
   }
   setEasing(value: IWrapLightTranslationEvent['easing']): this {
      this.easing = value;
      return this;
   }
   setTranslation(value: IWrapLightTranslationEvent['translation']): this {
      this.translation = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.previous === 0 || this.previous === 1) && this.easing >= -1 && this.easing <= 103
      );
   }
}
