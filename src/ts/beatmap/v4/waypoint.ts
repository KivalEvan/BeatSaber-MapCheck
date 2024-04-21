import type { IWaypointContainer } from '../../types/beatmap/container/v4.ts';
import type { IObjectLane } from '../../types/beatmap/v4/object.ts';
import type { IWaypoint } from '../../types/beatmap/v4/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapWaypoint } from '../wrapper/waypoint.ts';

/** Waypoint beatmap v4 class object. */
export class Waypoint extends WrapWaypoint<IWaypointContainer> {
   static default: DeepRequiredIgnore<IWaypointContainer, 'customData'> = {
      object: {
         b: 0,
         i: 0,
         r: 0,
         customData: {},
      },
      data: {
         x: 0,
         y: 0,
         d: 0,
         customData: {},
      },
   };

   constructor(data: Partial<IWrapWaypointAttribute<IWaypointContainer>> = {}) {
      super();
      this._time = data.time ?? Waypoint.default.object.b;
      this._laneRotation = data.laneRotation ?? Waypoint.default.object.r;
      this._posX = data.posX ?? Waypoint.default.data.x;
      this._posY = data.posY ?? Waypoint.default.data.y;
      this._direction = data.direction ?? Waypoint.default.data.d;
      this._customData = deepCopy(data.customData ?? Waypoint.default.data.customData);
   }

   static create(...data: Partial<IWrapWaypointAttribute<IWaypointContainer>>[]): Waypoint[] {
      const result: Waypoint[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   static fromJSON(object: Partial<IObjectLane> = {}, data: Partial<IWaypoint> = {}): Waypoint {
      const d = new this();
      d._time = object.b ?? Waypoint.default.object.b;
      d._laneRotation = object.r ?? Waypoint.default.object.r;
      d._posX = data.x ?? Waypoint.default.data.x;
      d._posY = data.y ?? Waypoint.default.data.y;
      d._direction = data.d ?? Waypoint.default.data.d;
      d._customData = deepCopy(data.customData ?? Waypoint.default.data.customData);
      return d;
   }

   toJSON(): Required<IWaypointContainer> {
      return {
         object: {
            b: this.time,
            i: 0,
            r: this.laneRotation,
            customData: {},
         },
         data: {
            x: this.posX,
            y: this.posY,
            d: this.direction,
            customData: deepCopy(this.customData),
         },
      };
   }

   get customData(): NonNullable<IWaypoint['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IWaypoint['customData']>) {
      this._customData = value;
   }
}
