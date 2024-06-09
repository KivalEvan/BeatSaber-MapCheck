import { BaseObject } from './abstract/baseObject.ts';
import type {
   IWrapRotationEvent,
   IWrapRotationEventAttribute,
} from '../../types/beatmap/wrapper/rotationEvent.ts';
import { deepCopy } from '../../utils/misc.ts';

export class RotationEvent extends BaseObject implements IWrapRotationEvent {
   static defaultValue: IWrapRotationEventAttribute = {
      time: 0,
      executionTime: 0,
      rotation: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapRotationEventAttribute>[]): RotationEvent[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapRotationEventAttribute> = {}) {
      super();
      this.time = data.time ?? RotationEvent.defaultValue.time;
      this.executionTime = data.executionTime ?? RotationEvent.defaultValue.executionTime;
      this.rotation = data.rotation ?? RotationEvent.defaultValue.rotation;
      this.customData = deepCopy(data.customData ?? RotationEvent.defaultValue.customData);
   }

   executionTime: IWrapRotationEvent['executionTime'] = 0;
   rotation: IWrapRotationEvent['rotation'] = 0;

   setExecutionTime(value: this['executionTime']): this {
      this.executionTime = value;
      return this;
   }
   setRotation(value: this['rotation']): this {
      this.rotation = value;
      return this;
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && (this.executionTime === 0 || this.executionTime === 1);
   }
}
