// deno-lint-ignore-file no-explicit-any
import type { LooseAutocomplete } from '../../utils.ts';
import type { Version } from '../shared/version.ts';
import type { CharacteristicName } from '../shared/characteristic.ts';
import type { DifficultyName } from '../shared/difficulty.ts';
import type { EnvironmentAllName } from '../shared/environment.ts';
import type { GenericFilename, IFileInfo } from '../shared/filename.ts';
import type { IWrapBaseItem } from './baseItem.ts';
import type { IColor } from '../../colors.ts';

export interface IWrapInfoAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
   TDifficulty extends { [P in keyof TDifficulty]: TDifficulty[P] } = Record<string, any>,
> extends IWrapBaseItem<T>,
      IFileInfo {
   readonly version: Version;
   song: IWrapInfoSong;
   audio: IWrapInfoAudio;
   songPreviewFilename: string;
   coverImageFilename: string;
   environmentNames: EnvironmentAllName[];
   colorSchemes: IWrapInfoColorScheme[];
   difficulties: IWrapInfoDifficultyAttribute<TDifficulty>[];
}

export interface IWrapInfoSong {
   title: string;
   subTitle: string;
   author: string;
}

export interface IWrapInfoAudio {
   filename: string;
   duration: number; // float
   audioDataFilename: string;
   bpm: number; // float
   lufs: number; // float
   previewStartTime: number; // float
   previewDuration: number; // float
}

export interface IWrapInfoColorScheme {
   useOverride: boolean;
   name: string;
   saberLeftColor: Required<IColor>;
   saberRightColor: Required<IColor>;
   environment0Color: Required<IColor>;
   environment1Color: Required<IColor>;
   environmentWColor?: Required<IColor>;
   obstaclesColor: Required<IColor>;
   environment0ColorBoost: Required<IColor>;
   environment1ColorBoost: Required<IColor>;
   environmentWColorBoost?: Required<IColor>;
}

export interface IWrapInfoBeatmapAuthors {
   mappers: string[];
   lighters: string[];
}

export interface IWrapInfo<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
   TDifficulty extends { [P in keyof TDifficulty]: TDifficulty[P] } = Record<string, any>,
> extends IWrapBaseItem<T>,
      IWrapInfoAttribute<T, TDifficulty> {
   difficulties: IWrapInfoDifficulty<TDifficulty>[];
   setFilename(filename: LooseAutocomplete<GenericFilename>): this;

   /** Sort beatmap object(s) accordingly. */
   sort(): this;

   /** Show entries of map inside info. */
   addMap(data: Partial<IWrapInfoDifficultyAttribute>): this;
   listMap(): [CharacteristicName, IWrapInfoDifficulty][];
}

export interface IWrapInfoDifficultyAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseItem<T> {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename: LooseAutocomplete<GenericFilename>;
   authors: IWrapInfoBeatmapAuthors;
   njs: number;
   njsOffset: number;
   colorSchemeId: number;
   environmentId: number;
}

export interface IWrapInfoDifficulty<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapInfoDifficultyAttribute<T> {
   copyColorScheme(colorScheme: IWrapInfoColorScheme): this;
   copyColorScheme(id: number, info: IWrapInfo): this;
}
