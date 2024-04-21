import type { IColorBoostEvent } from '../../types/beatmap/v4/colorBoostEvent.ts';
import type { IColorBoostEventContainer } from '../../types/beatmap/container/v4.ts';
import type { IObject } from '../../types/beatmap/v4/object.ts';
import type { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapColorBoostEvent } from '../wrapper/colorBoostEvent.ts';

/** Boost event beatmap v4 class object. */
export class ColorBoostEvent extends WrapColorBoostEvent<IColorBoostEventContainer> {
   static default: DeepRequiredIgnore<IColorBoostEventContainer, 'customData'> = {
      object: {
         b: 0,
         i: 0,
         customData: {},
      },
      data: {
         b: 0,
         customData: {},
      },
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

   constructor(data: Partial<IWrapColorBoostEventAttribute<IColorBoostEventContainer>> = {}) {
      super();
      this._time = data.time ?? ColorBoostEvent.default.object.b;
      this._toggle = !!(data.toggle ?? ColorBoostEvent.default.data.b);
      this._customData = deepCopy(data.customData ?? ColorBoostEvent.default.data.customData);
   }

   static fromJSON(
      object: Partial<IObject> = {},
      data: Partial<IColorBoostEvent> = {},
   ): ColorBoostEvent {
      const d = new this();
      d._time = object.b ?? ColorBoostEvent.default.object.b;
      d._toggle = !!(data.b ?? ColorBoostEvent.default.data.b);
      d._customData = deepCopy(data.customData ?? ColorBoostEvent.default.data.customData);
      return d;
   }

   toJSON(): Required<IColorBoostEventContainer> {
      return {
         object: {
            b: this.time,
            i: 0,
            customData: {},
         },
         data: {
            b: this.toggle ? 1 : 0,
            customData: deepCopy(this.customData),
         },
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
