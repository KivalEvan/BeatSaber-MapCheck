import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';
import { IWrapFxEventFloatAttribute } from '../../types/beatmap/wrapper/fxEventFloat';
import { deepCopy } from '../../utils/misc';
import { WrapFxEventFloat } from '../wrapper/fxEventFloat';

/** FX float base beatmap v3 class object. */
export class FxEventFloat extends WrapFxEventFloat<IFxEventFloat> {
   static default: Required<IFxEventFloat> = {
      b: 0,
      i: 0,
      p: 0,
      v: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>);
   constructor(data: Partial<IFxEventFloat>);
   constructor(data: Partial<IFxEventFloat> & Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>);
   constructor(
      data: Partial<IFxEventFloat> & Partial<IWrapFxEventFloatAttribute<IFxEventFloat>> = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? FxEventFloat.default.b;
      this._easing = data.i ?? data.easing ?? FxEventFloat.default.i;
      this._previous = data.p ?? data.previous ?? FxEventFloat.default.p;
      this._value = data.v ?? data.value ?? FxEventFloat.default.v;
      this._customData = deepCopy(data.customData ?? FxEventFloat.default.customData);
   }

   static create(): FxEventFloat[];
   static create(...data: Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>[]): FxEventFloat[];
   static create(...data: Partial<IFxEventFloat>[]): FxEventFloat[];
   static create(
      ...data: (Partial<IFxEventFloat> & Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>)[]
   ): FxEventFloat[];
   static create(
      ...data: (Partial<IFxEventFloat> & Partial<IWrapFxEventFloatAttribute<IFxEventFloat>>)[]
   ): FxEventFloat[] {
      const result: FxEventFloat[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
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
