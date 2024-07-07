import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEventBox } from '../../../types/beatmap/v3/lightColorEventBox.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightColorEvent } from './lightColorEvent.ts';

export const lightColorEventBox: ISchemaContainer<
   IWrapLightColorEventBoxAttribute,
   ILightColorEventBox
> = {
   serialize(data: IWrapLightColorEventBoxAttribute): ILightColorEventBox {
      return {
         f: indexFilter.serialize(data.filter),
         w: data.beatDistribution,
         d: data.beatDistributionType,
         r: data.brightnessDistribution,
         t: data.brightnessDistributionType,
         b: data.affectFirst,
         i: data.easing,
         e: data.events.map(lightColorEvent.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightColorEventBox> = {},
   ): DeepPartial<IWrapLightColorEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.f),
         beatDistribution: data.w,
         beatDistributionType: data.d,
         brightnessDistribution: data.r,
         brightnessDistributionType: data.t,
         affectFirst: data.b,
         easing: data.i,
         events: data.e?.map(lightColorEvent.deserialize),
         customData: data.customData,
      };
   },
};
