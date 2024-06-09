import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapWaypointAttribute extends IWrapGridObjectAttribute {
   /**
    * Offset direction `<int>` of waypoint.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    */
   direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;
}

export interface IWrapWaypoint extends IWrapGridObject, IWrapWaypointAttribute {
   setDirection(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9): this;
}
