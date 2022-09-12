import { LooseAutocomplete } from '../../utils';
import { CharacteristicName } from './characteristic';
import { ICustomDataInfo, ICustomDataInfoDifficulty } from './customData';
import { DifficultyName, DifficultyRank } from './difficulty';
import { Environment360Name, EnvironmentName, EnvironmentV3Name } from './environment';

export type GenericFileName = `${DifficultyName}${CharacteristicName | ''}.dat`;

/** Info interface for info file. */
export interface IInfo {
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
    _environmentName: EnvironmentName | EnvironmentV3Name;
    _allDirectionsEnvironmentName: Environment360Name;
    _songTimeOffset: number;
    _customData?: ICustomDataInfo;
    _difficultyBeatmapSets: IInfoSet[];
}
/** Info Set interface for info. */
export interface IInfoSet {
    _beatmapCharacteristicName: CharacteristicName;
    _difficultyBeatmaps: IInfoSetDifficulty[];
}
/** Info Set interface for info. */
export interface IInfoSetDifficulty {
    _difficulty: DifficultyName;
    _difficultyRank: DifficultyRank;
    _beatmapFilename: LooseAutocomplete<GenericFileName>;
    _noteJumpMovementSpeed: number;
    _noteJumpStartBeatOffset: number;
    _customData?: ICustomDataInfoDifficulty;
}
