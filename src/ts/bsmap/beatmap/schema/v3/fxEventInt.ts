import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IFxEventInt } from '../../../types/beatmap/v3/fxEventInt.ts';
import type { IWrapFxEventIntAttribute } from '../../../types/beatmap/wrapper/fxEventInt.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const fxEventInt: ISchemaContainer<IWrapFxEventIntAttribute, IFxEventInt> = {
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
         time: data.b,
         previous: data.p,
         value: data.v,
         customData: data.customData,
      };
   },
};
