import { CharacteristicName } from './characteristic';
import { CustomDataInfo, CustomDataInfoDifficulty } from '../../v2/types/customData';
import { DifficultyName, DifficultyRank } from './difficulty';
import { Environment360Name, EnvironmentName } from './environment';

/** Info interface for info file.
 * ```ts
 * _version: string,
 * _songName: string,
 * _songSubName: string,
 * _songAuthorName: string,
 * _levelAuthorName: string,
 * _beatsPerMinute: float,
 * _shuffle: float,
 * _shufflePeriod: float,
 * _previewStartTime: float,
 * _previewDuration: float,
 * _songFilename: string,
 * _coverImageFilename: string,
 * _environmentName: EnvironmentName,
 * _allDirectionsEnvironmentName: EnvironmentName,
 * _songTimeOffset: float;
 * _customData?: CustomDataInfo;
 * _difficultyBeatmapSets: InfoSetData[];
 * ```
 */
export interface InfoData {
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
    _customData?: CustomDataInfo;
    _difficultyBeatmapSets: InfoSetData[];
}
/** Info Set interface for info.
 * ```ts
 * _beatmapCharacteristicName: CharacteristicName,
 * _difficultyBeatmaps: InfoSetDifficultyData[]
 * ```
 */
export interface InfoSetData {
    _beatmapCharacteristicName: CharacteristicName;
    _difficultyBeatmaps: InfoSetDifficultyData[];
}
/** Info Set interface for info.
 * ```ts
 * _difficulty: DifficultyName,
 * _difficultyRank: DifficultyRank,
 * _beatmapFilename: string,
 * _noteJumpMovementSpeed: float,
 * _noteJumpStartBeatOffset: float,
 * _customData?: CustomDataInfoDifficulty
 * ```
 */
export interface InfoSetDifficultyData {
    _difficulty: DifficultyName;
    _difficultyRank: DifficultyRank;
    _beatmapFilename: string;
    _noteJumpMovementSpeed: number;
    _noteJumpStartBeatOffset: number;
    _customData?: CustomDataInfoDifficulty;
}
