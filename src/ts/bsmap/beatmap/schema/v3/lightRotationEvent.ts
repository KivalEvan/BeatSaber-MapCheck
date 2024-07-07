import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightRotationEvent } from '../../../types/beatmap/v3/lightRotationEvent.ts';
import type { IWrapLightRotationEventAttribute } from '../../../types/beatmap/wrapper/lightRotationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const lightRotationEvent: ISchemaContainer<
   IWrapLightRotationEventAttribute,
   ILightRotationEvent
> = {
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
         time: data.b,
         easing: data.e,
         loop: data.l,
         direction: data.o,
         previous: data.p,
         rotation: data.r,
         customData: data.customData,
      };
   },
};
