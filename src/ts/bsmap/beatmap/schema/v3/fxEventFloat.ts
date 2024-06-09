import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventFloat } from '../../../types/beatmap/v3/fxEventFloat.ts';
import type { IWrapFxEventFloatAttribute } from '../../../types/beatmap/wrapper/fxEventFloat.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   i: 0,
   p: 0,
   v: 0,
   customData: {},
} as Required<IFxEventFloat>;
export const fxEventFloat: ISchemaContainer<IWrapFxEventFloatAttribute, IFxEventFloat> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         easing: data.i ?? defaultValue.i,
         previous: data.p ?? defaultValue.p,
         value: data.v ?? defaultValue.v,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
