import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventBox } from '../../../types/beatmap/v3/lightRotationEventBox.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightRotationEvent } from './lightRotationEvent.ts';

export const lightRotationEventBox: ISchemaContainer<
   IWrapLightRotationEventBoxAttribute,
   ILightRotationEventBox
> = {
   serialize(data: IWrapLightRotationEventBoxAttribute): ILightRotationEventBox {
      return {
         f: indexFilter.serialize(data.filter),
         w: data.beatDistribution,
         d: data.beatDistributionType,
         s: data.rotationDistribution,
         t: data.rotationDistributionType,
         a: data.axis,
         r: data.flip,
         b: data.affectFirst,
         i: data.easing,
         l: data.events.map(lightRotationEvent.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(
      data: DeepPartial<ILightRotationEventBox> = {},
   ): DeepPartial<IWrapLightRotationEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.f),
         beatDistribution: data.w,
         beatDistributionType: data.d,
         rotationDistribution: data.s,
         rotationDistributionType: data.t,
         axis: data.a,
         flip: data.r,
         affectFirst: data.b,
         easing: data.i,
         events: data.l?.map(lightRotationEvent.deserialize),
         customData: data.customData,
      };
   },
};
