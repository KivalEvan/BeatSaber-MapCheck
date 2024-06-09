import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEventBox } from '../../../types/beatmap/v3/lightRotationEventBox.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightRotationEvent } from './lightRotationEvent.ts';

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
} as Required<ILightRotationEventBox>;
export const lightRotationEventBox: ISchemaContainer<
   IWrapLightRotationEventBoxAttribute,
   ILightRotationEventBox
> = {
   defaultValue,
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
         filter: indexFilter.deserialize(data.f ?? defaultValue.f),
         beatDistribution: data.w ?? defaultValue.w,
         beatDistributionType: data.d ?? defaultValue.d,
         rotationDistribution: data.s ?? defaultValue.s,
         rotationDistributionType: data.t ?? defaultValue.t,
         axis: data.a ?? defaultValue.a,
         flip: data.r ?? defaultValue.r,
         affectFirst: data.b ?? defaultValue.b,
         easing: data.i ?? defaultValue.i,
         events: (data.l ?? defaultValue.l).map(lightRotationEvent.deserialize),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
