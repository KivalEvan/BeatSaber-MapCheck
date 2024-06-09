import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';
import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import type { IInfoBeatmapAuthors } from '../../types/beatmap/v4/info.ts';
import type {
   IWrapInfo,
   IWrapInfoAttribute,
   IWrapInfoAudio,
   IWrapInfoBeatmap,
   IWrapInfoBeatmapAttribute,
   IWrapInfoColorScheme,
   IWrapInfoSong,
} from '../../types/beatmap/wrapper/info.ts';
import type { DeepPartialIgnore, LooseAutocomplete } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { CharacteristicOrder } from '../shared/characteristic.ts';
import { DifficultyRanking } from '../shared/difficulty.ts';
import { BaseItem } from './abstract/baseItem.ts';

export class Info extends BaseItem implements IWrapInfo {
   static defaultValue: IWrapInfoAttribute = {
      version: -1,
      filename: 'Info.dat',
      song: {
         title: 'Untitled',
         subTitle: '',
         author: 'NoAuthor',
      },
      audio: {
         filename: '',
         duration: 0,
         audioDataFilename: '',
         bpm: 0,
         lufs: 0,
         previewStartTime: 0,
         previewDuration: 0,
         audioOffset: 0,
         shuffle: 0,
         shufflePeriod: 0.5,
      },
      songPreviewFilename: '',
      coverImageFilename: '',
      environmentNames: [],
      colorSchemes: [],
      difficulties: [],
      customData: {},
   };

   static create(...data: DeepPartialIgnore<IWrapInfoAttribute, 'customData'>[]): Info[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapInfoAttribute, 'customData'> = {}) {
      super();
      this.version = data.version ?? Info.defaultValue.version;
      this.filename = data.filename ?? Info.defaultValue.filename;

      this.song = {
         title: data.song?.title ?? Info.defaultValue.song.title,
         subTitle: data.song?.subTitle ?? Info.defaultValue.song.subTitle,
         author: data.song?.author ?? Info.defaultValue.song.author,
      };
      this.audio = {
         filename: data.audio?.filename ?? Info.defaultValue.audio.filename,
         duration: data.audio?.duration ?? Info.defaultValue.audio.duration,
         audioDataFilename:
            data.audio?.audioDataFilename ?? Info.defaultValue.audio.audioDataFilename,
         bpm: data.audio?.bpm ?? Info.defaultValue.audio.bpm,
         lufs: data.audio?.lufs ?? Info.defaultValue.audio.lufs,
         previewStartTime: data.audio?.previewStartTime ?? Info.defaultValue.audio.previewStartTime,
         previewDuration: data.audio?.previewDuration ?? Info.defaultValue.audio.previewDuration,
         audioOffset: data.audio?.audioOffset ?? Info.defaultValue.audio.audioOffset,
         shuffle: data.audio?.shuffle ?? Info.defaultValue.audio.shuffle,
         shufflePeriod: data.audio?.shufflePeriod ?? Info.defaultValue.audio.shufflePeriod,
      };
      this.songPreviewFilename = data.songPreviewFilename ?? Info.defaultValue.songPreviewFilename;
      this.coverImageFilename = data.coverImageFilename ?? Info.defaultValue.coverImageFilename;
      this.environmentNames = (data.environmentNames ?? Info.defaultValue.environmentNames).map(
         (e) => e!,
      );
      this.colorSchemes = (data.colorSchemes ?? Info.defaultValue.colorSchemes).map((e) => ({
         useOverride: e!.useOverride || false,
         name: e!.name || '',
         saberLeftColor: {
            r: e!.saberLeftColor?.r || 0,
            g: e!.saberLeftColor?.g || 0,
            b: e!.saberLeftColor?.b || 0,
            a: e!.saberLeftColor?.a || 0,
         },
         saberRightColor: {
            r: e!.saberRightColor?.r || 0,
            g: e!.saberRightColor?.g || 0,
            b: e!.saberRightColor?.b || 0,
            a: e!.saberRightColor?.a || 0,
         },
         environment0Color: {
            r: e!.environment0Color?.r || 0,
            g: e!.environment0Color?.g || 0,
            b: e!.environment0Color?.b || 0,
            a: e!.environment0Color?.a || 0,
         },
         environment1Color: {
            r: e!.environment1Color?.r || 0,
            g: e!.environment1Color?.g || 0,
            b: e!.environment1Color?.b || 0,
            a: e!.environment1Color?.a || 0,
         },
         environmentWColor: {
            r: e!.environmentWColor?.r || 0,
            g: e!.environmentWColor?.g || 0,
            b: e!.environmentWColor?.b || 0,
            a: e!.environmentWColor?.a || 0,
         },
         environment0ColorBoost: {
            r: e!.environment0ColorBoost?.r || 0,
            g: e!.environment0ColorBoost?.g || 0,
            b: e!.environment0ColorBoost?.b || 0,
            a: e!.environment0ColorBoost?.a || 0,
         },
         environment1ColorBoost: {
            r: e!.environment1ColorBoost?.r || 0,
            g: e!.environment1ColorBoost?.g || 0,
            b: e!.environment1ColorBoost?.b || 0,
            a: e!.environment1ColorBoost?.a || 0,
         },
         environmentWColorBoost: {
            r: e!.environmentWColorBoost?.r || 0,
            g: e!.environmentWColorBoost?.g || 0,
            b: e!.environmentWColorBoost?.b || 0,
            a: e!.environmentWColorBoost?.a || 0,
         },
         obstaclesColor: {
            r: e!.obstaclesColor?.r || 0,
            g: e!.obstaclesColor?.g || 0,
            b: e!.obstaclesColor?.b || 0,
            a: e!.obstaclesColor?.a || 0,
         },
      }));
      this.difficulties = (data.difficulties ?? Info.defaultValue.difficulties).map(
         (e) => new InfoBeatmap(e),
      );
      this.customData = deepCopy(data.customData ?? Info.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              this.audio.filename !== '' &&
              this.audio.duration > 0 &&
              this.audio.previewDuration > 0 &&
              this.audio.previewStartTime > 0 &&
              this.audio.audioOffset >= 0 &&
              this.difficulties.every((e) => e.isValid());
   }

   version: number;
   filename: LooseAutocomplete<'Info.dat' | 'info.dat'>;

   song: IWrapInfoSong;
   audio: IWrapInfoAudio;
   songPreviewFilename: string;
   coverImageFilename: string;
   environmentNames: EnvironmentAllName[];
   colorSchemes: IWrapInfoColorScheme[];
   difficulties: IWrapInfoBeatmap[];

   clone<U extends this>(): U {
      return super.clone().setFilename(this.filename) as U;
   }

   setFilename(filename: LooseAutocomplete<'Info.dat' | 'info.dat'>): this {
      this.filename = filename;
      return this;
   }

   sort(): this {
      this.difficulties
         .sort((a, b) => DifficultyRanking[a.difficulty] - DifficultyRanking[b.difficulty])
         .sort(
            (a, b) =>
               (CharacteristicOrder[a.characteristic] || 0) -
               (CharacteristicOrder[b.characteristic] || 0),
         );

      return this;
   }

   addMap(data: DeepPartialIgnore<IWrapInfoBeatmapAttribute, 'customData'>): this {
      this.difficulties.push(new InfoBeatmap(data));
      return this;
   }
}

export class InfoBeatmap extends BaseItem implements IWrapInfoBeatmap {
   static defaultValue: IWrapInfoBeatmapAttribute = {
      characteristic: 'Standard',
      difficulty: 'Easy',
      filename: 'Unnamed.beatmap.dat',
      lightshowFilename: 'Unnamed.lightshow.dat',
      authors: {
         mappers: [],
         lighters: [],
      },
      njs: 10,
      njsOffset: 0,
      colorSchemeId: -1,
      environmentId: 0,
      customData: {},
   };

