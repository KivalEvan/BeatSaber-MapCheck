import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';

export const basicEvent: ISchemaContainer<IWrapEventAttribute, IEvent> = {
   serialize(data: IWrapEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: data.type,
         _value: data.value,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapEventAttribute> {
      return {
         time: data._time,
         type: data._type,
         value: data._value,
         floatValue: 1,
      };
   },
};
