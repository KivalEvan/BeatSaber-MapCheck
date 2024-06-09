import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEventBoxGroup } from '../../../types/beatmap/v3/lightColorEventBoxGroup.ts';
import type { IWrapLightColorEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { lightColorEventBox } from './lightColorEventBox.ts';

const defaultValue = {
   b: 0,
   g: 0,
   e: [],
   customData: {},
} as Required<ILightColorEventBoxGroup>;
export const lightColorEventBoxGroup: ISchemaContainer<
   IWrapLightColorEventBoxGroupAttribute,
   ILightColorEventBoxGroup
> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         id: data.g ?? defaultValue.g,
         boxes: (data.e ?? defaultValue.e).map(lightColorEventBox.deserialize),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
