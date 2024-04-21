import type { IWaypoint } from '../../types/beatmap/v2/waypoint.ts';
import type { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapWaypoint } from '../wrapper/waypoint.ts';

/** Waypoint beatmap v2 class object. */
export class Waypoint extends WrapWaypoint<IWaypoint> {
   static default: Required<IWaypoint> = {
      _time: 0,
      _lineIndex: 0,
      _lineLayer: 0,
      _offsetDirection: 0,
      _customData: {},
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
      this._time = data.time ?? Waypoint.default._time;
      this._posX = data.posX ?? Waypoint.default._lineIndex;
      this._posY = data.posY ?? Waypoint.default._lineLayer;
      this._direction = data.direction ?? Waypoint.default._offsetDirection;
      this._customData = deepCopy(data.customData ?? Waypoint.default._customData);
   }

   static fromJSON(data: Partial<IWaypoint> = {}): Waypoint {
      const d = new this();
      d._time = data._time ?? Waypoint.default._time;
      d._posX = data._lineIndex ?? Waypoint.default._lineIndex;
      d._posY = data._lineLayer ?? Waypoint.default._lineLayer;
      d._direction = data._offsetDirection ?? Waypoint.default._offsetDirection;
      d._customData = deepCopy(data._customData ?? Waypoint.default._customData);
      return d;
   }

   toJSON(): Required<IWaypoint> {
      return {
         _time: this.time,
         _lineIndex: this.posX,
         _lineLayer: this.posY,
         _offsetDirection: this.direction,
         _customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IWaypoint['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IWaypoint['_customData']>) {
      this._customData = value;
   }
}
