import type { IFxEventFloatContainer } from '../../types/beatmap/container/v4.ts';
import type { IFxEventFloat } from '../../types/beatmap/v4/fxEventFloat.ts';
import type { IWrapFxEventFloatAttribute } from '../../types/beatmap/wrapper/fxEventFloat.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapFxEventFloat } from '../wrapper/fxEventFloat.ts';

/** FX float event beatmap v4 class object. */
export class FxEventFloat extends WrapFxEventFloat<IFxEventFloatContainer> {
   static default: DeepRequiredIgnore<IFxEventFloatContainer, 'customData'> = {
      data: {
         p: 0,
         e: 0,
         v: 0,
         customData: {},
      },
      time: 0,
   };

   static create(...data: Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>[]): FxEventFloat[] {
      const result: FxEventFloat[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapFxEventFloatAttribute<IFxEventFloatContainer>> = {}) {
      super();
      this._time = data.time ?? FxEventFloat.default.time;
      this._previous = data.previous ?? FxEventFloat.default.data.p;
      this._easing = data.easing ?? FxEventFloat.default.data.e;
      this._value = data.value ?? FxEventFloat.default.data.v;
      this._customData = deepCopy(data.customData ?? FxEventFloat.default.data.customData);
   }

   static fromJSON(data: Partial<IFxEventFloat> = {}, time?: number): FxEventFloat {
      const d = new this();
      d._time = time ?? FxEventFloat.default.time;
      d._previous = data.p ?? FxEventFloat.default.data.p;
      d._easing = data.e ?? FxEventFloat.default.data.e;
      d._value = data.v ?? FxEventFloat.default.data.v;
      d._customData = deepCopy(data.customData ?? FxEventFloat.default.data.customData);
      return d;
   }

   toJSON(): Required<IFxEventFloatContainer> {
      return {
         data: {
            p: this.previous,
            e: this.easing,
            v: this.value,
            customData: deepCopy(this.customData),
         },
         time: this.time,
      };
   }

   get customData(): NonNullable<IFxEventFloat['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventFloat['customData']>) {
      this._customData = value;
   }
}
