import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightTranslationEvent } from './lightTranslationEvent.ts';

export const lightTranslationEventBox: ISchemaContainer<
   IWrapLightTranslationEventBoxAttribute,
   ILightTranslationBoxContainer
> = {
   serialize(data: IWrapLightTranslationEventBoxAttribute): ILightTranslationBoxContainer {
      return {
         data: {
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.gapDistribution,
            t: data.gapDistributionType,
            b: data.affectFirst,
            e: data.easing,
            a: data.axis,
            f: data.flip,
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(lightTranslationEvent.serialize),
         filterData: indexFilter.serialize(data.filter),
      };
   },
   deserialize(
      data: DeepPartial<ILightTranslationBoxContainer> = {},
   ): DeepPartial<IWrapLightTranslationEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.filterData),
         beatDistribution: data.data?.w,
         beatDistributionType: data.data?.d,
         gapDistribution: data.data?.s,
         gapDistributionType: data.data?.t,
         affectFirst: data.data?.b,
         easing: data.data?.e,
         axis: data.data?.a,
         flip: data.data?.f,
         events: data.eventData?.map(lightTranslationEvent.deserialize),
         customData: data.data?.customData,
      };
   },
};
