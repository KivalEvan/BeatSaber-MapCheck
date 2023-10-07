import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { deepCopy } from '../../utils/misc';
import { WrapWaypoint } from '../wrapper/waypoint';

/** Waypoint beatmap v3 class object. */
export class Waypoint extends WrapWaypoint<IWaypoint> {
   static default: Required<IWaypoint> = {
      b: 0,
      x: 0,
      y: 0,
      d: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapWaypointAttribute<IWaypoint>>);
   constructor(data: Partial<IWaypoint>);
   constructor(data: Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>);
   constructor(data: Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>> = {}) {
      super();

      this._time = data.b ?? data.time ?? Waypoint.default.b;
      this._posX = data.x ?? data.posX ?? Waypoint.default.x;
      this._posY = data.y ?? data.posY ?? Waypoint.default.y;
      this._direction = data.d ?? data.direction ?? Waypoint.default.d;
      this._customData = deepCopy(data.customData ?? Waypoint.default.customData);
   }

   static create(): Waypoint[];
   static create(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): Waypoint[];
   static create(...data: Partial<IWaypoint>[]): Waypoint[];
   static create(
      ...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]
   ): Waypoint[];
   static create(
      ...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]
   ): Waypoint[] {
      const result: Waypoint[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IWaypoint {
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
