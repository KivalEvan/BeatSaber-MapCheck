import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEvent } from '../../../types/beatmap/v3/lightTranslationEvent.ts';
import type { IWrapLightTranslationEventAttribute } from '../../../types/beatmap/wrapper/lightTranslationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   p: 0,
   e: 0,
   t: 0,
   customData: {},
} as Required<ILightTranslationEvent>;
export const lightTranslationEvent: ISchemaContainer<
   IWrapLightTranslationEventAttribute,
   ILightTranslationEvent
> = {
   defaultValue,
   serialize(data: IWrapLightTranslationEventAttribute): ILightTranslationEvent {
      return {
         b: data.time,
         e: data.easing,
         p: data.previous,
         t: data.translation,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: Partial<ILightTranslationEvent> = {},
   ): Partial<IWrapLightTranslationEventAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         easing: data.e ?? defaultValue.e,
         previous: data.p ?? defaultValue.p,
         translation: data.t ?? defaultValue.t,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
