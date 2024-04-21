import type { ILightRotationEvent } from '../../types/beatmap/v3/lightRotationEvent.ts';
import type { IWrapLightRotationEventAttribute } from '../../types/beatmap/wrapper/lightRotationEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightRotationEvent } from '../wrapper/lightRotationEvent.ts';

/** Light rotation base beatmap v3 class object. */
export class LightRotationBase extends WrapLightRotationEvent<ILightRotationEvent> {
   static default: Required<ILightRotationEvent> = {
      b: 0,
      p: 0,
      e: 0,
      l: 0,
      r: 0,
      o: 0,
      customData: {},
   };

   static create(
      ...data: Partial<IWrapLightRotationEventAttribute<ILightRotationEvent>>[]
   ): LightRotationBase[] {
      const result: LightRotationBase[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapLightRotationEventAttribute<ILightRotationEvent>> = {}) {
      super();
      this._time = data.time ?? LightRotationBase.default.b;
      this._easing = data.easing ?? LightRotationBase.default.e;
      this._loop = data.loop ?? LightRotationBase.default.l;
      this._direction = data.direction ?? LightRotationBase.default.o;
      this._previous = data.previous ?? LightRotationBase.default.p;
      this._rotation = data.rotation ?? LightRotationBase.default.r;
      this._customData = deepCopy(data.customData ?? LightRotationBase.default.customData);
   }

   static fromJSON(data: Partial<ILightRotationEvent> = {}): LightRotationBase {
      const d = new this();
      d._time = data.b ?? LightRotationBase.default.b;
      d._easing = data.e ?? LightRotationBase.default.e;
      d._loop = data.l ?? LightRotationBase.default.l;
      d._direction = data.o ?? LightRotationBase.default.o;
      d._previous = data.p ?? LightRotationBase.default.p;
      d._rotation = data.r ?? LightRotationBase.default.r;
      d._customData = deepCopy(data.customData ?? LightRotationBase.default.customData);
      return d;
   }

   toJSON(): Required<ILightRotationEvent> {
      return {
         b: this.time,
         e: this.easing,
         l: this.loop,
         o: this.direction,
         p: this.previous,
         r: this.rotation,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<ILightRotationEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationEvent['customData']>) {
      this._customData = value;
   }
}
