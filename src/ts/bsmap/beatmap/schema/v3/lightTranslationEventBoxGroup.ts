import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEventBoxGroup } from '../../../types/beatmap/v3/lightTranslationEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapLightTranslationEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import { lightTranslationEventBox } from './lightTranslationEventBox.ts';

export const lightTranslationEventBoxGroup: ISchemaContainer<
   IWrapLightTranslationEventBoxGroupAttribute,
   ILightTranslationEventBoxGroup
> = {
   serialize(data: IWrapLightTranslationEventBoxGroupAttribute): ILightTranslationEventBoxGroup {
      return {
         b: data.time,
         g: data.id,
         e: data.boxes.map(lightTranslationEventBox.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightTranslationEventBoxGroup> = {},
   ): DeepPartial<IWrapLightTranslationEventBoxGroupAttribute> {
      return {
         time: data.b,
         id: data.g,
         boxes: data.e?.map(lightTranslationEventBox.deserialize),
         customData: data.customData,
      };
   },
};
