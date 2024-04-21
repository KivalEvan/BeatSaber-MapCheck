import type {
   EnvironmentAllName,
   EnvironmentName,
} from '../../types/beatmap/shared/environment.ts';
import type { IInfo, IInfoDifficulty, IInfoSet } from '../../types/beatmap/v2/info.ts';
import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';
import type { EnvironmentV3Name } from '../../types/beatmap/shared/environment.ts';
import { WrapInfo, WrapInfoDifficulty } from '../wrapper/info.ts';
import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import type { DeepPartial, LooseAutocomplete } from '../../types/utils.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import type { Environment360Name } from '../../types/beatmap/shared/environment.ts';
import { deepCopy, shallowCopy } from '../../utils/misc.ts';
import type {
   IWrapInfo,
   IWrapInfoAudio,
   IWrapInfoColorScheme,
   IWrapInfoDifficultyAttribute,
   IWrapInfoSong,
} from '../../types/beatmap/wrapper/info.ts';
import type { IWrapInfoAttribute } from '../../types/beatmap/wrapper/info.ts';

export interface IV2ExtraInfo {
   levelAuthorName: string;
   songTimeOffset: number;
   shuffle: number;
   shufflePeriod: number;
   environmentName: EnvironmentName | EnvironmentV3Name;
   allDirectionsEnvironmentName: Environment360Name;
}

/** Difficulty beatmap class object. */
export class Info extends WrapInfo<IInfo, IInfoDifficulty> {
   static default: Required<IInfo> = {
      _version: '2.1.0',
      _songName: 'Untitled',
      _songSubName: '',
      _songAuthorName: 'NoAuthor',
      _levelAuthorName: 'NoAuthor',
      _beatsPerMinute: 120,
      _shuffle: 0,
      _shufflePeriod: 0.5,
      _previewStartTime: 0,
      _previewDuration: 0,
      _songFilename: 'song.ogg',
      _coverImageFilename: 'cover.jpg',
      _environmentName: 'DefaultEnvironment',
      _allDirectionsEnvironmentName: 'GlassDesertEnvironment',
      _environmentNames: [],
      _colorSchemes: [],
      _songTimeOffset: 0,
      _customData: {},
      _difficultyBeatmapSets: [],
   };

   readonly version = '2.1.0';

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
   environmentNames: EnvironmentAllName[];
   colorSchemes: IWrapInfoColorScheme[];
   difficulties: InfoDifficulty[] = [];

   levelAuthorName: string;
   songTimeOffset: number;
   shuffle: number;
   shufflePeriod: number;
   environmentName: EnvironmentName | EnvironmentV3Name;
   allDirectionsEnvironmentName: Environment360Name;

   static create(
      data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> & Partial<IV2ExtraInfo> = {},
   ): Info {
      return new this(data);
   }

