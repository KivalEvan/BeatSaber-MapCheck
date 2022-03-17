import { DifficultyData } from '../../beatmap/v3';
import { CharacteristicName, DifficultyName, IInfoSetDifficultyData } from '../beatmap';
import { IDifficultyData as IDifficultyDataV2 } from '../beatmap/v2';
import { IDifficultyData as IDifficultyDataV3 } from '../beatmap/v3';

interface IBeatmapDataItemBase {
    info: IInfoSetDifficultyData;
    characteristic: CharacteristicName;
    difficulty: DifficultyName;
    data: DifficultyData;
}

interface IBeatmapDataItemV2 extends IBeatmapDataItemBase {
    rawVersion: 2;
    rawData: IDifficultyDataV2;
}

interface IBeatmapDataItemV3 extends IBeatmapDataItemBase {
    rawVersion: 3;
    rawData: IDifficultyDataV3;
}

export type IBeatmapDataItem = IBeatmapDataItemV2 | IBeatmapDataItemV3;
