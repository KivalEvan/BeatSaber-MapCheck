import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapBasicEventAttribute } from '../../../types/beatmap/wrapper/basicEvent.ts';

export const basicEvent: ISchemaContainer<IWrapBasicEventAttribute, IEvent> = {
   serialize(data: IWrapBasicEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: data.type,
         _value: data.value,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapBasicEventAttribute> {
      return {
         time: data._time,
         type: data._type,
         value: data._value,
         floatValue: 1,
      };
   },
};
