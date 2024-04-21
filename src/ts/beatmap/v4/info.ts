import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { IInfo, IInfoDifficulty } from '../../types/beatmap/v4/info.ts';
import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';
import { WrapInfo, WrapInfoDifficulty } from '../wrapper/info.ts';
import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import type { DeepRequiredIgnore, LooseAutocomplete } from '../../types/utils.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import { deepCopy, shallowCopy } from '../../utils/misc.ts';
import type {
   IWrapInfo,
   IWrapInfoAttribute,
   IWrapInfoAudio,
   IWrapInfoColorScheme,
   IWrapInfoDifficultyAttribute,
   IWrapInfoSong,
} from '../../types/beatmap/wrapper/info.ts';
import { hexToRgba, toColorObject } from '../../utils/colors.ts';
import { colorToHex } from '../../utils/colors.ts';
import type { DeepPartial } from '../../types/utils.ts';

/** Difficulty beatmap class object. */
export class Info extends WrapInfo<IInfo, IInfoDifficulty> {
   static default: DeepRequiredIgnore<IInfo, 'customData'> = {
      version: '4.0.0',
      song: {
         author: '',
         title: '',
         subTitle: '',
      },
      audio: {
         songFilename: '',
         songDuration: 0,
         audioDataFilename: '',
         bpm: 0,
         lufs: 0,
         previewStartTime: 0,
         previewDuration: 0,
      },
      songPreviewFilename: '',
      coverImageFilename: '',
      environmentNames: [],
      colorSchemes: [],
      difficultyBeatmaps: [],
      customData: {},
   };

   readonly version = '4.0.0' as const;
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
   coverImageFilename = '';
   environmentNames: EnvironmentAllName[];
   colorSchemes: IWrapInfoColorScheme[];
   difficulties: InfoDifficulty[] = [];

