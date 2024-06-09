import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloatContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapFxEventFloatAttribute } from '../../../types/beatmap/wrapper/fxEventFloat.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   data: {
      p: 0,
      e: 0,
      v: 0,
      customData: {},
   },
   time: 0,
} as DeepRequiredIgnore<IFxEventFloatContainer, 'customData'>;
export const fxEventFloat: ISchemaContainer<IWrapFxEventFloatAttribute, IFxEventFloatContainer> = {
   defaultValue,
   serialize(data: IWrapFxEventFloatAttribute): IFxEventFloatContainer {
      return {
         data: {
            p: data.previous,
            e: data.easing,
            v: data.value,
            customData: deepCopy(data.customData),
         },
         time: data.time,
      };
   },
   deserialize(
      data: DeepPartial<IFxEventFloatContainer> = {},
   ): Partial<IWrapFxEventFloatAttribute> {
      return {
         time: data.time ?? defaultValue.time,
         previous: data.data?.p ?? defaultValue.data.p,
         easing: data.data?.e ?? defaultValue.data.e,
         value: data.data?.v ?? defaultValue.data.v,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
