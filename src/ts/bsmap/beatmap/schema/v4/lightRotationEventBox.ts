import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationBoxContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { indexFilter } from './indexFilter.ts';
import { lightRotationEvent } from './lightRotationEvent.ts';

const defaultValue = {
   data: {
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      b: 0,
      e: 0,
      f: 0,
      a: 0,
      customData: {},
   },
   eventData: [],
   filterData: { ...indexFilter.defaultValue },
} as DeepRequiredIgnore<ILightRotationBoxContainer, 'customData'>;
export const lightRotationEventBox: ISchemaContainer<
   IWrapLightRotationEventBoxAttribute,
   ILightRotationBoxContainer
> = {
   defaultValue,
   serialize(data: IWrapLightRotationEventBoxAttribute): ILightRotationBoxContainer {
      return {
         data: {
            w: data.beatDistribution,
            d: data.beatDistributionType,
            s: data.rotationDistribution,
            t: data.rotationDistributionType,
            b: data.affectFirst,
            e: data.easing,
            a: data.axis,
            f: data.flip,
            customData: deepCopy(data.customData),
         },
         eventData: data.events.map(lightRotationEvent.serialize),
         filterData: indexFilter.serialize(data.filter),
      };
   },
   deserialize(
      data: DeepPartial<ILightRotationBoxContainer> = {},
   ): DeepPartial<IWrapLightRotationEventBoxAttribute> {
      return {
         filter: indexFilter.deserialize(data.filterData ?? defaultValue.filterData),
         beatDistribution: data.data?.w ?? defaultValue.data.w,
         beatDistributionType: data.data?.d ?? defaultValue.data.d,
         rotationDistribution: data.data?.s ?? defaultValue.data.s,
         rotationDistributionType: data.data?.t ?? defaultValue.data.t,
         affectFirst: data.data?.b ?? defaultValue.data.b,
         easing: data.data?.e ?? defaultValue.data.e,
         axis: data.data?.a ?? defaultValue.data.a,
         flip: data.data?.f ?? defaultValue.data.f,
         events: (data.eventData ?? defaultValue.eventData).map(lightRotationEvent.deserialize),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
