import type { IGridObject } from './gridObject.ts';

export interface IWaypoint extends IGridObject {
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
   d?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;
}
