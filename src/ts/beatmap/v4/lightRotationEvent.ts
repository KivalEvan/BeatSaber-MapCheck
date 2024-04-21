import type { ILightRotationEventContainer } from '../../types/beatmap/container/v4.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v4/lightRotationEvent.ts';
import type { IWrapLightRotationEventAttribute } from '../../types/beatmap/wrapper/lightRotationEvent.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightRotationEvent } from '../wrapper/lightRotationEvent.ts';

/** Light rotation event beatmap v4 class object. */
export class LightRotationEvent extends WrapLightRotationEvent<ILightRotationEventContainer> {
   static default: DeepRequiredIgnore<ILightRotationEventContainer, 'customData'> = {
      data: {
         p: 0,
         e: 0,
         l: 0,
         r: 0,
         d: 0,
         customData: {},
      },
      time: 0,
   };

   static create(
      ...data: Partial<IWrapLightRotationEventAttribute<ILightRotationEventContainer>>[]
   ): LightRotationEvent[] {
      const result: LightRotationEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapLightRotationEventAttribute<ILightRotationEventContainer>> = {}) {
      super();
      this._time = data.time ?? LightRotationEvent.default.time;
      this._previous = data.previous ?? LightRotationEvent.default.data.p;
      this._easing = data.easing ?? LightRotationEvent.default.data.e;
      this._loop = data.loop ?? LightRotationEvent.default.data.l;
      this._rotation = data.rotation ?? LightRotationEvent.default.data.r;
      this._direction = data.direction ?? LightRotationEvent.default.data.d;
      this._customData = deepCopy(data.customData ?? LightRotationEvent.default.data.customData);
   }

   static fromJSON(data: Partial<ILightRotationEvent> = {}, time?: number): LightRotationEvent {
      const d = new this();
      d._time = time ?? LightRotationEvent.default.time;
      d._previous = data.p ?? LightRotationEvent.default.data.p;
      d._easing = data.e ?? LightRotationEvent.default.data.e;
      d._loop = data.l ?? LightRotationEvent.default.data.l;
      d._rotation = data.r ?? LightRotationEvent.default.data.r;
      d._direction = data.d ?? LightRotationEvent.default.data.d;
      d._customData = deepCopy(data.customData ?? LightRotationEvent.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightRotationEventContainer> {
      return {
         data: {
            p: this.previous,
            l: this.loop,
            e: this.easing,
            r: this.rotation,
            d: this.direction,
            customData: deepCopy(this.customData),
         },
         time: this.time,
      };
   }

   get customData(): NonNullable<ILightRotationEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationEvent['customData']>) {
      this._customData = value;
   }
}