   static create(data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> = {}): Info {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;

      this.song.author = data.song?.author || Info.default.song.author;
      this.song.title = data.song?.title || Info.default.song.title;
      this.song.subTitle = data.song?.subTitle || Info.default.song.subTitle;

      this.audio.filename = data.audio?.filename || Info.default.audio.songFilename;
      this.audio.duration = data.audio?.duration || Info.default.audio.songDuration;
      this.audio.audioDataFilename =
         data.audio?.audioDataFilename || Info.default.audio.audioDataFilename;
      this.audio.bpm = data.audio?.bpm || Info.default.audio.bpm;
      this.audio.lufs = data.audio?.lufs || Info.default.audio.lufs;
      this.audio.previewStartTime =
         data.audio?.previewStartTime || Info.default.audio.previewStartTime;
      this.audio.previewDuration =
         data.audio?.previewDuration || Info.default.audio.previewDuration;

      this.songPreviewFilename = data.songPreviewFilename || Info.default.songPreviewFilename;
      this.coverImageFilename = data.coverImageFilename || Info.default.coverImageFilename;

      this.environmentNames = (data.environmentNames ?? Info.default.environmentNames).map(
         (e) => e!,
      );
      if (data.colorSchemes) {
         this.colorSchemes = data.colorSchemes.map((e) => {
            e = e!;
            const scheme: IWrapInfoColorScheme = {
               useOverride: !!e.useOverride,
               name: e.name || '',
               saberLeftColor: { r: 0, g: 0, b: 0, a: 0, ...e.saberLeftColor },
               saberRightColor: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0,
                  ...e.saberRightColor,
               },
               environment0Color: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0,
                  ...e.environment0Color,
               },
               environment1Color: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0,
                  ...e.environment1Color,
               },
               obstaclesColor: { r: 0, g: 0, b: 0, a: 0, ...e.obstaclesColor },
               environment0ColorBoost: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0,
                  ...e.environment0ColorBoost,
               },
               environment1ColorBoost: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0,
                  ...e.environment1ColorBoost,
               },
            };
            if (e.environmentWColor) {
               scheme.environmentWColor = shallowCopy(e.environmentWColor);
            }
            if (e.environmentWColorBoost) {
               scheme.environmentWColorBoost = shallowCopy(e.environmentWColorBoost);
            }
            return scheme;
         });
      } else {
         this.colorSchemes = Info.default.colorSchemes.map((e) => {
            const scheme: IWrapInfoColorScheme = {
               useOverride: !!e.useOverride,
               name: e.colorSchemeName || '',
               saberLeftColor: toColorObject(hexToRgba(e.saberAColor), true),
               saberRightColor: toColorObject(hexToRgba(e.saberBColor), true),
               environment0Color: toColorObject(hexToRgba(e.environmentColor0), true),
               environment1Color: toColorObject(hexToRgba(e.environmentColor1), true),
               obstaclesColor: toColorObject(hexToRgba(e.obstaclesColor), true),
               environment0ColorBoost: toColorObject(hexToRgba(e.environmentColor0Boost), true),
               environment1ColorBoost: toColorObject(hexToRgba(e.environmentColor1Boost), true),
            };
            if (e.environmentColorW) {
               scheme.environmentWColor = toColorObject(hexToRgba(e.environmentColorW), true);
            }
            if (e.environmentColorWBoost) {
               scheme.environmentWColorBoost = toColorObject(
                  hexToRgba(e.environmentColorWBoost),
                  true,
               );
            }
            return scheme;
         });
      }
      this.customData = deepCopy(data.customData ?? Info.default.customData);

      this.difficulties = (data.difficulties ?? Info.default.difficultyBeatmaps).map(
         (d) => new InfoDifficulty(d as IWrapInfoDifficultyAttribute<IInfoDifficulty>),
      );
   }

   static fromJSON(data: DeepPartial<IInfo> = {}): Info {
      const d = new this();

      d.song.author = data.song?.author || Info.default.song.author;
      d.song.title = data.song?.title || Info.default.song.title;
      d.song.subTitle = data.song?.subTitle || Info.default.song.subTitle;

      d.audio.filename = data.audio?.songFilename || Info.default.audio.songFilename;
      d.audio.duration = data.audio?.songDuration || Info.default.audio.songDuration;
      d.audio.audioDataFilename =
         data.audio?.audioDataFilename || Info.default.audio.audioDataFilename;
      d.audio.bpm = data.audio?.bpm || Info.default.audio.bpm;
      d.audio.lufs = data.audio?.lufs || Info.default.audio.lufs;
      d.audio.previewStartTime =
         data.audio?.previewStartTime || Info.default.audio.previewStartTime;
      d.audio.previewDuration = data.audio?.previewDuration || Info.default.audio.previewDuration;

      d.songPreviewFilename = data.songPreviewFilename || Info.default.songPreviewFilename;
      d.coverImageFilename = data.coverImageFilename || Info.default.coverImageFilename;

      d.environmentNames = (data.environmentNames ?? Info.default.environmentNames).map((e) => e!);
      d.colorSchemes = (data.colorSchemes ?? Info.default.colorSchemes).map((e) => {
         e = e!;
         const scheme: IWrapInfoColorScheme = {
            useOverride: !!e.useOverride,
            name: e.colorSchemeName || '',
            saberLeftColor: toColorObject(hexToRgba(e.saberAColor!), true),
            saberRightColor: toColorObject(hexToRgba(e.saberBColor!), true),
            environment0Color: toColorObject(hexToRgba(e.environmentColor0!), true),
            environment1Color: toColorObject(hexToRgba(e.environmentColor1!), true),
            obstaclesColor: toColorObject(hexToRgba(e.obstaclesColor!), true),
            environment0ColorBoost: toColorObject(hexToRgba(e.environmentColor0Boost!), true),
            environment1ColorBoost: toColorObject(hexToRgba(e.environmentColor1Boost!), true),
         };
         if (e.environmentColorW) {
            scheme.environmentWColor = toColorObject(hexToRgba(e.environmentColorW), true);
         }
         if (e.environmentColorWBoost) {
            scheme.environmentWColorBoost = toColorObject(
               hexToRgba(e.environmentColorWBoost),
               true,
            );
         }
         return scheme;
      });
      d.customData = deepCopy(data.customData ?? Info.default.customData);

      d.difficulties = (data.difficultyBeatmaps ?? []).map((d) =>
         InfoDifficulty.fromJSON(d as IInfoDifficulty),
      );

      return d;
   }

   toJSON(): Required<IInfo> {
      return {
         version: this.version,
         song: {
            author: this.song.author,
            title: this.song.title,
            subTitle: this.song.subTitle,
         },
         audio: {
            songFilename: this.audio.filename,
            songDuration: this.audio.duration,
            audioDataFilename: this.audio.audioDataFilename,
            bpm: this.audio.bpm,
            lufs: this.audio.lufs,
            previewStartTime: this.audio.previewStartTime,
            previewDuration: this.audio.previewDuration,
         },
         songPreviewFilename: this.songPreviewFilename,
         coverImageFilename: this.coverImageFilename,
         environmentNames: this.environmentNames.map((e) => e),
         colorSchemes: this.colorSchemes.map((e) => {
            const cs: Required<IInfo>['colorSchemes'][number] = {
               useOverride: e.useOverride,
               colorSchemeName: e.name,
               saberAColor: colorToHex(e.saberLeftColor),
               saberBColor: colorToHex(e.saberRightColor),
               environmentColor0: colorToHex(e.environment0Color),
               environmentColor1: colorToHex(e.environment1Color),
               obstaclesColor: colorToHex(e.obstaclesColor),
               environmentColor0Boost: colorToHex(e.environment0ColorBoost),
               environmentColor1Boost: colorToHex(e.environment1ColorBoost),
            };
            if (e.environmentWColor) {
               cs.environmentColorW = colorToHex(e.environmentWColor);
            }
            if (e.environmentWColorBoost) {
               cs.environmentColorWBoost = colorToHex(e.environmentWColorBoost);
            }
            return cs;
         }),
         difficultyBeatmaps: this.difficulties.map((d) => d.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IInfo['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfo['customData']>) {
      this._customData = value;
   }

   addMap(data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>>): this {
      this.difficulties.push(new InfoDifficulty(data));
      return this;
   }

   listMap(): [CharacteristicName, InfoDifficulty][] {
      return super.listMap() as [CharacteristicName, InfoDifficulty][];
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}

export class InfoDifficulty extends WrapInfoDifficulty<IInfoDifficulty> {
   static default: Required<IInfoDifficulty> = {
      characteristic: 'Standard',
      difficulty: 'Easy',
      beatmapAuthors: { mappers: [], lighters: [] },
      environmentNameIdx: 0,
      beatmapColorSchemeIdx: 0,
      noteJumpMovementSpeed: 0,
      noteJumpStartBeatOffset: 0,
      beatmapDataFilename: 'UnnamedFile.dat',
      lightshowDataFilename: 'UnnamedFile.dat',
      customData: {},
   };

   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename: LooseAutocomplete<GenericFilename>;
   authors: { mappers: string[]; lighters: string[] } = {
      mappers: [],
      lighters: [],
   };
   njs: number;
   njsOffset: number;
   colorSchemeId: number;
   environmentId: number;

   static create(data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>>): InfoDifficulty {
      return new this(data);
   }

   constructor(data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> = {}) {
      super();
      this.characteristic = data.characteristic ?? InfoDifficulty.default.characteristic;
      this.difficulty = data.difficulty ?? InfoDifficulty.default.difficulty;
      this.authors.mappers = (
         data.authors?.mappers ?? InfoDifficulty.default.beatmapAuthors.mappers
      ).map((s) => s);
      this.authors.lighters = (
         data.authors?.lighters ?? InfoDifficulty.default.beatmapAuthors.lighters
      ).map((s) => s);
      this.filename = data.filename ?? InfoDifficulty.default.beatmapDataFilename;
      this.lightshowFilename =
         data.lightshowFilename ?? InfoDifficulty.default.lightshowDataFilename;
      this.njs = data.njs ?? InfoDifficulty.default.noteJumpMovementSpeed;
      this.njsOffset = data.njsOffset ?? InfoDifficulty.default.noteJumpStartBeatOffset;
      this.colorSchemeId = data.colorSchemeId ?? InfoDifficulty.default.beatmapColorSchemeIdx;
      this.environmentId = data.environmentId ?? InfoDifficulty.default.environmentNameIdx;
      this.customData = deepCopy(data.customData ?? InfoDifficulty.default.customData);
   }

   static fromJSON(data: Partial<IInfoDifficulty>): InfoDifficulty {
      const d = new this();
      d.characteristic = data.characteristic ?? InfoDifficulty.default.characteristic;
      d.difficulty = data.difficulty ?? InfoDifficulty.default.difficulty;
      d.authors.mappers = (
         data.beatmapAuthors?.mappers ?? InfoDifficulty.default.beatmapAuthors.mappers
      ).map((s) => s);
      d.authors.lighters = (
         data.beatmapAuthors?.lighters ?? InfoDifficulty.default.beatmapAuthors.lighters
      ).map((s) => s);
      d.filename = data.beatmapDataFilename ?? InfoDifficulty.default.beatmapDataFilename;
      d.lightshowFilename =
         data.lightshowDataFilename ?? InfoDifficulty.default.lightshowDataFilename;
      d.njs = data.noteJumpMovementSpeed ?? InfoDifficulty.default.noteJumpMovementSpeed;
      d.njsOffset = data.noteJumpStartBeatOffset ?? InfoDifficulty.default.noteJumpStartBeatOffset;
      d.colorSchemeId = data.beatmapColorSchemeIdx ?? InfoDifficulty.default.beatmapColorSchemeIdx;
      d.environmentId = data.environmentNameIdx ?? InfoDifficulty.default.environmentNameIdx;
      d.customData = deepCopy(data.customData ?? InfoDifficulty.default.customData);
      return d;
   }

   toJSON(): Required<IInfoDifficulty> {
      return {
         characteristic: this.characteristic,
         difficulty: this.difficulty,
         beatmapAuthors: {
            mappers: [...this.authors.mappers],
            lighters: [...this.authors.lighters],
         },
         environmentNameIdx: this.environmentId,
         beatmapColorSchemeIdx: this.colorSchemeId,
         noteJumpMovementSpeed: this.njs,
         noteJumpStartBeatOffset: this.njsOffset,
         lightshowDataFilename: this.lightshowFilename,
         beatmapDataFilename: this.filename,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IInfoDifficulty['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfoDifficulty['customData']>) {
      this._customData = value;
   }

   copyColorScheme(id: number, info: IWrapInfo): this;
   copyColorScheme(colorScheme: IWrapInfoColorScheme): this;
   copyColorScheme(id: IWrapInfoColorScheme | number, info?: IWrapInfo): this {
      if (typeof id === 'number') {
         if (info!.colorSchemes.length < id) {
            return this;
         }
         const colorScheme = info!.colorSchemes[id];
         return this.copyColorScheme(colorScheme);
      }

      this.customData._colorLeft = Object.entries(id.saberLeftColor).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._colorRight = Object.entries(id.saberRightColor).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorLeft = Object.entries(id.environment0Color).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorRight = Object.entries(id.environment1Color).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorLeftBoost = Object.entries(id.environment0ColorBoost).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorRightBoost = Object.entries(id.environment1ColorBoost).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._obstacleColor = Object.entries(id.obstaclesColor).reduce(
         (p, v) => {
            p[v[0] as 'r'] = v[1];
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
