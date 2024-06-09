import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventBoxGroup } from '../../../types/beatmap/v3/lightRotationEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { lightRotationEventBox } from './lightRotationEventBox.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';

const defaultValue = {
   b: 0,
   g: 0,
   e: [],
   customData: {},
} as Required<ILightRotationEventBoxGroup>;
export const lightRotationEventBoxGroup: ISchemaContainer<
   IWrapLightRotationEventBoxGroupAttribute,
   ILightRotationEventBoxGroup
> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         id: data.g ?? defaultValue.g,
         boxes: (data.e ?? defaultValue.e).map(lightRotationEventBox.deserialize),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
