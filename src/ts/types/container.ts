import { NoteJumpSpeed, TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { stats, swing } from 'bsmap/extensions';

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
   readonly data: types.wrapper.IWrapBaseObject;
}

export interface IObjectContainerArc extends IObjectContainerBase {
   readonly type: ObjectContainerType.ARC;
   readonly data: types.wrapper.IWrapArc;
}

export interface IObjectContainerBomb extends IObjectContainerBase {
   readonly type: ObjectContainerType.BOMB;
   readonly data: types.wrapper.IWrapBombNote;
}

export interface IObjectContainerColor extends IObjectContainerBase {
   readonly type: ObjectContainerType.COLOR;
   readonly data: types.wrapper.IWrapColorNote;
}

export interface IObjectContainerChain extends IObjectContainerBase {
   readonly type: ObjectContainerType.CHAIN;
   readonly data: types.wrapper.IWrapChain;
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

export interface IChainLink extends types.wrapper.IWrapBaseNote {
   chain: types.wrapper.IWrapChain;
}

interface IBeatmapContainerBase {
   readonly info: types.wrapper.IWrapInfoBeatmap;
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

interface IBeatmapContainerV1 extends IBeatmapContainerBase {
   readonly rawVersion: 1;
   readonly rawData: types.v1.IDifficulty;
}

interface IBeatmapContainerV2 extends IBeatmapContainerBase {
   readonly rawVersion: 2;
   readonly rawData: types.v2.IDifficulty;
}

interface IBeatmapContainerV3 extends IBeatmapContainerBase {
   readonly rawVersion: 3;
   readonly rawData: types.v3.IDifficulty;
}

interface IBeatmapContainerV4 extends IBeatmapContainerBase {
   readonly rawVersion: 4;
   readonly rawData: types.v4.IDifficulty;
   readonly rawLightshow: types.v4.ILightshow;
}

export type IBeatmapContainer =
   | IBeatmapContainerV1
   | IBeatmapContainerV2
   | IBeatmapContainerV3
   | IBeatmapContainerV4;
