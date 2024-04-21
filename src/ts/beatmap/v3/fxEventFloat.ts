import type { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat.ts';
import type { IWrapFxEventFloatAttribute } from '../../types/beatmap/wrapper/fxEventFloat.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapFxEventFloat } from '../wrapper/fxEventFloat.ts';

/** FX float base beatmap v3 class object. */
export class FxEventFloat extends WrapFxEventFloat<IFxEventFloat> {
   static default: Required<IFxEventFloat> = {
      b: 0,
      i: 0,
      p: 0,
      v: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>[]): FxEventFloat[] {
      const result: FxEventFloat[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapFxEventFloatAttribute<IFxEventFloat>> = {}) {
      super();
      this._time = data.time ?? FxEventFloat.default.b;
      this._easing = data.easing ?? FxEventFloat.default.i;
      this._previous = data.previous ?? FxEventFloat.default.p;
      this._value = data.value ?? FxEventFloat.default.v;
      this._customData = deepCopy(data.customData ?? FxEventFloat.default.customData);
   }

   static fromJSON(data: Partial<IFxEventFloat> = {}): FxEventFloat {
      const d = new this();
      d._time = data.b ?? FxEventFloat.default.b;
      d._easing = data.i ?? FxEventFloat.default.i;
      d._previous = data.p ?? FxEventFloat.default.p;
      d._value = data.v ?? FxEventFloat.default.v;
      d._customData = deepCopy(data.customData ?? FxEventFloat.default.customData);
      return d;
   }

   toJSON(): Required<IFxEventFloat> {
      return {
         b: this.time,
         i: this.easing,
         p: this.previous,
         v: this.value,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IFxEventFloat['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventFloat['customData']>) {
      this._customData = value;
   }
}
