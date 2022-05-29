import { IBaseObject } from './object';

/** Beatmap object interface for Waypoint. */
// as far as i know, it does not have customData as of yet
// what does this do anyway?
export interface IWaypoint extends IBaseObject {
    _lineIndex: number;
    _lineLayer: number;
    _offsetDirection: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;
}
