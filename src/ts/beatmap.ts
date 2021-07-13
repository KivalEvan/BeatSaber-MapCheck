import globals from './globals';
import { BPMChange } from './bpm';

export type CharacteristicName =
    | 'Standard'
    | 'NoArrows'
    | 'OneSaber'
    | '360Degree'
    | '90Degree'
    | 'Lightshow'
    | 'Lawless';
// for ordering reason
export enum CharacteristicOrder {
    'Standard',
    'NoArrows',
    'OneSaber',
    '360Degree',
    '90Degree',
    'Lightshow',
    'Lawless',
}

export type DifficultyName = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'ExpertPlus';
export enum DifficultyRank {
    'Easy' = 1,
    'Normal' = 3,
    'Hard' = 5,
    'Expert' = 7,
    'ExpertPlus' = 9,
}

export interface CustomData {
    [key: string]: any;
}
export interface Note {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _type: number;
    _cutDirection: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Waypoint {
    [key: string]: any;
}

export interface MapInfo {
    _version: string;
    _songName: string;
    _songSubName: string;
    _songAuthorName: string;
    _levelAuthorName: string;
    _beatsPerMinute: number;
    _shuffle: number;
    _shufflePeriod: number;
    _previewStartTime: number;
    _previewDuration: number;
    _songFilename: string;
    _coverImageFilename: string;
    _environmentName: string;
    _allDirectionsEnvironmentName: string;
    _songTimeOffset: number;
    _customData?: CustomData;
    _difficultyBeatmapSets: BeatmapSets[];
}
export interface BeatmapSets {
    _beatmapCharacteristicName: CharacteristicName;
    _difficultyBeatmaps: Beatmap[];
}
export interface Beatmap {
    _difficulty: DifficultyName;
    _difficultyRank: DifficultyRank;
    _beatmapFilename: string;
    _noteJumpMovementSpeed: number;
    _noteJumpStartBeatOffset: number;
    _customData?: CustomData;
}
export interface BeatmapData {
    _version: string;
    _notes: Note[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints?: Waypoint[];
    _customData?: CustomData;
    _information?: CustomData;
}

export const parseMap = (
    difficultyData: BeatmapData,
    difficultyName: DifficultyName,
    bpm: number
): BeatmapData => {
    const { _notes, _obstacles, _events, _customData } = difficultyData;
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _notes object`
                );
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _obstacles object`
                );
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _events object`
                );
            }
        }
    });
    _notes.sort((a, b) => a._time - b._time);
    _obstacles.sort((a, b) => a._time - b._time);
    _events.sort((a, b) => a._time - b._time);

    if (_customData) {
        const BPMChanges: BPMChange[] = _customData._BPMChanges || _customData._bpmChanges;
        BPMChanges.forEach((bpmc) => (bpmc._BPM = bpmc._bpm ?? bpmc._BPM));
        if (BPMChanges && BPMChanges.length > 0) {
            let minBPM = bpm,
                maxBPM = bpm;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < minBPM) {
                    minBPM = BPMChanges[i]._BPM;
                }
                if (BPMChanges[i]._BPM > maxBPM) {
                    maxBPM = BPMChanges[i]._BPM;
                }
            }
            difficultyData._information = {
                minBPM: minBPM,
                maxBPM: maxBPM,
            };
        }
    }
    return difficultyData;
};
