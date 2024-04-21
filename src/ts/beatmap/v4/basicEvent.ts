// deno-lint-ignore-file no-unused-vars
import type { IBasicEvent } from '../../types/beatmap/v4/basicEvent.ts';
import type {
   IChromaEventLaser,
   IChromaEventLight,
   IChromaEventRing,
} from '../../types/beatmap/v3/custom/chroma.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import { WrapEvent } from '../wrapper/event.ts';
import type { IBasicEventContainer } from '../../types/beatmap/container/v4.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import type { IObject } from '../../types/beatmap/v4/object.ts';

/** Basic event beatmap v4 class object. */
export class BasicEvent extends WrapEvent<IBasicEventContainer> {
   static default: DeepRequiredIgnore<IBasicEventContainer, 'customData'> = {
      object: {
         b: 0,
         i: 0,
         customData: {},
      },
      data: {
         t: 0,
         i: 0,
         f: 0,
         customData: {},
      },
   };

   static create(...data: Partial<IWrapEventAttribute<IBasicEventContainer>>[]): BasicEvent[] {
      const result: BasicEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapEventAttribute<IBasicEvent>> = {}) {
      super();
      this._time = data.time ?? BasicEvent.default.object.b;
      this._type = data.type ?? BasicEvent.default.data.t;
      this._value = data.value ?? BasicEvent.default.data.i;
      this._floatValue = data.floatValue ?? BasicEvent.default.data.f;
      this._customData = deepCopy(data.customData ?? BasicEvent.default.data.customData);
   }

   static fromJSON(object: Partial<IObject> = {}, data: Partial<IBasicEvent> = {}): BasicEvent {
      const d = new this();
      d._time = object.b ?? BasicEvent.default.object.b;
      d._type = data.t ?? BasicEvent.default.data.t;
      d._value = data.i ?? BasicEvent.default.data.i;
      d._floatValue = data.f ?? BasicEvent.default.data.f;
      d._customData = deepCopy(data.customData ?? BasicEvent.default.data.customData);
      return d;
   }

   toJSON(): Required<IBasicEventContainer> {
      return {
         object: {
            b: this.time,
            i: 0,
            customData: {},
         },
         data: {
            t: this.type,
            i: this.value,
            f: this.floatValue,
            customData: deepCopy(this.customData),
         },
      };
   }

   get customData(): NonNullable<IBasicEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IBasicEvent['customData']>) {
      this._customData = value;
   }

   isLightEvent(environment?: EnvironmentAllName): this is BasicEventLight {
      return super.isLightEvent(environment);
   }

   isRingEvent(environment?: EnvironmentAllName): this is BasicEventRing {
      return super.isRingEvent(environment);
   }

   isLaserRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaser {
      return super.isLaserRotationEvent(environment);
   }

   isLaneRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaneRotation {
      return super.isLaneRotationEvent(environment);
   }

   isChroma(): boolean {
      const ev = this as BasicEvent;
      if (ev.isLightEvent()) {
         return (
            Array.isArray(this.customData.color) ||
            typeof this.customData.lightID === 'number' ||
            Array.isArray(this.customData.lightID) ||
            typeof this.customData.easing === 'string' ||
            typeof this.customData.lerpType === 'string'
         );
      }
      if (ev.isRingEvent()) {
         return (
            typeof this.customData.nameFilter === 'string' ||
            typeof this.customData.rotation === 'number' ||
            typeof this.customData.step === 'number' ||
            typeof this.customData.prop === 'number' ||
            typeof this.customData.speed === 'number' ||
            typeof this.customData.direction === 'number'
         );
      }
      if (ev.isLaserRotationEvent()) {
         return (
            typeof this.customData.lockRotation === 'boolean' ||
            typeof this.customData.speed === 'number' ||
            typeof this.customData.direction === 'number'
         );
      }
      return false;
   }
}

abstract class BasicEventLight extends BasicEvent {
   get customData(): IChromaEventLight {
      return this.customData as IChromaEventLight;
   }
}

abstract class BasicEventRing extends BasicEvent {
   get customData(): IChromaEventRing {
      return this.customData as IChromaEventRing;
   }
}

abstract class BasicEventLaser extends BasicEvent {
   get customData(): IChromaEventLaser {
      return this.customData as IChromaEventLaser;
   }
}

abstract class BasicEventLaneRotation extends BasicEvent {}
