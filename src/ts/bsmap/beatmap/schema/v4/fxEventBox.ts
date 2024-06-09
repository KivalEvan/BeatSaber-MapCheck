import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloatBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapFxEventBoxAttribute } from '../../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { fxEventFloat } from './fxEventFloat.ts';

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
} as DeepRequiredIgnore<IFxEventFloatBoxContainer, 'customData'>;
export const fxEventBox: ISchemaContainer<IWrapFxEventBoxAttribute, IFxEventFloatBoxContainer> = {
   defaultValue,
   serialize(data: IWrapFxEventBoxAttribute): IFxEventFloatBoxContainer {
      return {
         data: {
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.fxDistribution,
            t: data.fxDistributionType,
            b: data.affectFirst,
            e: data.easing,
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(fxEventFloat.serialize),
         filterData: indexFilter.serialize(data.filter),
      };
   },
   deserialize(
      data: DeepPartial<IFxEventFloatBoxContainer> = {},
   ): DeepPartial<IWrapFxEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.filterData ?? defaultValue.filterData),
         beatDistribution: data.data?.w ?? defaultValue.data.w,
         beatDistributionType: data.data?.d ?? defaultValue.data.d,
         fxDistribution: data.data?.s ?? defaultValue.data.s,
         fxDistributionType: data.data?.t ?? defaultValue.data.t,
         affectFirst: data.data?.b ?? defaultValue.data.b,
         easing: data.data?.e ?? defaultValue.data.e,
         events: (data.eventData ?? defaultValue.eventData).map(fxEventFloat.deserialize),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
