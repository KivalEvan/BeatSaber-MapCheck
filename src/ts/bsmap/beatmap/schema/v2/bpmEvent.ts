import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';

export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IEvent> = {
   serialize(data: IWrapBPMEventAttribute): IEvent {
      return {
         _time: data.time,
         _type: 100,
         _value: 0,
         _floatValue: data.bpm,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapBPMEventAttribute> {
      return {
         time: data._time,
         bpm: data._floatValue ?? data._value,
         customData: data._customData,
      };
   },
};
