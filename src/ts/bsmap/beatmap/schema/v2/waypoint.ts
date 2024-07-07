import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWaypoint } from '../../../types/beatmap/v2/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const waypoint: ISchemaContainer<IWrapWaypointAttribute, IWaypoint> = {
   serialize(data: IWrapWaypointAttribute): IWaypoint {
      return {
         _time: data.time,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _offsetDirection: data.direction,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IWaypoint> = {}): Partial<IWrapWaypointAttribute> {
      return {
         time: data._time,
         posX: data._lineIndex,
         posY: data._lineLayer,
         direction: data._offsetDirection,
         customData: data._customData,
      };
   },
};
