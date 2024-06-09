import type { IBasicEvent } from '../../../types/beatmap/v3/basicEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   b: 0,
   et: 0,
   i: 0,
   f: 0,
   customData: {},
} as Required<IBasicEvent>;
export const basicEvent: ISchemaContainer<IWrapEventAttribute, IBasicEvent> = {
   defaultValue,
   serialize(data: IWrapEventAttribute): IBasicEvent {
      return {
         b: data.time,
         et: data.type,
         i: data.value,
         f: data.floatValue,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IBasicEvent> = {}): Partial<IWrapEventAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         type: data.et ?? defaultValue.et,
         value: data.i ?? defaultValue.i,
         floatValue: data.f ?? defaultValue.f,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
