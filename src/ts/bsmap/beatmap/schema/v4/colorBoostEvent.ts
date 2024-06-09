import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IColorBoostEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   object: {
      b: 0,
      i: 0,
      customData: {},
   },
   data: {
      b: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IColorBoostEventContainer, 'customData'>;
export const colorBoostEvent: ISchemaContainer<
   IWrapColorBoostEventAttribute,
   IColorBoostEventContainer
> = {
   defaultValue,
   serialize(data: IWrapColorBoostEventAttribute): Required<IColorBoostEventContainer> {
      return {
         object: {
            b: data.time,
            i: 0,
            customData: {},
         },
         data: {
            b: data.toggle ? 1 : 0,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(
      data: Partial<IColorBoostEventContainer> = {},
   ): Partial<IWrapColorBoostEventAttribute> {
      return {
         time: data.object?.b ?? defaultValue.object.b,
         toggle: !!(data.data?.b ?? defaultValue.data.b),
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
