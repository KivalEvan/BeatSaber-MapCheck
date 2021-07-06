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
    _customData: CustomData;
}
export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _customData: CustomData;
}
export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData: CustomData;
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
    _customData: CustomData;
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
    _customData: CustomData;
}
export interface BeatmapData {
    _version: string;
    _notes: Note[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints?: Waypoint[];
    _customData: CustomData;
}
