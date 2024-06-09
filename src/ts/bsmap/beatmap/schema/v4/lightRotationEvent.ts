import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightRotationEventAttribute } from '../../../types/beatmap/wrapper/lightRotationEvent.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   data: {
      p: 0,
      e: 0,
      l: 0,
      r: 0,
      d: 0,
      customData: {},
   },
   time: 0,
} as DeepRequiredIgnore<ILightRotationEventContainer, 'customData'>;
export const lightRotationEvent: ISchemaContainer<
   IWrapLightRotationEventAttribute,
   ILightRotationEventContainer
> = {
   defaultValue,
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
         time: data.time ?? defaultValue.time,
         previous: data.data?.p ?? defaultValue.data.p,
         easing: data.data?.e ?? defaultValue.data.e,
         loop: data.data?.l ?? defaultValue.data.l,
         rotation: data.data?.r ?? defaultValue.data.r,
         direction: data.data?.d ?? defaultValue.data.d,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
