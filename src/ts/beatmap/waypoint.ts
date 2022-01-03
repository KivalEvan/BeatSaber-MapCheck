/**
 * Beatmap object interface for Waypoint.
 *
 *     _time: float,
 *     _lineIndex: int,
 *     _lineLayer: int,
 *     _offsetDirection: int,
 */
// as far as i know, it does not have customData as of yet
// what does this do anyway?
export interface Waypoint {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _offsetDirection: number;
}
