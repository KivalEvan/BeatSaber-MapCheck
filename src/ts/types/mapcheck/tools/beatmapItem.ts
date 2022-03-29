import { DifficultyData } from '../../../beatmap/v3';
import {
    CharacteristicName,
    DifficultyName,
    IInfoSetDifficultyData,
    ISwingAnalysis,
} from '../../beatmap';
import { IDifficultyData as IDifficultyDataV2 } from '../../beatmap/v2';
import { IDifficultyData as IDifficultyDataV3 } from '../../beatmap/v3';
import { EventContainer, NoteContainer } from '../../beatmap/v3/container';

interface IBeatmapItemBase {
    info: IInfoSetDifficultyData;
    characteristic: CharacteristicName;
    difficulty: DifficultyName;
    data: DifficultyData;
    noteContainer: NoteContainer[];
    eventContainer: EventContainer[];
    swingAnalysis: ISwingAnalysis;
}

interface IBeatmapItemV2 extends IBeatmapItemBase {
    rawVersion: 2;
    rawData: IDifficultyDataV2;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
    rawVersion: 3;
    rawData: IDifficultyDataV3;
}

export type IBeatmapItem = IBeatmapItemV2 | IBeatmapItemV3;