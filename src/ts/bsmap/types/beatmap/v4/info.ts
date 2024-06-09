import type { CharacteristicName } from '../shared/characteristic.ts';
import type { EnvironmentAllName } from '../shared/environment.ts';
import type { DifficultyName } from '../shared/difficulty.ts';
import type { IItem } from './item.ts';
import type { ICustomDataInfo } from './custom/info.ts';
import type { ICustomDataInfoBeatmap } from './custom/info.ts';

export interface IInfo extends IItem {
   version: '4.0.0';
   song: IInfoSong;
   audio: IInfoAudio;
   songPreviewFilename: string;
   coverImageFilename: string;
   environmentNames: EnvironmentAllName[];
   colorSchemes: IInfoColorScheme[];
   difficultyBeatmaps: IInfoDifficulty[];
   customData?: ICustomDataInfo;
}

export interface IInfoSong {
   title: string;
   subTitle: string;
   author: string;
}

export interface IInfoAudio {
   songFilename: string;
   songDuration: number; // float
   audioDataFilename: string;
   bpm: number; // float
   lufs: number; // float
   previewStartTime: number; // float
   previewDuration: number; // float
}

export interface IInfoColorScheme {
   colorSchemeName: string;
   saberAColor: string; // hex, all of them below
   saberBColor: string;
   obstaclesColor: string;
   environmentColor0: string;
   environmentColor1: string;
   environmentColorW?: string;
   environmentColor0Boost: string;
   environmentColor1Boost: string;
   environmentColorWBoost?: string;
}

export interface IInfoBeatmapAuthors {
   mappers: string[];
   lighters: string[];
}

export interface IInfoDifficulty extends IItem {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   beatmapAuthors: IInfoBeatmapAuthors;
   environmentNameIdx: number; // int
   beatmapColorSchemeIdx: number; // int
   noteJumpMovementSpeed: number; // float
   noteJumpStartBeatOffset: number; // float
   lightshowDataFilename: string;
   beatmapDataFilename: string;
   customData?: ICustomDataInfoBeatmap;
}
