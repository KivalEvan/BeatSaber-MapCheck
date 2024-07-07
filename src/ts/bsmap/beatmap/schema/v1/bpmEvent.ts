import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';

export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IEvent> = {
   serialize(data: IWrapBPMEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: 100,
         _value: Math.round(data.bpm),
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapBPMEventAttribute> {
      return {
         time: data._time,
         bpm: data._value,
      };
   },
};
