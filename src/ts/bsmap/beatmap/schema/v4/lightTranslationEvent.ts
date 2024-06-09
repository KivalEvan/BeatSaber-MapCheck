import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightTranslationEventAttribute } from '../../../types/beatmap/wrapper/lightTranslationEvent.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   data: { p: 0, e: 0, t: 0, customData: {} },
   time: 0,
} as DeepRequiredIgnore<ILightTranslationEventContainer, 'customData'>;
export const lightTranslationEvent: ISchemaContainer<
   IWrapLightTranslationEventAttribute,
   ILightTranslationEventContainer
> = {
   defaultValue,
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
         time: data.time ?? 0,
         previous: data.data?.p ?? defaultValue.data.p,
         easing: data.data?.e ?? defaultValue.data.e,
         translation: data.data?.t ?? defaultValue.data.t,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
