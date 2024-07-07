import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventBoxGroup } from '../../../types/beatmap/v3/lightRotationEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { lightRotationEventBox } from './lightRotationEventBox.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';

export const lightRotationEventBoxGroup: ISchemaContainer<
   IWrapLightRotationEventBoxGroupAttribute,
   ILightRotationEventBoxGroup
> = {
   serialize(data: IWrapLightRotationEventBoxGroupAttribute): ILightRotationEventBoxGroup {
      return {
         b: data.time,
         g: data.id,
         e: data.boxes.map(lightRotationEventBox.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightRotationEventBoxGroup> = {},
   ): DeepPartial<IWrapLightRotationEventBoxGroupAttribute> {
      return {
         time: data.b,
         id: data.g,
         boxes: data.e?.map(lightRotationEventBox.deserialize),
         customData: data.customData,
      };
   },
};
