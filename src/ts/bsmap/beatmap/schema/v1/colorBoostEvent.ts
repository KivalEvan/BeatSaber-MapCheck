import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';

const defaultValue = {
   _time: 0,
   _type: 5,
   _value: 0,
} as Required<IEvent>;
export const colorBoostEvent: ISchemaContainer<IWrapColorBoostEventAttribute, IEvent> = {
   defaultValue,
   serialize(data: IWrapColorBoostEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: 5,
         _value: data.toggle ? 1 : 0,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapColorBoostEventAttribute> {
      return {
         time: data._time ?? defaultValue._time,
         toggle: (data._value ?? defaultValue._value) === 1,
      };
   },
};
