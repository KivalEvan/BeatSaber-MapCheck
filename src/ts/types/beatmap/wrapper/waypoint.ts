// deno-lint-ignore-file no-explicit-any
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapWaypointAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObjectAttribute<T> {
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

export interface IWrapWaypoint<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObject<T>,
      IWrapWaypointAttribute<T> {
   setDirection(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9): this;
}
