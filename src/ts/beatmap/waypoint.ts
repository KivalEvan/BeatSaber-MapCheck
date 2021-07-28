// as far as i know, it does not have customData as of yet
export interface Waypoint {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _offsetDirection: number;
    [key: string]: number;
}
