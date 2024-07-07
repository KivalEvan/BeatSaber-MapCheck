import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloatBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapFxEventBoxAttribute } from '../../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { fxEventFloat } from './fxEventFloat.ts';

export const fxEventBox: ISchemaContainer<IWrapFxEventBoxAttribute, IFxEventFloatBoxContainer> = {
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
         filter: indexFilter.deserialize(data.filterData),
         beatDistribution: data.data?.w,
         beatDistributionType: data.data?.d,
         fxDistribution: data.data?.s,
         fxDistributionType: data.data?.t,
         affectFirst: data.data?.b,
         easing: data.data?.e,
         events: data.eventData?.map(fxEventFloat.deserialize),
         customData: data.data?.customData,
      };
   },
};
