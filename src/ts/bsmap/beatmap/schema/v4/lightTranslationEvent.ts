import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightTranslationEventAttribute } from '../../../types/beatmap/wrapper/lightTranslationEvent.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const lightTranslationEvent: ISchemaContainer<
   IWrapLightTranslationEventAttribute,
   ILightTranslationEventContainer
> = {
   serialize(data: IWrapLightTranslationEventAttribute): ILightTranslationEventContainer {
      return {
         data: {
            p: data.previous,
            e: data.easing,
            t: data.translation,
            customData: deepCopy(data.customData),
         },
         time: data.time,
      };
   },
   deserialize(
      data: DeepPartial<ILightTranslationEventContainer> = {},
   ): Partial<IWrapLightTranslationEventAttribute> {
      return {
         time: data.time,
         previous: data.data?.p,
         easing: data.data?.e,
         translation: data.data?.t,
         customData: data.data?.customData,
      };
   },
};
