import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloat } from '../../../types/beatmap/v3/fxEventFloat.ts';
import type { IWrapFxEventFloatAttribute } from '../../../types/beatmap/wrapper/fxEventFloat.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const fxEventFloat: ISchemaContainer<IWrapFxEventFloatAttribute, IFxEventFloat> = {
   serialize(data: IWrapFxEventFloatAttribute): IFxEventFloat {
      return {
         b: data.time,
         i: data.easing,
         p: data.previous,
         v: data.value,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IFxEventFloat> = {}): Partial<IWrapFxEventFloatAttribute> {
      return {
         time: data.b,
         easing: data.i,
         previous: data.p,
         value: data.v,
         customData: data.customData,
      };
   },
};
