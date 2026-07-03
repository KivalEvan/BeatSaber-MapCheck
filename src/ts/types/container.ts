import { EnvironmentName, NoteJumpSpeed, TimeProcessor, v1, v2, v3, v4, wrapper } from 'bsmap';
import * as stats from 'bsmap/extensions/stats';
import * as swing from 'bsmap/extensions/swing';

export const enum ObjectContainerType {
   OBJECT = -1,
   COLOR,
   BOMB,
   ARC,
   CHAIN,
   LINK,
}

export interface IObjectContainerBase {
   readonly type: ObjectContainerType;
   readonly data: wrapper.IWrapBaseObject;
}

export interface IObjectContainerArc extends IObjectContainerBase {
   readonly type: ObjectContainerType.ARC;
   readonly data: wrapper.IWrapArc;
}

export interface IObjectContainerBomb extends IObjectContainerBase {
   readonly type: ObjectContainerType.BOMB;
   readonly data: wrapper.IWrapBombNote;
}

export interface IObjectContainerColor extends IObjectContainerBase {
   readonly type: ObjectContainerType.COLOR;
   readonly data: wrapper.IWrapColorNote;
}

export interface IObjectContainerChain extends IObjectContainerBase {
   readonly type: ObjectContainerType.CHAIN;
   readonly data: wrapper.IWrapChain;
}

export interface IObjectContainerLink extends IObjectContainerBase {
   readonly type: ObjectContainerType.LINK;
   readonly data: IChainLink;
}

export type IObjectContainer =
   | IObjectContainerColor
   | IObjectContainerBomb
   | IObjectContainerArc
   | IObjectContainerChain
   | IObjectContainerLink;

export interface IBeatmapAudio {
   readonly duration: number;
   readonly bpm: { time: number; bpm: number }[];
}

export interface IChainLink extends wrapper.IWrapBaseNote {
   chain: wrapper.IWrapChain;
}

interface IBeatmapContainerBase {
   readonly info: wrapper.IWrapInfoBeatmap;
   readonly environment: EnvironmentName;
   readonly timeProcessor: TimeProcessor;
   readonly njs: NoteJumpSpeed;
   readonly data: wrapper.IWrapBeatmap;
   readonly swingAnalysis: swing.ISwingAnalysis;
   readonly noteContainer: IObjectContainer[];
   readonly score: number;
   readonly stats: {
      readonly basicEvents: stats.ICountEvent;
      readonly lightColorEventBoxGroups: stats.ICountEventBoxGroup;
      readonly lightRotationEventBoxGroups: stats.ICountEventBoxGroup;
      readonly lightTranslationEventBoxGroups: stats.ICountEventBoxGroup;
      readonly fxEventBoxGroups: stats.ICountEventBoxGroup;
      readonly notes: stats.ICountNote;
      readonly bombs: stats.ICountStatsNote;
      readonly arcs: stats.ICountNote;
      readonly chains: stats.ICountNote;
      readonly obstacles: stats.IObstacleCount;
   };
}

interface IBeatmapContainerV1 extends IBeatmapContainerBase {
   readonly rawVersion: 1;
   readonly rawData: v1.IDifficulty;
}

interface IBeatmapContainerV2 extends IBeatmapContainerBase {
   readonly rawVersion: 2;
   readonly rawData: v2.IDifficulty;
}

interface IBeatmapContainerV3 extends IBeatmapContainerBase {
   readonly rawVersion: 3;
   readonly rawData: v3.IDifficulty;
}

interface IBeatmapContainerV4 extends IBeatmapContainerBase {
   readonly rawVersion: 4;
   readonly rawData: v4.IDifficulty;
   readonly rawLightshow: v4.ILightshow;
}

export type IBeatmapContainer =
   IBeatmapContainerV1 | IBeatmapContainerV2 | IBeatmapContainerV3 | IBeatmapContainerV4;