   constructor(
      data: DeepPartial<IWrapInfoAttribute<IInfo, IInfoDifficulty>> & Partial<IV2ExtraInfo> = {},
   ) {
      super();
      this.filename = data.filename ?? this.filename;
      this.songName = data.song?.title ?? Info.default._songName;
      this.songSubName = data.song?.subTitle ?? Info.default._songSubName;
      this.songAuthorName = data.song?.author ?? Info.default._songAuthorName;
      this.levelAuthorName = data.levelAuthorName ?? Info.default._levelAuthorName;
      this.beatsPerMinute = data.audio?.bpm ?? Info.default._beatsPerMinute;
      this.songTimeOffset = data.songTimeOffset ?? Info.default._songTimeOffset;
      this.shuffle = data.shuffle ?? Info.default._shuffle;
      this.shufflePeriod = data.shufflePeriod ?? Info.default._shufflePeriod;
      this.previewStartTime = data.audio?.previewStartTime ?? Info.default._previewStartTime;
      this.previewDuration = data.audio?.previewDuration ?? Info.default._previewDuration;
      this.songFilename = data.audio?.filename ?? Info.default._songFilename;
      this.coverImageFilename = data.coverImageFilename ?? Info.default._coverImageFilename;
      this.environmentName = data.environmentName ?? Info.default._environmentName;
      this.allDirectionsEnvironmentName =
         data.allDirectionsEnvironmentName ?? Info.default._allDirectionsEnvironmentName;
      this.environmentNames = data.environmentNames?.map((e) => e!) ?? [];
      this.colorSchemes =
         data.colorSchemes?.map((e) => {
            e = e!;
            const scheme: IWrapInfoColorScheme = {
               useOverride: !!e.useOverride,
               name: e.name || '',
               saberLeftColor: {
                  r: e.saberLeftColor?.r || 0,
                  g: e.saberLeftColor?.g || 0,
                  b: e.saberLeftColor?.b || 0,
                  a: e.saberLeftColor?.a || 0,
               },
               saberRightColor: {
                  r: e.saberRightColor?.r || 0,
                  g: e.saberRightColor?.g || 0,
                  b: e.saberRightColor?.b || 0,
                  a: e.saberRightColor?.a || 0,
               },
               environment0Color: {
                  r: e.environment0Color?.r || 0,
                  g: e.environment0Color?.g || 0,
                  b: e.environment0Color?.b || 0,
                  a: e.environment0Color?.a || 0,
               },
               environment1Color: {
                  r: e.environment1Color?.r || 0,
                  g: e.environment1Color?.g || 0,
                  b: e.environment1Color?.b || 0,
                  a: e.environment1Color?.a || 0,
               },
               obstaclesColor: {
                  r: e.obstaclesColor?.r || 0,
                  g: e.obstaclesColor?.g || 0,
                  b: e.obstaclesColor?.b || 0,
                  a: e.obstaclesColor?.a || 0,
               },
               environment0ColorBoost: {
                  r: e.environment0ColorBoost?.r || 0,
                  g: e.environment0ColorBoost?.g || 0,
                  b: e.environment0ColorBoost?.b || 0,
                  a: e.environment0ColorBoost?.a || 0,
               },
               environment1ColorBoost: {
                  r: e.environment1ColorBoost?.r || 0,
                  g: e.environment1ColorBoost?.g || 0,
                  b: e.environment1ColorBoost?.b || 0,
                  a: e.environment1ColorBoost?.a || 0,
               },
            };
            if (e.environmentWColor) {
               scheme.environmentWColor = {
                  r: e.environmentWColor?.r || 0,
                  g: e.environmentWColor?.g || 0,
                  b: e.environmentWColor?.b || 0,
                  a: e.environmentWColor?.a || 0,
               };
            }
            if (e.environmentWColorBoost) {
               scheme.environmentWColorBoost = {
                  r: e.environmentWColorBoost?.r || 0,
                  g: e.environmentWColorBoost?.g || 0,
                  b: e.environmentWColorBoost?.b || 0,
                  a: e.environmentWColorBoost?.a || 0,
               };
            }
            return scheme;
         }) ?? [];
      this.customData = deepCopy(data.customData ?? Info.default._customData);

      data.difficulties?.forEach((d) => {
         this.addMap(d as IWrapInfoDifficultyAttribute<IInfoDifficulty>, d!.characteristic);
      });
   }

