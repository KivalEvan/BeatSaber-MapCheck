import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightRotationEvent } from './lightRotationEvent.ts';

export const lightRotationEventBox: ISchemaContainer<
   IWrapLightRotationEventBoxAttribute,
   ILightRotationBoxContainer
> = {
   serialize(data: IWrapLightRotationEventBoxAttribute): ILightRotationBoxContainer {
      return {
         data: {
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.rotationDistribution,
            t: data.rotationDistributionType,
            b: data.affectFirst,
            e: data.easing,
            a: data.axis,
            f: data.flip,
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(lightRotationEvent.serialize),
         filterData: indexFilter.serialize(data.filter),
      };
   },
   deserialize(
      data: DeepPartial<ILightRotationBoxContainer> = {},
   ): DeepPartial<IWrapLightRotationEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.filterData),
         beatDistribution: data.data?.w,
         beatDistributionType: data.data?.d,
         rotationDistribution: data.data?.s,
         rotationDistributionType: data.data?.t,
         affectFirst: data.data?.b,
         easing: data.data?.e,
         axis: data.data?.a,
         flip: data.data?.f,
         events: data.eventData?.map(lightRotationEvent.deserialize),
         customData: data.data?.customData,
      };
   },
};
