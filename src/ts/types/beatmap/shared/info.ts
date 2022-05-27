import { CharacteristicName } from './characteristic';
import { ICustomDataInfo, ICustomDataInfoDifficulty } from './customData';
import { DifficultyName, DifficultyRank } from './difficulty';
import { Environment360Name, EnvironmentName } from './environment';

/** Info interface for info file. */
export interface IInfoData {
    _version: `2.${0 | 2}.0`;
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
    _environmentName: EnvironmentName;
    _allDirectionsEnvironmentName: Environment360Name;
    _songTimeOffset: number;
    _customData?: ICustomDataInfo;
    _difficultyBeatmapSets: IInfoSetData[];
}
/** Info Set interface for info. */
export interface IInfoSetData {
    _beatmapCharacteristicName: CharacteristicName;
    _difficultyBeatmaps: IInfoSetDifficultyData[];
}
/** Info Set interface for info. */
export interface IInfoSetDifficultyData {
    _difficulty: DifficultyName;
    _difficultyRank: DifficultyRank;
    _beatmapFilename: string;
    _noteJumpMovementSpeed: number;
    _noteJumpStartBeatOffset: number;
    _customData?: ICustomDataInfoDifficulty;
}
