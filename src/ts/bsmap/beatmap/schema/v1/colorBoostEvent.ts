import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';

export const colorBoostEvent: ISchemaContainer<IWrapColorBoostEventAttribute, IEvent> = {
   serialize(data: IWrapColorBoostEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: 5,
         _value: data.toggle ? 1 : 0,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapColorBoostEventAttribute> {
      return {
         time: data._time,
         toggle: data._value === 1,
      };
   },
};
