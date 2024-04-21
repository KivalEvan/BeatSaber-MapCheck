import type { IWrapFxEventFloat } from '../../types/beatmap/wrapper/fxEventFloat.ts';
import { WrapBaseObject } from './baseObject.ts';

/** FX float base beatmap class object. */
export abstract class WrapFxEventFloat<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapFxEventFloat<T>
{
   protected _easing!: IWrapFxEventFloat['easing'];
   protected _previous!: IWrapFxEventFloat['previous'];
   protected _value!: IWrapFxEventFloat['value'];

   get easing(): IWrapFxEventFloat['easing'] {
      return this._easing;
   }
   set easing(value: IWrapFxEventFloat['easing']) {
      this._easing = value;
   }
   get previous(): IWrapFxEventFloat['previous'] {
      return this._previous;
   }
   set previous(value: IWrapFxEventFloat['previous']) {
      this._previous = value;
   }
   get value(): IWrapFxEventFloat['value'] {
      return this._value;
   }
   set value(value: IWrapFxEventFloat['value']) {
      this._value = value;
   }

   setEasing(value: IWrapFxEventFloat['easing']): this {
      this.easing = value;
      return this;
   }
   setPrevious(value: IWrapFxEventFloat['previous']): this {
      this.previous = value;
      return this;
   }
   setValue(value: IWrapFxEventFloat['value']): this {
      this.value = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.previous === 0 || this.previous === 1) && this.easing >= -1 && this.easing <= 103
      );
   }
}
