import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { lightRotationEventBox } from './lightRotationEventBox.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type { IEventBoxGroupContainer } from '../../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../../types/beatmap/shared/constants.ts';
import type { ILightRotationBoxContainer } from '../../../types/beatmap/container/v4.ts';

export const lightRotationEventBoxGroup: ISchemaContainer<
   IWrapLightRotationEventBoxGroupAttribute,
   IEventBoxGroupContainer<ILightRotationBoxContainer>
> = {
   serialize(
      data: IWrapLightRotationEventBoxGroupAttribute,
   ): IEventBoxGroupContainer<ILightRotationBoxContainer> {
      return {
         object: {
            t: EventBoxType.ROTATION,
            b: data.time,
            g: data.id,
            e: [],
            customData: deepCopy(data.customData),
         },
         boxData: data.boxes.map(lightRotationEventBox.serialize),
      };
   },
   deserialize(
      data: DeepPartial<IEventBoxGroupContainer<ILightRotationBoxContainer>> = {},
   ): DeepPartial<IWrapLightRotationEventBoxGroupAttribute> {
      return {
         time: data.object?.b,
         id: data.object?.g,
         boxes: data.boxData?.map(lightRotationEventBox.deserialize),
         customData: data.object?.customData,
      };
   },
};
