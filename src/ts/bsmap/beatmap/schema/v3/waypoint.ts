import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWaypoint } from '../../../types/beatmap/v3/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   x: 0,
   y: 0,
   d: 0,
   customData: {},
} as Required<IWaypoint>;
export const waypoint: ISchemaContainer<IWrapWaypointAttribute, IWaypoint> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         posX: data.x ?? defaultValue.x,
         posY: data.y ?? defaultValue.y,
         direction: data.d ?? defaultValue.d,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
