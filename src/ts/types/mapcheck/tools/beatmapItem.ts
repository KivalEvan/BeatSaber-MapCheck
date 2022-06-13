import { BeatPerMinute } from '../../../beatmap';
import { DifficultyData } from '../../../beatmap/v3';
import { CharacteristicName, DifficultyName, IInfoSetDifficultyData } from '../../beatmap';
import { IDifficultyData as IDifficultyDataV2 } from '../../beatmap/v2';
import { IDifficultyData as IDifficultyDataV3 } from '../../beatmap/v3';
import { EventContainer, NoteContainer } from '../../beatmap/v3/container';
import { ISwingAnalysis } from '../analyzers/swing';

interface IBeatmapItemBase {
    readonly info: IInfoSetDifficultyData;
    readonly characteristic: CharacteristicName;
    readonly difficulty: DifficultyName;
    readonly bpm: BeatPerMinute;
    readonly data: DifficultyData;
    readonly noteContainer: NoteContainer[];
    readonly eventContainer: EventContainer[];
    readonly swingAnalysis: ISwingAnalysis;
}

interface IBeatmapItemV2 extends IBeatmapItemBase {
    readonly rawVersion: 2;
    readonly rawData: IDifficultyDataV2;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
    readonly rawVersion: 3;
    readonly rawData: IDifficultyDataV3;
}

export type IBeatmapItem = IBeatmapItemV2 | IBeatmapItemV3;
