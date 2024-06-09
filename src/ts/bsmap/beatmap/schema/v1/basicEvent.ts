import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';

const defaultValue = {
   _time: 0,
   _type: 0,
   _value: 0,
} as Required<IEvent>;
export const basicEvent: ISchemaContainer<IWrapEventAttribute, IEvent> = {
   defaultValue,
   serialize(data: IWrapEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: data.type,
         _value: data.value,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapEventAttribute> {
      return {
         time: data._time ?? defaultValue._time,
         type: data._type ?? defaultValue._type,
         value: data._value ?? defaultValue._value,
         floatValue: 1,
      };
   },
};
