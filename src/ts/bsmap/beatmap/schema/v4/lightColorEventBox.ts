import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightColorEvent } from './lightColorEvent.ts';

export const lightColorEventBox: ISchemaContainer<
   IWrapLightColorEventBoxAttribute,
   ILightColorBoxContainer
> = {
   serialize(data: IWrapLightColorEventBoxAttribute): ILightColorBoxContainer {
      return {
         data: {
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.brightnessDistribution,
            t: data.brightnessDistributionType,
            b: data.affectFirst,
            e: data.easing,
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(lightColorEvent.serialize),
         filterData: indexFilter.serialize(data.filter),
      };
   },
   deserialize(
      data: DeepPartial<ILightColorBoxContainer> = {},
   ): DeepPartial<IWrapLightColorEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.filterData),
         beatDistribution: data.data?.w,
         beatDistributionType: data.data?.d,
         brightnessDistribution: data.data?.s,
         brightnessDistributionType: data.data?.t,
         affectFirst: data.data?.b,
         easing: data.data?.e,
         events: data.eventData?.map(lightColorEvent.deserialize),
         customData: data.data?.customData,
      };
   },
};
