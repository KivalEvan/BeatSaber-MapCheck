import type { IWrapLightColorEvent } from '../../types/beatmap/wrapper/lightColorEvent.ts';
import { WrapBaseObject } from './baseObject.ts';

/** Light color base beatmap class object. */
export abstract class WrapLightColorEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapLightColorEvent<T>
{
   protected _previous!: IWrapLightColorEvent['previous'];
   protected _transition!: IWrapLightColorEvent['transition'];
   protected _color!: IWrapLightColorEvent['color'];
   protected _brightness!: IWrapLightColorEvent['brightness'];
   protected _frequency!: IWrapLightColorEvent['frequency'];
   protected _strobeBrightness!: IWrapLightColorEvent['strobeBrightness'];
   protected _strobeFade!: IWrapLightColorEvent['strobeFade'];
   protected _easing: IWrapLightColorEvent['easing'] = 0;

   get previous(): IWrapLightColorEvent['previous'] {
      return this._previous;
   }
   set previous(value: IWrapLightColorEvent['previous']) {
      this._previous = value;
   }
   get transition(): IWrapLightColorEvent['transition'] {
      return this._transition;
   }
   set transition(value: IWrapLightColorEvent['transition']) {
      this._transition = value;
   }
   get color(): IWrapLightColorEvent['color'] {
      return this._color;
   }
   set color(value: IWrapLightColorEvent['color']) {
      this._color = value;
   }
   get brightness(): IWrapLightColorEvent['brightness'] {
      return this._brightness;
   }
   set brightness(value: IWrapLightColorEvent['brightness']) {
      this._brightness = value;
   }
   get frequency(): IWrapLightColorEvent['frequency'] {
      return this._frequency;
   }
   set frequency(value: IWrapLightColorEvent['frequency']) {
      this._frequency = value;
   }
   get strobeBrightness(): IWrapLightColorEvent['strobeBrightness'] {
      return this._strobeBrightness;
   }
   set strobeBrightness(value: IWrapLightColorEvent['strobeBrightness']) {
      this._strobeBrightness = value;
   }
   get strobeFade(): IWrapLightColorEvent['strobeFade'] {
      return this._strobeFade;
   }
   set strobeFade(value: IWrapLightColorEvent['strobeFade']) {
      this._strobeFade = value;
   }
   get easing(): IWrapLightColorEvent['easing'] {
      return this._easing;
   }
   set easing(value: IWrapLightColorEvent['easing']) {
      this._easing = value;
   }

   setPrevious(value: IWrapLightColorEvent['previous']): this {
      this.previous = value;
      return this;
   }
   setTransition(value: IWrapLightColorEvent['transition']): this {
      this.transition = value;
      return this;
   }
   setColor(value: IWrapLightColorEvent['color']): this {
      this.color = value;
      return this;
   }
   setBrightness(value: IWrapLightColorEvent['brightness']): this {
      this.brightness = value;
      return this;
   }
   setFrequency(value: IWrapLightColorEvent['frequency']): this {
      this.frequency = value;
      return this;
   }
   setStrobeBrightness(value: IWrapLightColorEvent['strobeBrightness']): this {
      this.strobeBrightness = value;
      return this;
   }
   setStrobeFade(value: IWrapLightColorEvent['strobeFade']): this {
      this.strobeFade = value;
      return this;
   }
   setEasing(value: IWrapLightColorEvent['easing']): this {
      this.easing = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.previous === 0 || this.previous === 1) &&
         this.easing >= -1 &&
         this.easing <= 103 &&
         this.transition >= 0 &&
         this.transition <= 2 &&
         this.color >= -1 &&
         this.color <= 2 &&
         this.brightness >= 0 &&
         this.frequency >= 0
      );
   }
}
