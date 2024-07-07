import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IEvent } from '../../../types/beatmap/v1/event.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import { EventLaneRotationValue } from '../../shared/constants.ts';

export const rotationEvent: ISchemaContainer<IWrapRotationEventAttribute, IEvent> = {
   serialize(data: IWrapRotationEventAttribute): IEvent {
      let r = data.rotation % 360;
      if (r >= -60 && r <= 60 && r % 15 === 0 && r / 15 !== 0) {
         r /= 15;
      } else r += 1360;
      return {
         _time: data.time,
         _type: data.executionTime === 1 ? 15 : 14,
         _value: r,
      };
   },
   deserialize(data: Partial<IEvent> = {}): Partial<IWrapRotationEventAttribute> {
      const value = data._value ?? 0;
      return {
         time: data._time,
         executionTime: data._type === 15 ? 1 : 0,
         rotation: value >= 1000 ? (value - 1360) % 360 : EventLaneRotationValue[value] ?? 0,
      };
   },
};
