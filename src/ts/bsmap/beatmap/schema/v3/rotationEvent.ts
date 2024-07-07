import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IRotationEvent } from '../../../types/beatmap/v3/rotationEvent.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const rotationEvent: ISchemaContainer<IWrapRotationEventAttribute, IRotationEvent> = {
   serialize(data: IWrapRotationEventAttribute): IRotationEvent {
      return {
         b: data.time,
         e: data.executionTime,
         r: data.rotation,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IRotationEvent> = {}): Partial<IWrapRotationEventAttribute> {
      return {
         time: data.b,
         executionTime: data.e,
         rotation: data.r,
         customData: data.customData,
      };
   },
};
