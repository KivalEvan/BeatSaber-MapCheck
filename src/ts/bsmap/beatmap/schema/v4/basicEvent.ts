import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { IBasicEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const basicEvent: ISchemaContainer<IWrapEventAttribute, IBasicEventContainer> = {
   serialize(data: IWrapEventAttribute): IBasicEventContainer {
      return {
         object: {
            b: data.time,
            i: 0,
            customData: {},
         },
         data: {
            t: data.type,
            i: data.value,
            f: data.floatValue,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IBasicEventContainer> = {}): DeepPartial<IWrapEventAttribute> {
      return {
         time: data.object?.b,
         type: data.data?.t,
         value: data.data?.i,
         floatValue: data.data?.f,
         customData: data.data?.customData,
      };
   },
};
