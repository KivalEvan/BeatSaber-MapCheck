import { WrapBaseObject } from './baseObject.ts';
import type { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent.ts';

/** Boost event beatmap class object. */
export abstract class WrapColorBoostEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapColorBoostEvent<T>
{
   protected _toggle!: IWrapColorBoostEvent['toggle'];

   get toggle(): IWrapColorBoostEvent['toggle'] {
      return this._toggle;
   }
   set toggle(value: IWrapColorBoostEvent['toggle']) {
      this._toggle = value;
   }

   setToggle(value: boolean): this {
      this.toggle = value;
      return this;
   }

   isValid(): boolean {
      return true;
   }
}
