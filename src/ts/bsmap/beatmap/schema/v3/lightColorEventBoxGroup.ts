import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEventBoxGroup } from '../../../types/beatmap/v3/lightColorEventBoxGroup.ts';
import type { IWrapLightColorEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { lightColorEventBox } from './lightColorEventBox.ts';

export const lightColorEventBoxGroup: ISchemaContainer<
   IWrapLightColorEventBoxGroupAttribute,
   ILightColorEventBoxGroup
> = {
   serialize(data: IWrapLightColorEventBoxGroupAttribute): ILightColorEventBoxGroup {
      return {
         b: data.time,
         g: data.id,
         e: data.boxes.map(lightColorEventBox.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightColorEventBoxGroup> = {},
   ): DeepPartial<IWrapLightColorEventBoxGroupAttribute> {
      return {
         time: data.b,
         id: data.g,
         boxes: data.e?.map(lightColorEventBox.deserialize),
         customData: data.customData,
      };
   },
};
