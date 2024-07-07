import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloatContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapFxEventFloatAttribute } from '../../../types/beatmap/wrapper/fxEventFloat.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const fxEventFloat: ISchemaContainer<IWrapFxEventFloatAttribute, IFxEventFloatContainer> = {
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
         time: data.time,
         previous: data.data?.p,
         easing: data.data?.e,
         value: data.data?.v,
         customData: data.data?.customData,
      };
   },
};
