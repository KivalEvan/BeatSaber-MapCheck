import type { IWrapFxEventInt } from '../../types/beatmap/wrapper/fxEventInt.ts';
import { WrapBaseObject } from './baseObject.ts';

/** FX int base beatmap class object. */
export abstract class WrapFxEventInt<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapFxEventInt<T>
{
   protected _previous!: IWrapFxEventInt['previous'];
   protected _value!: IWrapFxEventInt['value'];

   get previous(): IWrapFxEventInt['previous'] {
      return this._previous;
   }
   set previous(value: IWrapFxEventInt['previous']) {
      this._previous = value;
   }
   get value(): IWrapFxEventInt['value'] {
      return this._value;
   }
   set value(value: IWrapFxEventInt['value']) {
      this._value = value;
   }

   setPrevious(value: IWrapFxEventInt['previous']): this {
      this.previous = value;
      return this;
   }
   setValue(value: IWrapFxEventInt['value']): this {
      this.value = value;
      return this;
   }

   isValid(): boolean {
      return this.previous === 0 || this.previous === 1;
   }
}
