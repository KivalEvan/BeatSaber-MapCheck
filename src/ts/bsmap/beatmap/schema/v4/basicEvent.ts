import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { IBasicEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';

const defaultValue = {
   object: {
      b: 0,
      i: 0,
      customData: {},
   },
   data: {
      t: 0,
      i: 0,
      f: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IBasicEventContainer, 'customData'>;
export const basicEvent: ISchemaContainer<IWrapEventAttribute, IBasicEventContainer> = {
   defaultValue,
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
         time: data.object?.b ?? defaultValue.object.b,
         type: data.data?.t ?? defaultValue.data.t,
         value: data.data?.i ?? defaultValue.data.i,
         floatValue: data.data?.f ?? defaultValue.data.f,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
