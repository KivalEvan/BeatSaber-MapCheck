import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightTranslationEventBox } from '../../../types/beatmap/v3/lightTranslationEventBox.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightTranslationEvent } from './lightTranslationEvent.ts';

const defaultValue = {
   f: { ...indexFilter.defaultValue },
   w: 0,
   d: 1,
   s: 0,
   t: 1,
   a: 0,
   r: 0,
   b: 0,
   i: 0,
   l: [],
   customData: {},
} as Required<ILightTranslationEventBox>;
export const lightTranslationEventBox: ISchemaContainer<
   IWrapLightTranslationEventBoxAttribute,
   ILightTranslationEventBox
> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.f ?? defaultValue.f),
         beatDistribution: data.w ?? defaultValue.w,
         beatDistributionType: data.d ?? defaultValue.d,
         gapDistribution: data.s ?? defaultValue.s,
         gapDistributionType: data.t ?? defaultValue.t,
         axis: data.a ?? defaultValue.a,
         flip: data.r ?? defaultValue.r,
         affectFirst: data.b ?? defaultValue.b,
         easing: data.i ?? defaultValue.i,
         events: (data.l ?? defaultValue.l).map(lightTranslationEvent.deserialize),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
