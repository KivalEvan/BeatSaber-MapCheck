import { BeatPerMinute } from '../../../beatmap';
import { Difficulty } from '../../../beatmap/v3';
import { CharacteristicName, DifficultyName, IInfoSetDifficulty } from '../../beatmap';
import { IDifficulty as IDifficultyV2 } from '../../beatmap/v2';
import { IDifficulty as IDifficultyV3 } from '../../beatmap/v3';
import { EventContainer, NoteContainer } from '../../beatmap/v3/container';
import { ISwingAnalysis } from '../analyzers/swing';

interface IBeatmapItemBase {
    readonly info: IInfoSetDifficulty;
    readonly characteristic: CharacteristicName;
    readonly difficulty: DifficultyName;
    readonly bpm: BeatPerMinute;
    readonly data: Difficulty;
    readonly noteContainer: NoteContainer[];
    readonly eventContainer: EventContainer[];
    readonly swingAnalysis: ISwingAnalysis;
}

interface IBeatmapItemV2 extends IBeatmapItemBase {
    readonly rawVersion: 2;
    readonly rawData: IDifficultyV2;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
    readonly rawVersion: 3;
    readonly rawData: IDifficultyV3;
}

export type IBeatmapItem = IBeatmapItemV2 | IBeatmapItemV3;
