import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapFxEventBoxAttribute } from '../../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { fxEventFloat } from './fxEventFloat.ts';
import type { IFxEventFloatBoxContainer } from '../../../types/beatmap/container/v3.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';

const defaultValue = {
   data: {
      f: { ...indexFilter.defaultValue },
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      b: 0,
      i: 0,
      l: [],
      customData: {},
   },
   eventData: [],
} as DeepRequiredIgnore<IFxEventFloatBoxContainer, 'customData'>;
export const fxEventBox: ISchemaContainer<IWrapFxEventBoxAttribute, IFxEventFloatBoxContainer> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.data?.f ?? defaultValue.data.f),
         beatDistribution: data.data?.w ?? defaultValue.data.w,
         beatDistributionType: data.data?.d ?? defaultValue.data.d,
         fxDistribution: data.data?.s ?? defaultValue.data.s,
         fxDistributionType: data.data?.t ?? defaultValue.data.t,
         affectFirst: data.data?.b ?? defaultValue.data.b,
         easing: data.data?.i ?? defaultValue.data.i,
         events: (data.eventData ?? defaultValue.eventData).map(fxEventFloat.deserialize),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
