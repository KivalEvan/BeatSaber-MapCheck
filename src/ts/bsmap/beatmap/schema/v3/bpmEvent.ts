import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBPMEvent } from '../../../types/beatmap/v3/bpmEvent.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   m: 0,
   customData: {},
} as Required<IBPMEvent>;
export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IBPMEvent> = {
   defaultValue,
   serialize(data: IWrapBPMEventAttribute): IBPMEvent {
      return {
         b: data.time,
         m: data.bpm,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IBPMEvent> = {}): Partial<IWrapBPMEventAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         bpm: data.m ?? defaultValue.m,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