   static fromJSON(data: DeepPartial<IInfo> = {}): Info {
      const d = new this();
      d.songName = data._songName ?? 'SongName';
      d.songSubName = data._songSubName ?? '';
      d.songAuthorName = data._songAuthorName ?? 'SongAuthor';
      d.levelAuthorName = data._levelAuthorName ?? '';
      d.beatsPerMinute = data._beatsPerMinute ?? 120;
      d.songTimeOffset = data._songTimeOffset ?? 0;
      d.shuffle = data._shuffle ?? 0;
      d.shufflePeriod = data._shufflePeriod ?? 0.5;
      d.previewStartTime = data._previewStartTime ?? 12;
      d.previewDuration = data._previewDuration ?? 10;
      d.songFilename = data._songFilename ?? 'song.ogg';
      d.coverImageFilename = data._coverImageFilename ?? '';
      d.environmentName = data._environmentName ?? 'DefaultEnvironment';
      d.allDirectionsEnvironmentName =
         data._allDirectionsEnvironmentName ?? 'GlassDesertEnvironment';
      d.environmentNames = data._environmentNames?.map((e) => e) ?? [];
      d.colorSchemes =
         data._colorSchemes?.map((e) => {
            const scheme: IWrapInfoColorScheme = {
               useOverride: !!e.useOverride,
               name: e.colorScheme?.colorSchemeId || '',
               saberLeftColor: {
                  r: e.colorScheme?.saberAColor?.r || 0,
                  g: e.colorScheme?.saberAColor?.g || 0,
                  b: e.colorScheme?.saberAColor?.b || 0,
                  a: e.colorScheme?.saberAColor?.a || 0,
               },
               saberRightColor: {
                  r: e.colorScheme?.saberBColor?.r || 0,
                  g: e.colorScheme?.saberBColor?.g || 0,
                  b: e.colorScheme?.saberBColor?.b || 0,
                  a: e.colorScheme?.saberBColor?.a || 0,
               },
               environment0Color: {
                  r: e.colorScheme?.environmentColor0?.r || 0,
                  g: e.colorScheme?.environmentColor0?.g || 0,
                  b: e.colorScheme?.environmentColor0?.b || 0,
                  a: e.colorScheme?.environmentColor0?.a || 0,
               },
               environment1Color: {
                  r: e.colorScheme?.environmentColor1?.r || 0,
                  g: e.colorScheme?.environmentColor1?.g || 0,
                  b: e.colorScheme?.environmentColor1?.b || 0,
                  a: e.colorScheme?.environmentColor1?.a || 0,
               },
               obstaclesColor: {
                  r: e.colorScheme?.obstaclesColor?.r || 0,
                  g: e.colorScheme?.obstaclesColor?.g || 0,
                  b: e.colorScheme?.obstaclesColor?.b || 0,
                  a: e.colorScheme?.obstaclesColor?.a || 0,
               },
               environment0ColorBoost: {
                  r: e.colorScheme?.environmentColor0Boost?.r || 0,
                  g: e.colorScheme?.environmentColor0Boost?.g || 0,
                  b: e.colorScheme?.environmentColor0Boost?.b || 0,
                  a: e.colorScheme?.environmentColor0Boost?.a || 0,
               },
               environment1ColorBoost: {
                  r: e.colorScheme?.environmentColor1Boost?.r || 0,
                  g: e.colorScheme?.environmentColor1Boost?.g || 0,
                  b: e.colorScheme?.environmentColor1Boost?.b || 0,
                  a: e.colorScheme?.environmentColor1Boost?.a || 0,
               },
            };
            if (e.colorScheme?.environmentColorW) {
               scheme.environmentWColor = {
                  r: e.colorScheme?.environmentColorW?.r || 0,
                  g: e.colorScheme?.environmentColorW?.g || 0,
                  b: e.colorScheme?.environmentColorW?.b || 0,
                  a: e.colorScheme?.environmentColorW?.a || 0,
               };
            }
            if (e.colorScheme?.environmentColorWBoost) {
               scheme.environmentWColorBoost = {
                  r: e.colorScheme?.environmentColorWBoost?.r || 0,
                  g: e.colorScheme?.environmentColorWBoost?.g || 0,
                  b: e.colorScheme?.environmentColorWBoost?.b || 0,
                  a: e.colorScheme?.environmentColorWBoost?.a || 0,
               };
            }
            return scheme;
         }) ?? [];
      d.customData = deepCopy(data._customData ?? {});

      data._difficultyBeatmapSets?.forEach((set) => {
         set._difficultyBeatmaps?.forEach((diff) =>
            d.difficulties.push(InfoDifficulty.fromJSON(diff, set._beatmapCharacteristicName)),
         );
      });
      return d;
   }

   toJSON(): Required<IInfo> {
      return {
         _version: this.version,
         _songName: this.songName,
         _songSubName: this.songSubName,
         _songAuthorName: this.songAuthorName,
         _levelAuthorName: this.levelAuthorName,
         _beatsPerMinute: this.beatsPerMinute,
         _songTimeOffset: this.songTimeOffset,
         _shuffle: this.shuffle,
         _shufflePeriod: this.shufflePeriod,
         _previewStartTime: this.previewStartTime,
         _previewDuration: this.previewDuration,
         _songFilename: this.songFilename,
         _coverImageFilename: this.coverImageFilename,
         _environmentName: this.environmentName,
         _allDirectionsEnvironmentName: this.allDirectionsEnvironmentName,
         _environmentNames: this.environmentNames.map((e) => e),
         _colorSchemes: this.colorSchemes.map((e) => {
            const cs: Required<IInfo>['_colorSchemes'][number] = {
               useOverride: e.useOverride,
               colorScheme: {
                  colorSchemeId: e.name,
                  saberAColor: shallowCopy(e.saberLeftColor),
                  saberBColor: shallowCopy(e.saberRightColor),
                  environmentColor0: shallowCopy(e.environment0Color),
                  environmentColor1: shallowCopy(e.environment1Color),
                  obstaclesColor: shallowCopy(e.obstaclesColor),
                  environmentColor0Boost: shallowCopy(e.environment0ColorBoost),
                  environmentColor1Boost: shallowCopy(e.environment1ColorBoost),
               },
            };
            if (e.environmentWColor) {
               cs.colorScheme!.environmentColorW = shallowCopy(e.environmentWColor);
            }
            if (e.environmentWColorBoost) {
               cs.colorScheme!.environmentColorWBoost = shallowCopy(e.environmentWColorBoost);
            }
            return cs;
         }),
         _customData: deepCopy(this.customData),
         _difficultyBeatmapSets: this.difficulties.reduce((set, d) => {
            let found = set.find((s) => s._beatmapCharacteristicName === d.characteristic);
            if (!found) {
               found = {
                  _beatmapCharacteristicName: d.characteristic,
                  _difficultyBeatmaps: [],
               };
               set.push(found);
            }
            found._difficultyBeatmaps!.push(d.toJSON());
            return set;
         }, [] as IInfoSet[]),
      };
   }

