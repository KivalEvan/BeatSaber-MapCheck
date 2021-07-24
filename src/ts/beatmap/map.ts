import { CharacteristicName } from './characteristic';
import {
    CustomDataDifficulty,
    CustomDataEvent,
    CustomDataNote,
    CustomDataObstacle,
} from './customData';
import { DifficultyName } from './difficulty';
import { BeatmapInfoSetDifficulty } from './info';

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

// as far as i know, it does not have customData as of yet
export interface Waypoint {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _offsetDirection: number;
    [key: string]: any;
}

// yea i dont even know but it exist
export interface SpecialEventsKeywordFilters {
    _keywords: SpecialEventsKeywordFiltersKeywords[];
}

export interface SpecialEventsKeywordFiltersKeywords {
    _keyword: string;
    _specialEvents: number[];
}

export interface BeatmapData {
    _version: string;
    _notes: Note[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints?: Waypoint[];
    _specialEventsKeywordFilters?: SpecialEventsKeywordFilters;
    _customData?: CustomDataDifficulty;
}

export interface MapDataSet {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _info: BeatmapInfoSetDifficulty;
    _data: BeatmapData;
}
