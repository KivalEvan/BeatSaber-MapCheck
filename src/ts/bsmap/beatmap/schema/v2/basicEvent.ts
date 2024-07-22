import { deepCopy } from '../../../utils/misc.ts';
import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import type { IWrapBasicEventAttribute } from '../../../types/beatmap/wrapper/basicEvent.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

export const basicEvent: ISchemaContainer<IWrapBasicEventAttribute, IEvent> = {
   serialize(data: IWrapBasicEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: data.type,
         _value: data.value,
         _floatValue: data.floatValue,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapBasicEventAttribute> {
      return {
         time: data._time,
         type: data._type,
         value: data._value,
         floatValue: data._floatValue,
         customData: data._customData,
      };
   },
};
