import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEventBox } from '../../../types/beatmap/v3/lightTranslationEventBox.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightTranslationEvent } from './lightTranslationEvent.ts';

export const lightTranslationEventBox: ISchemaContainer<
   IWrapLightTranslationEventBoxAttribute,
   ILightTranslationEventBox
> = {
   serialize(data: IWrapLightTranslationEventBoxAttribute): ILightTranslationEventBox {
      return {
         f: indexFilter.serialize(data.filter),
         w: data.beatDistribution,
         d: data.beatDistributionType,
         s: data.gapDistribution,
         t: data.gapDistributionType,
         a: data.axis,
         r: data.flip,
         b: data.affectFirst,
         i: data.easing,
         l: data.events.map(lightTranslationEvent.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightTranslationEventBox> = {},
   ): DeepPartial<IWrapLightTranslationEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.f),
         beatDistribution: data.w,
         beatDistributionType: data.d,
         gapDistribution: data.s,
         gapDistributionType: data.t,
         axis: data.a,
         flip: data.r,
         affectFirst: data.b,
         easing: data.i,
         events: data.l?.map(lightTranslationEvent.deserialize),
         customData: data.customData,
      };
   },
};
