import { deepCopy } from '../../../utils/misc.ts';
import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   _time: 0,
   _type: 0,
   _value: 0,
   _floatValue: 0,
   _customData: {},
} as Required<IEvent>;
export const basicEvent: ISchemaContainer<IWrapEventAttribute, IEvent> = {
   defaultValue,
   serialize(data: IWrapEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: data.type,
         _value: data.value,
         _floatValue: data.floatValue,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapEventAttribute> {
      return {
         time: data._time ?? defaultValue._time,
         type: data._type ?? defaultValue._type,
         value: data._value ?? defaultValue._value,
         floatValue: data._floatValue ?? defaultValue._floatValue,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
