import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightColorEvent } from './lightColorEvent.ts';

const defaultValue = {
   data: {
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      b: 0,
      e: 0,
      customData: {},
   },
   eventData: [],
   filterData: { ...indexFilter.defaultValue },
} as DeepRequiredIgnore<ILightColorBoxContainer, 'customData'>;
export const lightColorEventBox: ISchemaContainer<
   IWrapLightColorEventBoxAttribute,
   ILightColorBoxContainer
> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.filterData ?? defaultValue.filterData),
         beatDistribution: data.data?.w ?? defaultValue.data.w,
         beatDistributionType: data.data?.d ?? defaultValue.data.d,
         brightnessDistribution: data.data?.s ?? defaultValue.data.s,
         brightnessDistributionType: data.data?.t ?? defaultValue.data.t,
         affectFirst: data.data?.b ?? defaultValue.data.b,
         easing: data.data?.e ?? defaultValue.data.e,
         events: (data.eventData ?? defaultValue.eventData).map(lightColorEvent.deserialize),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
