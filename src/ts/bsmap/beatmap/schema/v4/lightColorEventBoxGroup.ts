import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { lightColorEventBox } from './lightColorEventBox.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapLightColorEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type { IEventBoxGroupContainer } from '../../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../../types/beatmap/shared/constants.ts';
import type { ILightColorBoxContainer } from '../../../types/beatmap/container/v4.ts';

export const lightColorEventBoxGroup: ISchemaContainer<
   IWrapLightColorEventBoxGroupAttribute,
   IEventBoxGroupContainer<ILightColorBoxContainer>
> = {
   serialize(
      data: IWrapLightColorEventBoxGroupAttribute,
   ): IEventBoxGroupContainer<ILightColorBoxContainer> {
      return {
         object: {
            t: EventBoxType.COLOR,
            b: data.time,
            g: data.id,
            e: [],
            customData: deepCopy(data.customData),
         },
         boxData: data.boxes.map(lightColorEventBox.serialize),
      };
   },
   deserialize(
      data: DeepPartial<IEventBoxGroupContainer<ILightColorBoxContainer>> = {},
   ): DeepPartial<IWrapLightColorEventBoxGroupAttribute> {
      return {
         time: data.object?.b,
         id: data.object?.g,
         boxes: data.boxData?.map(lightColorEventBox.deserialize),
         customData: data.object?.customData,
      };
   },
};
