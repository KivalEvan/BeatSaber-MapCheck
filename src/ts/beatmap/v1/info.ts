import logger from '../../logger.ts';
import type {
   Environment360Name,
   EnvironmentName,
} from '../../types/beatmap/shared/environment.ts';
import type { IInfo, IInfoDifficulty } from '../../types/beatmap/v1/info.ts';
import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';
import type { EnvironmentV3Name } from '../../types/beatmap/shared/environment.ts';
import { WrapInfo, WrapInfoDifficulty } from '../wrapper/info.ts';
import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import type { DeepPartial, LooseAutocomplete } from '../../types/utils.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import type { IColor } from '../../types/colors.ts';
import type { IContributor } from '../../types/beatmap/shared/custom/contributor.ts';
import { deepCopy, shallowCopy } from '../../utils/misc.ts';
import type {
   IWrapInfo,
   IWrapInfoAttribute,
   IWrapInfoAudio,
   IWrapInfoColorScheme,
   IWrapInfoDifficultyAttribute,
   IWrapInfoSong,
} from '../../types/beatmap/wrapper/info.ts';

function tag(name: string): string[] {
   return ['beatmap', 'v1', 'info', name];
}

export interface IV1ExtraInfo {
   environmentName: EnvironmentName | EnvironmentV3Name;
   difficulties: InfoDifficulty[];
   oneSaber: boolean;
   contributors: IContributor[];
   customEnvironment?: string;
   customEnvironmentHash?: string;
}

/** Difficulty beatmap class object. */
export class Info extends WrapInfo<IInfo, IInfoDifficulty> {
   static default: Required<IInfo> = {
      songName: 'Untitled',
      songSubName: '',
      authorName: 'NoAuthor',
      beatsPerMinute: 120,
      previewStartTime: 0,
      previewDuration: 0,
      coverImagePath: 'cover.jpg',
      environmentName: 'DefaultEnvironment',
      difficultyLevels: [],
      oneSaber: false,
      contributors: [],
      customEnvironment: '',
      customEnvironmentHash: '',
   };

   readonly version = '1.0.0';

   contentChecksum = '';
   song: IWrapInfoSong = {
      title: '',
      subTitle: '',
      author: '',
   };
   audio: IWrapInfoAudio = {
      filename: '',
      duration: 0,
      audioDataFilename: '',
      bpm: 0,
      lufs: 0,
      previewStartTime: 0,
      previewDuration: 0,
   };
   songPreviewFilename = '';

   get songName(): string {
      return this.song.title;
   }
   set songName(value: string) {
      this.song.title = value;
   }
   get songSubName(): string {
      return this.song.subTitle;
   }
   set songSubName(value: string) {
      this.song.subTitle = value;
   }
   get songAuthorName(): string {
      return this.song.author;
   }
   set songAuthorName(value: string) {
      this.song.author = value;
   }

   get songFilename(): string {
      return this.audio.filename;
   }
   set songFilename(value: string) {
      this.audio.filename = value;
   }
   get beatsPerMinute(): number {
      return this.audio.bpm;
   }
   set beatsPerMinute(value: number) {
      this.audio.bpm = value;
   }
   get previewStartTime(): number {
      return this.audio.previewStartTime;
   }
   set previewStartTime(value: number) {
      this.audio.previewStartTime = value;
   }
   get previewDuration(): number {
      return this.audio.previewDuration;
   }
   set previewDuration(value: number) {
      this.audio.previewDuration = value;
   }

   coverImageFilename: string;

   songTimeOffset = 0;
   shuffle = 0;
   shufflePeriod = 0.5;
   environmentName: EnvironmentName | EnvironmentV3Name;
   allDirectionsEnvironmentName: Environment360Name = 'GlassDesertEnvironment';
   difficulties: InfoDifficulty[];
   environmentNames: never[] = [];
   colorSchemes: never[] = [];
   oneSaber: boolean;
   contributors: IContributor[];
   customEnvironment?: string;
   customEnvironmentHash?: string;

   static create(
      data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> & Partial<IV1ExtraInfo> = {},
   ): Info {
      return new this(data);
   }

