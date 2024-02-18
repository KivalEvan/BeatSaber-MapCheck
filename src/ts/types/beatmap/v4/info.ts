import { CharacteristicName } from '../shared/characteristic';
import { EnvironmentAllName } from '../shared/environment';
import { DifficultyName } from '../shared/difficulty';
import { IItem } from './item';

export interface IInfo extends IItem {
   version: '4.0.0';
   song: IInfoSong;
   audio: IInfoAudio;
   songPreviewFilename: string;
   coverImageFilename: string;
   environmentNames: EnvironmentAllName[];
   colorSchemes: IInfoColorScheme[];
   difficultyBeatmaps: IInfoDifficulty[];
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
   useOverride: boolean;
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
}
