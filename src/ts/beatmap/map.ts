import {
    CustomData,
    CustomDataDifficulty,
    CustomDataEvent,
    CustomDataNote,
    CustomDataObstacle,
} from './customData';

export interface Note {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _type: number;
    _cutDirection: number;
    _customData?: CustomDataNote;
    [key: string]: any;
}

export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomDataObstacle;
    [key: string]: any;
}

export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _customData?: CustomDataEvent;
    [key: string]: any;
}

// TODO: figure the property waypoint contains
export interface Waypoint {
    [key: string]: any;
}

export interface BeatmapData {
    _version: string;
    _notes: Note[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints?: Waypoint[];
    _customData?: CustomDataDifficulty;
    _information?: CustomData;
}
