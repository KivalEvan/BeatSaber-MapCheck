import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEvent } from '../../../types/beatmap/v3/lightRotationEvent.ts';
import type { IWrapLightRotationEventAttribute } from '../../../types/beatmap/wrapper/lightRotationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   p: 0,
   e: 0,
   l: 0,
   r: 0,
   o: 0,
   customData: {},
} as Required<ILightRotationEvent>;
export const lightRotationEvent: ISchemaContainer<
   IWrapLightRotationEventAttribute,
   ILightRotationEvent
> = {
   defaultValue,
   serialize(data: IWrapLightRotationEventAttribute): ILightRotationEvent {
      return {
         b: data.time,
         e: data.easing,
         l: data.loop,
         o: data.direction,
         p: data.previous,
         r: data.rotation,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<ILightRotationEvent> = {}): Partial<IWrapLightRotationEventAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         easing: data.e ?? defaultValue.e,
         loop: data.l ?? defaultValue.l,
         direction: data.o ?? defaultValue.o,
         previous: data.p ?? defaultValue.p,
         rotation: data.r ?? defaultValue.r,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