   constructor(
      data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> & Partial<IV1ExtraInfo> = {},
   ) {
      super();
      this.filename = data.filename ?? this.filename;
      this.songName = data.song?.title ?? Info.default.songName;
      this.songSubName = data.song?.subTitle ?? Info.default.songSubName;
      this.songAuthorName = data.song?.author ?? Info.default.authorName;
      this.beatsPerMinute = data.audio?.bpm ?? Info.default.beatsPerMinute;
      this.previewStartTime = data.audio?.previewStartTime ?? Info.default.previewStartTime;
      this.previewDuration = data.audio?.previewDuration ?? Info.default.previewDuration;
      this.coverImageFilename = data.coverImageFilename ?? Info.default.coverImagePath;
      this.environmentName =
         data.environmentName ||
         (data.environmentNames?.[0] as 'DefaultEnvironment') ||
         'DefaultEnvironment';
      this.contributors = deepCopy(data.contributors ?? Info.default.contributors);
      this.customEnvironment = data.customEnvironment ?? Info.default.customEnvironment;
      this.customEnvironmentHash = data.customEnvironmentHash ?? Info.default.customEnvironmentHash;

      this.difficulties = [];
      data.difficulties?.forEach((d) => {
         this.addMap(d as IWrapInfoDifficultyAttribute<IInfoDifficulty>);
      });
      this.songFilename ||= 'song.ogg';

      this.oneSaber = this.difficulties.some((m) => m.characteristic === 'OneSaber');
   }

   static fromJSON(data: DeepPartial<IInfo> = {}): Info {
      const d = new this();
      d.songName = data.songName ?? Info.default.songName;
      d.songSubName = data.songSubName ?? Info.default.songSubName;
      d.songAuthorName = data.authorName ?? Info.default.authorName;
      d.beatsPerMinute = data.beatsPerMinute ?? Info.default.beatsPerMinute;
      d.previewStartTime = data.previewStartTime ?? Info.default.previewStartTime;
      d.previewDuration = data.previewDuration ?? Info.default.previewDuration;
      d.coverImageFilename = data.coverImagePath ?? Info.default.coverImagePath;
      d.environmentName = data.environmentName ?? Info.default.environmentName;

      d.difficulties = [];
      (data.difficultyLevels ?? Info.default.difficultyLevels).forEach((level) => {
         d.addMap(level!);
      });
      d.songFilename ||= 'song.ogg';

      d.oneSaber = d.difficulties.some((m) => m.characteristic === 'OneSaber');
      d.contributors = deepCopy(data.contributors ?? Info.default.contributors);
      d.customEnvironment = data.customEnvironment ?? Info.default.customEnvironment;
      d.customEnvironmentHash = data.customEnvironmentHash ?? Info.default.customEnvironmentHash;
      return d;
   }

   toJSON(): IInfo {
      return {
         songName: this.songName,
         songSubName: this.songSubName,
         authorName: this.songAuthorName,
         beatsPerMinute: this.beatsPerMinute,
         previewStartTime: this.previewStartTime,
         previewDuration: this.previewDuration,
         coverImagePath: this.coverImageFilename,
         environmentName: this.environmentName,
         difficultyLevels: this.listMap().reduce((sets: IInfoDifficulty[], [_, beatmap]) => {
            sets.push(beatmap.toJSON());
            return sets;
         }, []),
         oneSaber: this.difficulties.some((m) => m.characteristic === 'OneSaber'),
         contributors: this.contributors,
         customEnvironment: this.customEnvironment,
         customEnvironmentHash: this.customEnvironmentHash,
      };
   }

   get customData(): Record<string, never> {
      return {};
   }
   set customData(_: Record<string, never>) {
      logger.tWarn(tag('customData'), 'Custom data does not exist in beatmap V1');
   }

   addMap(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV1ExtraInfoDifficulty>,
      characteristic?: CharacteristicName,
   ): this {
      data.audioPath ||= this.songFilename;
      this.difficulties.push(new InfoDifficulty(data, characteristic));
      return this;
   }

   listMap(): [CharacteristicName, InfoDifficulty][] {
      return super.listMap() as [CharacteristicName, InfoDifficulty][];
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}

export interface IV1ExtraInfoDifficulty {
   difficultyRank: IInfoDifficulty['difficultyRank'];
   jsonPath: IInfoDifficulty['jsonPath'];
   audioPath: string;
   offset?: number;
   oldOffset?: number;
   chromaToggle?: string;
   customColors?: boolean;
   difficultyLabel?: string;
   colorLeft?: Omit<IColor, 'a'>;
   colorRight?: Omit<IColor, 'a'>;
   envColorLeft?: Omit<IColor, 'a'>;
   envColorRight?: Omit<IColor, 'a'>;
   obstacleColor?: Omit<IColor, 'a'>;
}

export class InfoDifficulty extends WrapInfoDifficulty<IInfoDifficulty> {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename = '';
   authors = { mappers: [], lighters: [] };
   njs: number;
   njsOffset: number;
   colorSchemeId = 0;
   environmentId = 0;

