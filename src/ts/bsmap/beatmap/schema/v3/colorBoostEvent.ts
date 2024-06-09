import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IColorBoostEvent } from '../../../types/beatmap/v3/colorBoostEvent.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   o: false,
   customData: {},
} as Required<IColorBoostEvent>;
export const colorBoostEvent: ISchemaContainer<IWrapColorBoostEventAttribute, IColorBoostEvent> = {
   defaultValue,
   serialize(data: IWrapColorBoostEventAttribute): IColorBoostEvent {
      return {
         b: data.time,
         o: data.toggle,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IColorBoostEvent> = {}): Partial<IWrapColorBoostEventAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         toggle: data.o ?? defaultValue.o,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
