import { CharacteristicName } from '../shared/characteristic';
import { DifficultyName, DifficultyRank } from '../shared/difficulty';
import { EnvironmentAllName } from '../shared/environment';
import { ICustomInfo, ICustomInfoDifficulty } from './custom/info';

export interface IInfo extends ICustomInfo {
    songName: string;
    songSubName: string;
    authorName: string;
    beatsPerMinute: number;
    previewStartTime: number;
    previewDuration: number;
    coverImagePath: string;
    environmentName: EnvironmentAllName;
    difficultyLevels: IInfoDifficulty[];
    oneSaber: boolean; // need confirmation
}

type DifficultyRankOld = 2 | 4 | 6 | 8 | 10;

export interface IInfoDifficulty extends ICustomInfoDifficulty {
    difficulty: DifficultyName;
    difficultyRank: DifficultyRankOld | DifficultyRank;
    audioPath: string;
    jsonPath: string;
    characteristic: CharacteristicName;
}
