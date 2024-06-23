import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { CharacteristicName } from '../../bsmap/types/beatmap/shared/characteristic';
import { DifficultyName } from '../../bsmap/types/beatmap/shared/difficulty';
import { IWrapInfoBeatmap } from '../../bsmap/types/beatmap/wrapper/info';
import { IDifficulty as IV1Difficulty } from '../../bsmap/types/beatmap/v1/difficulty';
import { IDifficulty as IV2Difficulty } from '../../bsmap/types/beatmap/v2/difficulty';
import { IDifficulty as IV3Difficulty } from '../../bsmap/types/beatmap/v3/difficulty';
import { IDifficulty as IV4Difficulty } from '../../bsmap/types/beatmap/v4/difficulty';
import { ILightshow as IV4Lightshow } from '../../bsmap/types/beatmap/v4/lightshow';
import { ISwingAnalysis } from '../../bsmap/extensions/swing/types/mod';
import { EnvironmentAllName } from '../../bsmap/types/beatmap/shared/environment';
import { IWrapBeatmap } from '../../bsmap/types/beatmap/wrapper/beatmap';
import { IObjectContainer } from './container';
import { NoteJumpSpeed } from '../../bsmap/beatmap/helpers/njs';

export interface IBeatmapAudio {
   readonly duration: number;
   readonly bpm: { time: number; bpm: number }[];
}

interface IBeatmapItemBase {
   readonly settings: IWrapInfoBeatmap;
   readonly environment: EnvironmentAllName;
   readonly timeProcessor: TimeProcessor;
   readonly njs: NoteJumpSpeed;
   readonly data: IWrapBeatmap;
   readonly swingAnalysis: ISwingAnalysis;
   readonly noteContainer: IObjectContainer[];
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

interface IBeatmapItemV4 extends IBeatmapItemBase {
   readonly rawVersion: 4;
   readonly rawData: IV4Difficulty;
   readonly rawLightshow: IV4Lightshow;
}

export type IBeatmapItem = IBeatmapItemV1 | IBeatmapItemV2 | IBeatmapItemV3 | IBeatmapItemV4;
