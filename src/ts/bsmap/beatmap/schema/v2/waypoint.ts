import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWaypoint } from '../../../types/beatmap/v2/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   _time: 0,
   _lineIndex: 0,
   _lineLayer: 0,
   _offsetDirection: 0,
   _customData: {},
} as Required<IWaypoint>;
export const waypoint: ISchemaContainer<IWrapWaypointAttribute, IWaypoint> = {
   defaultValue,
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
         time: data._time ?? defaultValue._time,
         posX: data._lineIndex ?? defaultValue._lineIndex,
         posY: data._lineLayer ?? defaultValue._lineLayer,
         direction: data._offsetDirection ?? defaultValue._offsetDirection,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
