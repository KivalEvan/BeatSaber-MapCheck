import type { IWaypoint } from '../../types/beatmap/v3/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapWaypoint } from '../wrapper/waypoint.ts';

/** Waypoint beatmap v3 class object. */
export class Waypoint extends WrapWaypoint<IWaypoint> {
   static default: Required<IWaypoint> = {
      b: 0,
      x: 0,
      y: 0,
      d: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): Waypoint[] {
      const result: Waypoint[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapWaypointAttribute<IWaypoint>> = {}) {
      super();
      this._time = data.time ?? Waypoint.default.b;
      this._posX = data.posX ?? Waypoint.default.x;
      this._posY = data.posY ?? Waypoint.default.y;
      this._direction = data.direction ?? Waypoint.default.d;
      this._customData = deepCopy(data.customData ?? Waypoint.default.customData);
   }

   static fromJSON(data: Partial<IWaypoint> = {}): Waypoint {
      const d = new this();
      d._time = data.b ?? Waypoint.default.b;
      d._posX = data.x ?? Waypoint.default.x;
      d._posY = data.y ?? Waypoint.default.y;
      d._direction = data.d ?? Waypoint.default.d;
      d._customData = deepCopy(data.customData ?? Waypoint.default.customData);
      return d;
   }

   toJSON(): Required<IWaypoint> {
      return {
         b: this.time,
         x: this.posX,
         y: this.posY,
         d: this.direction,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IWaypoint['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IWaypoint['customData']>) {
      this._customData = value;
   }
}
