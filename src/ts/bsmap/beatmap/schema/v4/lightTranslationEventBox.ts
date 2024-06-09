import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightTranslationEvent } from './lightTranslationEvent.ts';

const defaultValue = {
   data: {
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      b: 0,
      e: 0,
      f: 0,
      a: 0,
      customData: {},
   },
   eventData: [],
   filterData: { ...indexFilter.defaultValue },
} as DeepRequiredIgnore<ILightTranslationBoxContainer, 'customData'>;
export const lightTranslationEventBox: ISchemaContainer<
   IWrapLightTranslationEventBoxAttribute,
   ILightTranslationBoxContainer
> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.filterData ?? defaultValue.filterData),
         beatDistribution: data.data?.w ?? defaultValue.data.w,
         beatDistributionType: data.data?.d ?? defaultValue.data.d,
         gapDistribution: data.data?.s ?? defaultValue.data.s,
         gapDistributionType: data.data?.t ?? defaultValue.data.t,
         affectFirst: data.data?.b ?? defaultValue.data.b,
         easing: data.data?.e ?? defaultValue.data.e,
         axis: data.data?.a ?? defaultValue.data.a,
         flip: data.data?.f ?? defaultValue.data.f,
         events: (data.eventData ?? defaultValue.eventData).map(lightTranslationEvent.deserialize),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
