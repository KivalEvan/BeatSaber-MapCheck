import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';

const defaultValue = {
   _time: 0,
   _type: 100,
   _value: 0,
} as Required<IEvent>;
export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IEvent> = {
   defaultValue,
   serialize(data: IWrapBPMEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: 100,
         _value: Math.round(data.bpm),
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapBPMEventAttribute> {
      return {
         time: data._time ?? defaultValue._time,
         bpm: data._value ?? defaultValue._value,
      };
   },
};
