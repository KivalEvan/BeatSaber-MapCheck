import type { ILightColorEventContainer } from '../../types/beatmap/container/v4.ts';
import type { ILightColorEvent } from '../../types/beatmap/v4/lightColorEvent.ts';
import type {
   IWrapLightColorEvent,
   IWrapLightColorEventAttribute,
} from '../../types/beatmap/wrapper/lightColorEvent.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightColorEvent } from '../wrapper/lightColorEvent.ts';

/** Light color event beatmap v4 class object. */
export class LightColorEvent extends WrapLightColorEvent<ILightColorEventContainer> {
   static default: DeepRequiredIgnore<ILightColorEventContainer, 'customData'> = {
      data: {
         p: 0,
         c: 0,
         e: 0,
         b: 0,
         f: 0,
         sb: 0,
         sf: 0,
         customData: {},
      },
      time: 0,
   };

   static create(
      ...data: Partial<IWrapLightColorEventAttribute<ILightColorEvent>>[]
   ): LightColorEvent[] {
      const result: LightColorEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapLightColorEventAttribute<ILightColorEventContainer>> = {}) {
      super();
      this._time = data.time ?? LightColorEvent.default.time;
      this._previous = data.previous ?? LightColorEvent.default.data.p;
      this._color = data.color ?? LightColorEvent.default.data.c;
      this._frequency = data.frequency ?? LightColorEvent.default.data.f;
      this.transition = data.transition ?? data.previous ?? 0;
      this._easing = data.easing ?? LightColorEvent.default.data.e;
      this._brightness = data.brightness ?? LightColorEvent.default.data.b;
      this._strobeBrightness = data.strobeBrightness ?? LightColorEvent.default.data.sb;
      this._strobeFade = data.strobeFade ?? LightColorEvent.default.data.sf;
      this._customData = deepCopy(data.customData ?? LightColorEvent.default.data.customData);
   }

   static fromJSON(data: Partial<ILightColorEvent> = {}, time?: number): LightColorEvent {
      const d = new this();
      d._time = time ?? LightColorEvent.default.time;
      d._previous = data.p ?? LightColorEvent.default.data.p;
      d._color = data.c ?? LightColorEvent.default.data.c;
      d._frequency = data.f ?? LightColorEvent.default.data.f;
      d._easing = data.e ?? LightColorEvent.default.data.e;
      d._brightness = data.b ?? LightColorEvent.default.data.b;
      d._strobeBrightness = data.sb ?? LightColorEvent.default.data.sb;
      d._strobeFade = data.sf ?? LightColorEvent.default.data.sf;
      d._customData = deepCopy(data.customData ?? LightColorEvent.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightColorEventContainer> {
      return {
         data: {
            p: this.previous,
            c: this.color,
            e: this.easing,
            b: this.brightness,
            f: this.frequency,
            sb: this.strobeBrightness,
            sf: this.strobeFade,
            customData: deepCopy(this.customData),
         },
         time: this.time,
      };
   }

   get transition(): IWrapLightColorEvent['transition'] {
      return this.previous ? 2 : this.easing === -1 ? 0 : 1;
   }
   set transition(value: IWrapLightColorEvent['transition']) {
      if (value === 0) this.easing = -1;
      if (value === 1) this.easing = 0;
      if (value === 2) this.previous = 1;
   }

   get customData(): NonNullable<ILightColorEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightColorEvent['customData']>) {
      this._customData = value;
   }
}
