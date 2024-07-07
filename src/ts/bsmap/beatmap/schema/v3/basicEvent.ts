import type { IBasicEvent } from '../../../types/beatmap/v3/basicEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

export const basicEvent: ISchemaContainer<IWrapEventAttribute, IBasicEvent> = {
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
         time: data.b,
         type: data.et,
         value: data.i,
         floatValue: data.f,
         customData: data.customData,
      };
   },
};
