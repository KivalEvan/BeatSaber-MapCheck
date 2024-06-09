import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';

const defaultValue = {
   _time: 0,
   _type: 100,
   _value: 0,
   _floatValue: 0,
   _customData: {},
} as Required<IEvent>;
export const bpmEvent: ISchemaContainer<IWrapBPMEventAttribute, IEvent> = {
   defaultValue,
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
         time: data._time ?? defaultValue._time,
         bpm: data._floatValue ?? (data._value || defaultValue._floatValue),
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