   rank: IInfoDifficulty['difficultyRank'];
   audioPath: string;
   offset?: number;
   oldOffset?: number;
   chromaToggle?: string;
   customColors?: boolean;
   difficultyLabel?: string;
   colorLeft?: Omit<IColor, 'a'>;
   colorRight?: Omit<IColor, 'a'>;
   envColorLeft?: Omit<IColor, 'a'>;
   envColorRight?: Omit<IColor, 'a'>;
   obstacleColor?: Omit<IColor, 'a'>;

   constructor(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV1ExtraInfoDifficulty> = {},
      songFileName?: string,
      characteristic?: CharacteristicName,
   ) {
      super();

      this.difficulty = data.difficulty ?? 'Easy';
      this.rank = data.difficultyRank ?? 1;
      this.filename = data.jsonPath ?? 'UnnamedFile.dat';
      this.njs = 0;
      this.njsOffset = 0;

      this.audioPath = songFileName ?? 'song.ogg';
      this.characteristic = characteristic || 'Standard';
      this.offset = data.offset;
      this.oldOffset = data.oldOffset;
      this.chromaToggle = data.chromaToggle;
      this.customColors = data.customColors;
      this.difficultyLabel = data.difficultyLabel;
      this.colorLeft = data.colorLeft;
      this.colorRight = data.colorRight;
      this.envColorLeft = data.envColorLeft;
      this.envColorRight = data.envColorRight;
      this.obstacleColor = data.obstacleColor;
   }

   static create(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV1ExtraInfoDifficulty> = {},
      songFileName?: string,
      characteristic?: CharacteristicName,
   ): InfoDifficulty {
      return new this(data, songFileName, characteristic);
   }

   static fromJSON(
      data: Partial<IInfoDifficulty> = {},
      songFileName?: string,
      characteristic?: CharacteristicName,
   ): InfoDifficulty {
      const d = new this();
      d.difficulty = data.difficulty ?? 'Easy';
      d.rank = data.difficultyRank ?? 1;
      d.filename = data.jsonPath ?? 'UnnamedFile.dat';
      d.njs = 0;
      d.njsOffset = 0;

      d.audioPath = songFileName ?? 'song.ogg';
      d.characteristic = characteristic || 'Standard';
      d.offset = data.offset;
      d.oldOffset = data.oldOffset;
      d.chromaToggle = data.chromaToggle;
      d.customColors = data.customColors;
      d.difficultyLabel = data.difficultyLabel;
      d.colorLeft = shallowCopy(data.colorLeft);
      d.colorRight = shallowCopy(data.colorRight);
      d.envColorLeft = shallowCopy(data.envColorLeft);
      d.envColorRight = shallowCopy(data.envColorRight);
      d.obstacleColor = shallowCopy(data.obstacleColor);
      return d;
   }

   toJSON(): IInfoDifficulty {
      return {
         difficulty: this.difficulty,
         difficultyRank: this.rank,
         audioPath: this.audioPath,
         jsonPath: this.filename,
         characteristic: this.characteristic,
         offset: this.offset,
         oldOffset: this.oldOffset,
         chromaToggle: this.chromaToggle,
         customColors: this.customColors,
         difficultyLabel: this.difficultyLabel,
         colorLeft: this.colorLeft,
         colorRight: this.colorRight,
         envColorLeft: this.envColorLeft,
         envColorRight: this.envColorRight,
         obstacleColor: this.obstacleColor,
      };
   }

   get customData(): Record<string, never> {
      return {};
   }
   set customData(_: Record<string, never>) {
      logger.tWarn(tag('customData'), 'Custom data does not exist in beatmap V1');
   }

   copyColorScheme(colorScheme: IWrapInfoColorScheme): this;
   copyColorScheme(id: number, info: IWrapInfo): this;
   copyColorScheme(id: IWrapInfoColorScheme | number, info?: IWrapInfo): this {
      if (typeof id === 'number') {
         if (info!.colorSchemes.length < id) {
            return this;
         }
         const colorScheme = info!.colorSchemes[id];
         return this.copyColorScheme(colorScheme);
      }

      this.colorLeft = Object.entries(id.saberLeftColor).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.colorRight = Object.entries(id.saberRightColor).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.envColorLeft = Object.entries(id.environment0Color).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.envColorRight = Object.entries(id.environment1Color).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.obstacleColor = Object.entries(id.obstaclesColor).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      return this;
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}
