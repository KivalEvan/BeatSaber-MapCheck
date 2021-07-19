import { CharacteristicName } from './characteristic';
import { CustomDataInfo, CustomDataInfoDifficulty } from './customData';
import { DifficultyName, DifficultyRank } from './difficulty';

export interface BeatmapInfo {
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
    _customData?: CustomDataInfo;
    _difficultyBeatmapSets: BeatmapSet[];
}
export interface BeatmapSet {
    _beatmapCharacteristicName: CharacteristicName;
    _difficultyBeatmaps: BeatmapSetDifficulty[];
}
export interface BeatmapSetDifficulty {
    _difficulty: DifficultyName;
    _difficultyRank: DifficultyRank;
    _beatmapFilename: string;
    _noteJumpMovementSpeed: number;
    _noteJumpStartBeatOffset: number;
    _customData?: CustomDataInfoDifficulty;
}
