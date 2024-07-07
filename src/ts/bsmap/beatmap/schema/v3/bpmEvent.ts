import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBPMEvent } from '../../../types/beatmap/v3/bpmEvent.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IBPMEvent> = {
   serialize(data: IWrapBPMEventAttribute): IBPMEvent {
      return {
         b: data.time,
         m: data.bpm,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IBPMEvent> = {}): Partial<IWrapBPMEventAttribute> {
      return {
         time: data.b,
         bpm: data.m,
         customData: data.customData,
      };
   },
};
