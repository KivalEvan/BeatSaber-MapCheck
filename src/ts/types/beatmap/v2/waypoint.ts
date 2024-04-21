import type { IBaseObject } from './object.ts';

/** Beatmap object interface for Waypoint. */
export interface IWaypoint extends IBaseObject {
   _lineIndex?: number;
   _lineLayer?: number;
   _offsetDirection?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;
}
