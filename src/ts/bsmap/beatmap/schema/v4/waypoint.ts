import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWaypointContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapWaypointAttribute } from '../../../types/beatmap/wrapper/waypoint.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const waypoint: ISchemaContainer<IWrapWaypointAttribute, IWaypointContainer> = {
   serialize(data: IWrapWaypointAttribute): Required<IWaypointContainer> {
      return {
         object: {
            b: data.time,
            i: 0,
            r: data.laneRotation,
            customData: {},
         },
         data: {
            x: data.posX,
            y: data.posY,
            d: data.direction,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IWaypointContainer> = {}): Partial<IWrapWaypointAttribute> {
      return {
         time: data.object?.b,
         laneRotation: data.object?.r,
         posX: data.data?.x,
         posY: data.data?.y,
         direction: data.data?.d,
         customData: data.data?.customData,
      };
   },
};
