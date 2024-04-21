import type { IRotationEvent } from '../../types/beatmap/v3/rotationEvent.ts';
import type { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapRotationEvent } from '../wrapper/rotationEvent.ts';

/** Rotation event beatmap v3 class object. */
export class RotationEvent extends WrapRotationEvent<IRotationEvent> {
   static default: Required<IRotationEvent> = {
      b: 0,
      e: 0,
      r: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapRotationEventAttribute<IRotationEvent>>[]): RotationEvent[] {
      const result: RotationEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapRotationEventAttribute<IRotationEvent>> = {}) {
      super();
      this._time = data.time ?? RotationEvent.default.b;
      this._executionTime = data.executionTime ?? RotationEvent.default.e;
      this._rotation = data.rotation ?? RotationEvent.default.r;
      this._customData = deepCopy(data.customData ?? RotationEvent.default.customData);
   }

   static fromJSON(data: Partial<IRotationEvent> = {}): RotationEvent {
      const d = new this();
      d._time = data.b ?? RotationEvent.default.b;
      d._executionTime = data.e ?? RotationEvent.default.e;
      d._rotation = data.r ?? RotationEvent.default.r;
      d._customData = deepCopy(data.customData ?? RotationEvent.default.customData);
      return d;
   }

   toJSON(): Required<IRotationEvent> {
      return {
         b: this.time,
         e: this.executionTime,
         r: this.rotation,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IRotationEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IRotationEvent['customData']>) {
      this._customData = value;
   }
}