   static create(
      ...data: DeepPartialIgnore<IWrapInfoBeatmapAttribute, 'customData'>[]
   ): InfoBeatmap[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapInfoBeatmapAttribute, 'customData'> = {}) {
      super();
      this.characteristic = data.characteristic ?? InfoBeatmap.defaultValue.characteristic;
      this.difficulty = data.difficulty ?? InfoBeatmap.defaultValue.difficulty;
      this.filename = data.filename ?? InfoBeatmap.defaultValue.filename;
      this.lightshowFilename = data.lightshowFilename ?? InfoBeatmap.defaultValue.lightshowFilename;
      this.authors = {
         mappers: (data.authors?.mappers ?? InfoBeatmap.defaultValue.authors.mappers).map(
            (e) => e!,
         ),
         lighters: (data.authors?.lighters ?? InfoBeatmap.defaultValue.authors.lighters).map(
            (e) => e!,
         ),
      };
      this.njs = data.njs ?? InfoBeatmap.defaultValue.njs;
      this.njsOffset = data.njsOffset ?? InfoBeatmap.defaultValue.njsOffset;
      this.colorSchemeId = data.colorSchemeId ?? InfoBeatmap.defaultValue.colorSchemeId;
      this.environmentId = data.environmentId ?? InfoBeatmap.defaultValue.environmentId;
      this.customData = deepCopy(data.customData ?? InfoBeatmap.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && this.njs > 0 && this.colorSchemeId >= -1 && this.environmentId >= 0;
   }

   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename: LooseAutocomplete<GenericFilename>;
   authors: IInfoBeatmapAuthors;
   njs: number;
   njsOffset: number;
   colorSchemeId: number;
   environmentId: number;
}
