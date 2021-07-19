import { CharacteristicName } from './characteristic';
import { DifficultyName } from './difficulty';
import { BeatmapSetDifficulty } from './info';
import { BeatmapData } from './map';

export interface MapData {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _info: BeatmapSetDifficulty;
    _data: BeatmapData;
}
