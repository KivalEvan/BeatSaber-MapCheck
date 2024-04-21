import type { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent.ts';
import type { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapColorBoostEvent } from '../wrapper/colorBoostEvent.ts';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends WrapColorBoostEvent<IColorBoostEvent> {
   static default: Required<IColorBoostEvent> = {
      b: 0,
      o: false,
      customData: {},
   };

   static create(
      ...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]
   ): ColorBoostEvent[] {
      const result: ColorBoostEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>> = {}) {
      super();
      this._time = data.time ?? ColorBoostEvent.default.b;
      this._toggle = data.toggle ?? ColorBoostEvent.default.o;
      this._customData = deepCopy(data.customData ?? ColorBoostEvent.default.customData);
   }

   static fromJSON(data: Partial<IColorBoostEvent> = {}): ColorBoostEvent {
      const d = new this();
      d._time = data.b ?? ColorBoostEvent.default.b;
      d._toggle = data.o ?? ColorBoostEvent.default.o;
      d._customData = deepCopy(data.customData ?? ColorBoostEvent.default.customData);
      return d;
   }

   toJSON(): Required<IColorBoostEvent> {
      return {
         b: this.time,
         o: this.toggle,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IColorBoostEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IColorBoostEvent['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return true;
   }
}
