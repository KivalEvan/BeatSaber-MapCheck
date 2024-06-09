import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IRotationEvent } from '../../../types/beatmap/v3/rotationEvent.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   e: 0,
   r: 0,
   customData: {},
} as Required<IRotationEvent>;
export const rotationEvent: ISchemaContainer<IWrapRotationEventAttribute, IRotationEvent> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         executionTime: data.e ?? defaultValue.e,
         rotation: data.r ?? defaultValue.r,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
