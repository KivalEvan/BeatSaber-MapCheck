import type { IEvent } from '../../types/beatmap/v1/event.ts';
import { WrapEvent } from '../wrapper/event.ts';
import type { IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import logger from '../../logger.ts';

function tag(name: string): string[] {
   return ['beatmap', 'v1', 'event', name];
}

/** Event beatmap v1 class object. */
export class Event extends WrapEvent<IEvent> {
   static default: Required<IEvent> = {
      _time: 0,
      _type: 0,
      _value: 0,
   };

   static create(...data: Partial<IWrapEventAttribute<IEvent>>[]): Event[] {
      const result: Event[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapEventAttribute<IEvent>> = {}) {
      super();
      this._time = data.time ?? Event.default._time;
      this._type = data.type ?? Event.default._type;
      this._value = data.value ?? Event.default._value;
   }

   static fromJSON(data: Partial<IEvent> = {}): Event {
      const d = new this();
      d._time = data._time ?? Event.default._time;
      d._type = data._type ?? Event.default._type;
      d._value = data._value ?? Event.default._value;
      return d;
   }

   toJSON(): Required<IEvent> {
      return {
         _time: this.time,
         _type: this.type,
         _value: this.value,
      };
   }

   get floatValue(): number {
      return 1;
   }
   set floatValue(_: number) {
      logger.tWarn(tag('floatValue'), 'Event float value does not exist in beatmap V1');
   }

   get customData(): Record<string, never> {
      return {};
   }
   set customData(_: Record<string, never>) {
      logger.tWarn(tag('customData'), 'Event custom data does not exist in beatmap V1');
   }

   isMappingExtensions(): boolean {
      return this.isLaneRotationEvent() && this.value >= 1000 && this.value <= 1720;
   }
}
