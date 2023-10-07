import { BeatPerMinute } from '../../../beatmap/shared/bpm';
import { Difficulty } from '../../../beatmap/v3/difficulty';
import { CharacteristicName } from '../../beatmap/shared/characteristic';
import { DifficultyName } from '../../beatmap/shared/difficulty';
import { IWrapInfoDifficulty } from '../../beatmap/wrapper/info';
import { IDifficulty as IDifficultyV2 } from '../../beatmap/v2/difficulty';
import { IDifficulty as IDifficultyV3 } from '../../beatmap/v3/difficulty';
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

interface IBeatmapItemV2 extends IBeatmapItemBase {
   readonly rawVersion: 2;
   readonly rawData: IDifficultyV2;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
   readonly rawVersion: 3;
   readonly rawData: IDifficultyV3;
}

export type IBeatmapItem = IBeatmapItemV2 | IBeatmapItemV3;
