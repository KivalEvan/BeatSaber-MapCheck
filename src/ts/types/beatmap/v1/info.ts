import { LooseAutocomplete } from '../../utils';
import { EnvironmentV3Name } from '../shared/environment';
import { CharacteristicName } from '../shared/characteristic';
import { DifficultyName, DifficultyRank } from '../shared/difficulty';
import { EnvironmentName } from '../shared/environment';
import { ICustomInfo, ICustomInfoDifficulty } from './custom/info';

export type GenericJSONFileName = `${DifficultyName}${CharacteristicName | ''}.json`;

export interface IInfo extends ICustomInfo {
   songName: string;
   songSubName: string;
   authorName: string;
   beatsPerMinute: number;
   previewStartTime: number;
   previewDuration: number;
   coverImagePath: string;
   environmentName: EnvironmentName | EnvironmentV3Name;
   difficultyLevels: IInfoDifficulty[];
   oneSaber: boolean; // need confirmation
}

type DifficultyRankOld = 2 | 4 | 6 | 8 | 10;

export interface IInfoDifficulty extends ICustomInfoDifficulty {
   difficulty: DifficultyName;
   difficultyRank: DifficultyRankOld | DifficultyRank;
   audioPath: string;
   jsonPath: LooseAutocomplete<GenericJSONFileName>;
   characteristic: CharacteristicName;
}
