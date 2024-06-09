import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEventBox } from '../../../types/beatmap/v3/lightColorEventBox.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightColorEvent } from './lightColorEvent.ts';

const defaultValue = {
   f: { ...indexFilter.defaultValue },
   w: 0,
   d: 1,
   r: 0,
   t: 1,
   b: 0,
   i: 0,
   e: [],
   customData: {},
} as Required<ILightColorEventBox>;
export const lightColorEventBox: ISchemaContainer<
   IWrapLightColorEventBoxAttribute,
   ILightColorEventBox
> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.f ?? defaultValue.f),
         beatDistribution: data.w ?? defaultValue.w,
         beatDistributionType: data.d ?? defaultValue.d,
         brightnessDistribution: data.r ?? defaultValue.r,
         brightnessDistributionType: data.t ?? defaultValue.t,
         affectFirst: data.b ?? defaultValue.b,
         easing: data.i ?? defaultValue.i,
         events: (data.e ?? defaultValue.e).map(lightColorEvent.deserialize),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
