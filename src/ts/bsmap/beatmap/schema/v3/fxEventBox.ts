import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapFxEventBoxAttribute } from '../../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { fxEventFloat } from './fxEventFloat.ts';
import type { IFxEventFloatBoxContainer } from '../../../types/beatmap/container/v3.ts';

export const fxEventBox: ISchemaContainer<IWrapFxEventBoxAttribute, IFxEventFloatBoxContainer> = {
   serialize(data: IWrapFxEventBoxAttribute): IFxEventFloatBoxContainer {
      return {
         data: {
            f: indexFilter.serialize(data.filter),
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.fxDistribution,
            t: data.fxDistributionType,
            b: data.affectFirst,
            i: data.easing,
            l: [],
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(fxEventFloat.serialize),
      };
   },
   deserialize(
      data: DeepPartial<IFxEventFloatBoxContainer> = {},
   ): DeepPartial<IWrapFxEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.data?.f),
         beatDistribution: data.data?.w,
         beatDistributionType: data.data?.d,
         fxDistribution: data.data?.s,
         fxDistributionType: data.data?.t,
         affectFirst: data.data?.b,
         easing: data.data?.i,
         events: data.eventData?.map(fxEventFloat.deserialize),
         customData: data.data?.customData,
      };
   },
};
