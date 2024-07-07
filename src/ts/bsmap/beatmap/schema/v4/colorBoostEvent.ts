import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IColorBoostEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const colorBoostEvent: ISchemaContainer<
   IWrapColorBoostEventAttribute,
   IColorBoostEventContainer
> = {
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
         time: data.object?.b,
         toggle: !!data.data?.b,
         customData: data.data?.customData,
      };
   },
};
