import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWaypoint } from '../../../types/beatmap/v3/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const waypoint: ISchemaContainer<IWrapWaypointAttribute, IWaypoint> = {
   serialize(data: IWrapWaypointAttribute): IWaypoint {
      return {
         b: data.time,
         x: data.posX,
         y: data.posY,
         d: data.direction,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IWaypoint> = {}): Partial<IWrapWaypointAttribute> {
      return {
         time: data.b,
         posX: data.x,
         posY: data.y,
         direction: data.d,
         customData: data.customData,
      };
   },
};
