import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightRotationEventAttribute } from '../../../types/beatmap/wrapper/lightRotationEvent.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const lightRotationEvent: ISchemaContainer<
   IWrapLightRotationEventAttribute,
   ILightRotationEventContainer
> = {
   serialize(data: IWrapLightRotationEventAttribute): ILightRotationEventContainer {
      return {
         data: {
            p: data.previous,
            l: data.loop,
            e: data.easing,
            r: data.rotation,
            d: data.direction,
            customData: deepCopy(data.customData),
         },
         time: data.time,
      };
   },
   deserialize(
      data: DeepPartial<ILightRotationEventContainer> = {},
   ): Partial<IWrapLightRotationEventAttribute> {
      return {
         time: data.time,
         previous: data.data?.p,
         easing: data.data?.e,
         loop: data.data?.l,
         rotation: data.data?.r,
         direction: data.data?.d,
         customData: data.data?.customData,
      };
   },
};
