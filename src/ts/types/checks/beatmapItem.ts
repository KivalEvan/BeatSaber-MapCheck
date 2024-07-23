import { NoteJumpSpeed, TimeProcessor, types } from 'bsmap';
import { IObjectContainer } from './container';
import { stats, swing } from 'bsmap/extensions';

export interface IBeatmapAudio {
   readonly duration: number;
   readonly bpm: { time: number; bpm: number }[];
}

interface IBeatmapItemBase {
   readonly settings: types.wrapper.IWrapInfoBeatmap;
   readonly environment: types.EnvironmentAllName;
   readonly timeProcessor: TimeProcessor;
   readonly njs: NoteJumpSpeed;
   readonly data: types.wrapper.IWrapBeatmap;
   readonly swingAnalysis: swing.types.ISwingAnalysis;
   readonly noteContainer: IObjectContainer[];
   readonly score: number;
   readonly stats: {
      readonly basicEvents: stats.types.ICountEvent;
      readonly lightColorEventBoxGroups: stats.types.ICountEventBoxGroup;
      readonly lightRotationEventBoxGroups: stats.types.ICountEventBoxGroup;
      readonly lightTranslationEventBoxGroups: stats.types.ICountEventBoxGroup;
      readonly fxEventBoxGroups: stats.types.ICountEventBoxGroup;
      readonly notes: stats.types.ICountNote;
      readonly bombs: stats.types.ICountStatsNote;
      readonly arcs: stats.types.ICountNote;
      readonly chains: stats.types.ICountNote;
      readonly obstacles: stats.types.IObstacleCount;
   };
}

interface IBeatmapItemV1 extends IBeatmapItemBase {
   readonly rawVersion: 1;
   readonly rawData: types.v1.IDifficulty;
}

interface IBeatmapItemV2 extends IBeatmapItemBase {
   readonly rawVersion: 2;
   readonly rawData: types.v2.IDifficulty;
}

interface IBeatmapItemV3 extends IBeatmapItemBase {
   readonly rawVersion: 3;
   readonly rawData: types.v3.IDifficulty;
}

interface IBeatmapItemV4 extends IBeatmapItemBase {
   readonly rawVersion: 4;
   readonly rawData: types.v4.IDifficulty;
   readonly rawLightshow: types.v4.ILightshow;
}

export type IBeatmapItem = IBeatmapItemV1 | IBeatmapItemV2 | IBeatmapItemV3 | IBeatmapItemV4;
