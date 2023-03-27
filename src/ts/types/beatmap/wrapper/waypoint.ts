import { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject';

export interface IWrapWaypointAttribute<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapGridObjectAttribute<T> {
    /** Offset direction `<int>` of waypoint.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;
}

export interface IWrapWaypoint<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapGridObject<T>,
        IWrapWaypointAttribute<T> {
    setDirection(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9): this;
}
