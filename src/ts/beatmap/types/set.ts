import { CharacteristicName } from './characteristic';
import { DifficultyData, DifficultyName } from './difficulty';
import { EnvironmentName } from './environment';
import { InfoSetDifficultyData } from './info';

export interface BeatmapSetData {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _info: InfoSetDifficultyData;
    _data: DifficultyData;
    _environment: EnvironmentName;
}
