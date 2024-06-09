import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventInt } from '../../../types/beatmap/v3/fxEventInt.ts';
import type { IWrapFxEventIntAttribute } from '../../../types/beatmap/wrapper/fxEventInt.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   p: 0,
   v: 0,
   customData: {},
} as Required<IFxEventInt>;
export const fxEventInt: ISchemaContainer<IWrapFxEventIntAttribute, IFxEventInt> = {
   defaultValue,
   serialize(data: IWrapFxEventIntAttribute): IFxEventInt {
      return {
         b: data.time,
         p: data.previous,
         v: data.value,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IFxEventInt> = {}): Partial<IWrapFxEventIntAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         previous: data.p ?? defaultValue.p,
         value: data.v ?? defaultValue.v,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
