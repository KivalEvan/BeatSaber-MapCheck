import { IEvent } from '../../types/beatmap/v1/event';
import { WrapEvent } from '../wrapper/event';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import logger from '../../logger';

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

   constructor();
   constructor(data: Partial<IWrapEventAttribute<IEvent>>);
   constructor(data: Partial<IEvent>);
   constructor(data: Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>);
   constructor(data: Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>> = {}) {
      super();

      this._time = data._time ?? data.time ?? Event.default._time;
      this._type = data._type ?? data.type ?? Event.default._type;
      this._value = data._value ?? data.value ?? Event.default._value;
   }

   static create(): Event[];
   static create(...data: Partial<IWrapEventAttribute<IEvent>>[]): Event[];
   static create(...data: Partial<IEvent>[]): Event[];
   static create(...data: (Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>)[]): Event[];
   static create(...data: (Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>)[]): Event[] {
      const result: Event[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
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
