import type { IFxEventInt } from '../../types/beatmap/v3/fxEventInt.ts';
import type { IWrapFxEventIntAttribute } from '../../types/beatmap/wrapper/fxEventInt.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapFxEventInt } from '../wrapper/fxEventInt.ts';

/** FX int base beatmap v3 class object. */
export class FxEventInt extends WrapFxEventInt<IFxEventInt> {
   static default: Required<IFxEventInt> = {
      b: 0,
      p: 0,
      v: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapFxEventIntAttribute<IFxEventInt>>[]): FxEventInt[] {
      const result: FxEventInt[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapFxEventIntAttribute<IFxEventInt>> = {}) {
      super();
      this._time = data.time ?? FxEventInt.default.b;
      this._previous = data.previous ?? FxEventInt.default.p;
      this._value = data.value ?? FxEventInt.default.v;
      this._customData = deepCopy(data.customData ?? FxEventInt.default.customData);
   }

   static fromJSON(data: Partial<IFxEventInt> = {}): FxEventInt {
      const d = new this();
      d._time = data.b ?? FxEventInt.default.b;
      d._previous = data.p ?? FxEventInt.default.p;
      d._value = data.v ?? FxEventInt.default.v;
      d._customData = deepCopy(data.customData ?? FxEventInt.default.customData);
      return d;
   }

   toJSON(): Required<IFxEventInt> {
      return {
         b: this.time,
         p: this.previous,
         v: this.value,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IFxEventInt['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventInt['customData']>) {
      this._customData = value;
   }
}
