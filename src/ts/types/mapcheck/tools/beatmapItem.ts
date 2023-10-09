import { BeatPerMinute } from '../../../beatmap/shared/bpm';
import { Difficulty } from '../../../beatmap/v3/difficulty';
import { CharacteristicName } from '../../beatmap/shared/characteristic';
import { DifficultyName } from '../../beatmap/shared/difficulty';
import { IWrapInfoDifficulty } from '../../beatmap/wrapper/info';
import { IDifficulty as IV1Difficulty } from '../../beatmap/v1/difficulty';
import { IDifficulty as IV2Difficulty } from '../../beatmap/v2/difficulty';
import { IDifficulty as IV3Difficulty } from '../../beatmap/v3/difficulty';
import { EventContainer, NoteContainer } from '../../beatmap/wrapper/container';
import { ISwingAnalysis } from '../../../analyzers/swing/types/mod';

interface IBeatmapItemBase {
   readonly info: IWrapInfoDifficulty;
   readonly characteristic: CharacteristicName;
   readonly difficulty: DifficultyName;
   readonly bpm: BeatPerMinute;
   readonly data: Difficulty;
   readonly noteContainer: NoteContainer[];
   readonly eventContainer: EventContainer[];
   readonly swingAnalysis: ISwingAnalysis;
}

interface IBeatmapItemV1 extends IBeatmapItemBase {
   readonly rawVersion: 1;
   readonly rawData: IV1Difficulty;
}

interface IBeatmapItemV2 extends IBeatmapItemBase {
   readonly rawVersion: 2;
   readonly rawData: IV2Difficulty;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
   readonly rawVersion: 3;
   readonly rawData: IV3Difficulty;
}

export type IBeatmapItem = IBeatmapItemV1 | IBeatmapItemV2 | IBeatmapItemV3;
