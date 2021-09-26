import { CharacteristicName } from './characteristic';
import { CustomDataDifficulty } from './customData';
import { DifficultyName } from './difficulty';
import { BeatmapInfoSetDifficulty } from './info';
import { Note } from './note';
import { isInteractive as obstacleInteractive, Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';

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

export interface BeatmapSetData {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _info: BeatmapInfoSetDifficulty;
    _data: BeatmapData;
}

export const findFirstInteractiveObstacleTime = (obstacles: Obstacle[]): number => {
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacleInteractive(obstacles[i])) {
            return obstacles[i]._time;
        }
    }
    return Number.MAX_VALUE;
};

export const findLastInteractiveObstacleTime = (obstacles: Obstacle[]): number => {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacleInteractive(obstacles[i])) {
            obstacleEnd = Math.max(obstacleEnd, obstacles[i]._time + obstacles[i]._duration);
        }
    }
    return obstacleEnd;
};

export const getFirstInteractiveTime = (mapData: BeatmapData): number => {
    const { _notes: notes, _obstacles: obstacles } = mapData;
    let firstNoteTime = Number.MAX_VALUE;
    if (notes.length > 0) {
        firstNoteTime = notes[0]._time;
    }
    const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(obstacles);
    return Math.min(firstNoteTime, firstInteractiveObstacleTime);
};

export const getLastInteractiveTime = (mapData: BeatmapData): number => {
    const { _notes: notes, _obstacles: obstacles } = mapData;
    let lastNoteTime = 0;
    if (notes.length > 0) {
        lastNoteTime = notes[notes.length - 1]._time;
    }
    const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(obstacles);
    return Math.max(lastNoteTime, lastInteractiveObstacleTime);
};