   get customData(): NonNullable<IInfo['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfo['_customData']>) {
      this._customData = value;
   }

   addMap(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV2ExtraInfoDifficulty>,
      characteristic?: CharacteristicName,
   ): this {
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

export interface IV2ExtraInfoDifficulty {
   rank: Required<IInfoDifficulty>['_difficultyRank'];
}

export class InfoDifficulty extends WrapInfoDifficulty<IInfoDifficulty> {
   static default: Required<IInfoDifficulty & IV2ExtraInfoDifficulty> = {
      _difficulty: 'Easy',
      _difficultyRank: 1,
      _beatmapFilename: 'UnnamedFile.dat',
      _noteJumpMovementSpeed: 0,
      _noteJumpStartBeatOffset: 0,
      _beatmapColorSchemeIdx: 0,
      _environmentNameIdx: 0,
      _customData: {},
      rank: 1,
   };

   characteristic: CharacteristicName;
   difficulty: DifficultyName;
   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename = '';
   authors = { mappers: [], lighters: [] };
   njs: number;
   njsOffset: number;
   colorSchemeId: number;
   environmentId: number;

   rank: Required<IInfoDifficulty>['_difficultyRank'];

   constructor(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV2ExtraInfoDifficulty> = {},
      characteristic: CharacteristicName = 'Standard',
   ) {
      super();

      this.characteristic = characteristic;
      this.difficulty = data.difficulty ?? InfoDifficulty.default._difficulty;
      this.rank = data.rank ?? InfoDifficulty.default.rank;
      this.filename = data.filename ?? InfoDifficulty.default._beatmapFilename;
      this.njs = data.njs ?? InfoDifficulty.default._noteJumpMovementSpeed;
      this.njsOffset = data.njsOffset ?? InfoDifficulty.default._noteJumpStartBeatOffset;
      this.colorSchemeId = data.colorSchemeId ?? InfoDifficulty.default._beatmapColorSchemeIdx;
      this.environmentId = data.environmentId ?? InfoDifficulty.default._environmentNameIdx;
      this.customData = deepCopy(data.customData ?? InfoDifficulty.default._customData);
   }

   static create(
      data: Partial<IWrapInfoDifficultyAttribute<IInfoDifficulty>> &
         Partial<IV2ExtraInfoDifficulty> = {},
   ): InfoDifficulty {
      return new this(data);
   }

   static fromJSON(
      data: Partial<IInfoDifficulty>,
      characteristic: CharacteristicName = 'Standard',
   ): InfoDifficulty {
      const d = new this();
      d.characteristic = characteristic;
      d.difficulty = data._difficulty ?? InfoDifficulty.default._difficulty;
      d.rank = data._difficultyRank ?? InfoDifficulty.default._difficultyRank;
      d.filename = data._beatmapFilename ?? InfoDifficulty.default._beatmapFilename;
      d.njs = data._noteJumpMovementSpeed ?? InfoDifficulty.default._noteJumpMovementSpeed;
      d.njsOffset =
         data._noteJumpStartBeatOffset ?? InfoDifficulty.default._noteJumpStartBeatOffset;
      d.colorSchemeId =
         data._beatmapColorSchemeIdx ?? InfoDifficulty.default._beatmapColorSchemeIdx;
      d.environmentId = data._environmentNameIdx ?? InfoDifficulty.default._environmentNameIdx;
      d.customData = deepCopy(data._customData ?? InfoDifficulty.default._customData);
      return d;
   }

   toJSON(): Required<IInfoDifficulty> {
      return {
         _difficulty: this.difficulty,
         _difficultyRank: this.rank,
         _beatmapFilename: this.filename,
         _noteJumpMovementSpeed: this.njs,
         _noteJumpStartBeatOffset: this.njsOffset,
         _beatmapColorSchemeIdx: this.colorSchemeId,
         _environmentNameIdx: this.environmentId,
         _customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IInfoDifficulty['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfoDifficulty['_customData']>) {
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
