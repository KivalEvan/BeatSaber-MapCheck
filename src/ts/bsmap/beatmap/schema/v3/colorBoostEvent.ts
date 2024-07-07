import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IColorBoostEvent } from '../../../types/beatmap/v3/colorBoostEvent.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const colorBoostEvent: ISchemaContainer<IWrapColorBoostEventAttribute, IColorBoostEvent> = {
   serialize(data: IWrapColorBoostEventAttribute): IColorBoostEvent {
      return {
         b: data.time,
         o: data.toggle,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IColorBoostEvent> = {}): Partial<IWrapColorBoostEventAttribute> {
      return {
         time: data.b,
         toggle: data.o,
         customData: data.customData,
      };
   },
};
