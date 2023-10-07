import { EnvironmentAllName, EnvironmentName } from '../../types/beatmap/shared/environment';
import { IInfo, IInfoDifficulty, IInfoSet } from '../../types/beatmap/v2/info';
import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { EnvironmentV3Name } from '../../types/beatmap/shared/environment';
import { WrapInfo, WrapInfoDifficulty, WrapInfoSet } from '../wrapper/info';
import { DifficultyName } from '../../types/beatmap/shared/difficulty';
import { LooseAutocomplete } from '../../types/utils';
import { GenericFileName } from '../../types/beatmap/shared/filename';
import { Environment360Name } from '../../types/beatmap/shared/environment';
import { deepCopy, shallowCopy } from '../../utils/misc';
import {
   IWrapInfo,
   IWrapInfoColorScheme,
   IWrapInfoColorSchemeData,
   IWrapInfoDifficultyAttribute,
} from '../../types/beatmap/wrapper/info';

/** Difficulty beatmap class object. */
export class Info extends WrapInfo<IInfo> {
   version = '2.1.0' as const;
   songName: string;
   songSubName: string;
   songAuthorName: string;
   levelAuthorName: string;
   beatsPerMinute: number;
   songTimeOffset: number;
   shuffle: number;
   shufflePeriod: number;
   previewStartTime: number;
   previewDuration: number;
   songFilename: string;
   coverImageFilename: string;
   environmentName: EnvironmentName | EnvironmentV3Name;
   allDirectionsEnvironmentName: Environment360Name;
   environmentNames: EnvironmentAllName[];
   colorSchemes: IWrapInfoColorScheme[];
   difficultySets: InfoSet[] = [];

   constructor(data: Partial<IInfo> = {}) {
      super();

      this.songName = data._songName ?? 'SongName';
      this.songSubName = data._songSubName ?? '';
      this.songAuthorName = data._songAuthorName ?? 'SongAuthor';
      this.levelAuthorName = data._levelAuthorName ?? '';
      this.beatsPerMinute = data._beatsPerMinute ?? 120;
      this.songTimeOffset = data._songTimeOffset ?? 0;
      this.shuffle = data._shuffle ?? 0;
      this.shufflePeriod = data._shufflePeriod ?? 0.5;
      this.previewStartTime = data._previewStartTime ?? 12;
      this.previewDuration = data._previewDuration ?? 10;
      this.songFilename = data._songFilename ?? 'song.ogg';
      this.coverImageFilename = data._coverImageFilename ?? '';
      this.environmentName = data._environmentName ?? 'DefaultEnvironment';
      this.allDirectionsEnvironmentName =
         data._allDirectionsEnvironmentName ?? 'GlassDesertEnvironment';
      this.environmentNames = data._environmentNames?.map((e) => e) ?? [];
      this.colorSchemes =
         data._colorSchemes?.map((e) => {
            return {
               useOverride: e.useOverride || false,
               colorScheme: {
                  name: e.colorScheme?.colorSchemeId || '',
                  saberLeftColor: {
                     r: e.colorScheme?.saberAColor?.r ?? 0,
                     g: e.colorScheme?.saberAColor?.g ?? 0,
                     b: e.colorScheme?.saberAColor?.b ?? 0,
                     a: e.colorScheme?.saberAColor?.a ?? 1,
                  },
                  saberRightColor: {
                     r: e.colorScheme?.saberBColor?.r ?? 0,
                     g: e.colorScheme?.saberBColor?.g ?? 0,
                     b: e.colorScheme?.saberBColor?.b ?? 0,
                     a: e.colorScheme?.saberBColor?.a ?? 1,
                  },
                  environment0Color: {
                     r: e.colorScheme?.environmentColor0?.r ?? 0,
                     g: e.colorScheme?.environmentColor0?.g ?? 0,
                     b: e.colorScheme?.environmentColor0?.b ?? 0,
                     a: e.colorScheme?.environmentColor0?.a ?? 1,
                  },
                  environment1Color: {
                     r: e.colorScheme?.environmentColor1?.r ?? 0,
                     g: e.colorScheme?.environmentColor1?.g ?? 0,
                     b: e.colorScheme?.environmentColor1?.b ?? 0,
                     a: e.colorScheme?.environmentColor1?.a ?? 1,
                  },
                  environmentWColor: e.colorScheme?.environmentColorW
                     ? {
                          r: e.colorScheme?.environmentColorW?.r ?? 0,
                          g: e.colorScheme?.environmentColorW?.g ?? 0,
                          b: e.colorScheme?.environmentColorW?.b ?? 0,
                          a: e.colorScheme?.environmentColorW?.a ?? 1,
                       }
                     : undefined,
                  obstaclesColor: {
                     r: e.colorScheme?.obstaclesColor?.r ?? 0,
                     g: e.colorScheme?.obstaclesColor?.g ?? 0,
                     b: e.colorScheme?.obstaclesColor?.b ?? 0,
                     a: e.colorScheme?.obstaclesColor?.a ?? 1,
                  },
                  environment0ColorBoost: {
                     r: e.colorScheme?.environmentColor0Boost?.r ?? 0,
                     g: e.colorScheme?.environmentColor0Boost?.g ?? 0,
                     b: e.colorScheme?.environmentColor0Boost?.b ?? 0,
                     a: e.colorScheme?.environmentColor0Boost?.a ?? 1,
                  },
                  environment1ColorBoost: {
                     r: e.colorScheme?.environmentColor1Boost?.r ?? 0,
                     g: e.colorScheme?.environmentColor1Boost?.g ?? 0,
                     b: e.colorScheme?.environmentColor1Boost?.b ?? 0,
                     a: e.colorScheme?.environmentColor1Boost?.a ?? 1,
                  },
                  environmentWColorBoost: e.colorScheme?.environmentColorWBoost
                     ? {
                          r: e.colorScheme?.environmentColorWBoost?.r ?? 0,
                          g: e.colorScheme?.environmentColorWBoost?.g ?? 0,
                          b: e.colorScheme?.environmentColorWBoost?.b ?? 0,
                          a: e.colorScheme?.environmentColorWBoost?.a ?? 1,
                       }
                     : undefined,
               },
            };
         }) ?? [];
      this.customData = deepCopy(data._customData ?? {});

      data._difficultyBeatmapSets?.forEach((set) => {
         this.difficultySets.push(new InfoSet(set));
      });
   }

   static create(data: Partial<IInfo> = {}): Info {
      return new this(data);
   }

   toJSON(): IInfo {
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
            const cs: IInfo['_colorSchemes'][number] = {
               useOverride: e.useOverride,
               colorScheme: {
                  colorSchemeId: e.colorScheme.name,
                  saberAColor: shallowCopy(e.colorScheme.saberLeftColor),
                  saberBColor: shallowCopy(e.colorScheme.saberRightColor),
                  environmentColor0: shallowCopy(e.colorScheme.environment0Color),
                  environmentColor1: shallowCopy(e.colorScheme.environment1Color),
                  obstaclesColor: shallowCopy(e.colorScheme.obstaclesColor),
                  environmentColor0Boost: shallowCopy(e.colorScheme.environment0ColorBoost),
                  environmentColor1Boost: shallowCopy(e.colorScheme.environment1ColorBoost),
               },
            };
            if (e.colorScheme.environmentWColor) {
               cs.colorScheme.environmentColorW = shallowCopy(e.colorScheme.environmentWColor);
            }
            if (e.colorScheme.environmentWColorBoost) {
               cs.colorScheme.environmentColorWBoost = shallowCopy(
                  e.colorScheme.environmentWColorBoost,
               );
            }
            return cs;
         }),
         _customData: deepCopy(this.customData),
         _difficultyBeatmapSets: this.difficultySets.map((d) => d.toJSON()),
      };
   }

   get customData(): NonNullable<IInfo['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfo['_customData']>) {
      this._customData = value;
   }

   addMap(data: Partial<IInfoDifficulty>, characteristic?: CharacteristicName): this;
   addMap(data: Partial<IWrapInfoDifficultyAttribute>, characteristic?: CharacteristicName): this;
   addMap(
      data: Partial<IWrapInfoDifficultyAttribute> & Partial<IInfoDifficulty>,
      characteristic?: CharacteristicName,
   ): this {
      const mode = characteristic || data.characteristic || 'Standard';
      let found = this.difficultySets.find((set) => set.characteristic === mode);
      if (!found) {
         found = new InfoSet({ _beatmapCharacteristicName: mode });
         this.difficultySets.push(found);
      }
      found.difficulties.push(new InfoDifficulty(data));
      return this;
   }

   listMap(): [CharacteristicName, InfoDifficulty][] {
      return super.listMap() as [CharacteristicName, InfoDifficulty][];
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}

export class InfoSet extends WrapInfoSet<IInfoSet> {
   characteristic: CharacteristicName;
   difficulties: InfoDifficulty[] = [];

   constructor(data: Partial<IInfoSet>) {
      super();

      this.characteristic = data._beatmapCharacteristicName || 'Standard';
      this.difficulties =
         data._difficultyBeatmaps?.map((bmap) => new InfoDifficulty(bmap, this.characteristic)) ??
         [];

      this.customData = deepCopy(data._customData ?? {});
   }

   static create(data: Partial<IInfoSet>) {
      return new this(data);
   }

   toJSON(): IInfoSet {
      return {
         _beatmapCharacteristicName: this.characteristic,
         _difficultyBeatmaps: this.difficulties.map((d) => d.toJSON()),
         _customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IInfoSet['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IInfoSet['_customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}

export class InfoDifficulty extends WrapInfoDifficulty<IInfoDifficulty> {
   readonly characteristic?: CharacteristicName | undefined;
   difficulty: DifficultyName;
   rank: IInfoDifficulty['_difficultyRank'];
   filename: LooseAutocomplete<GenericFileName>;
   njs: number;
   njsOffset: number;
   colorSchemeId: number;
   environmentId: number;

   constructor(data: Partial<IInfoDifficulty>, mode?: CharacteristicName) {
      super();

      this.characteristic = mode;
      this.difficulty = data._difficulty ?? 'Easy';
      this.rank = data._difficultyRank ?? 1;
      this.filename = data._beatmapFilename ?? 'UnnamedFile.dat';
      this.njs = data._noteJumpMovementSpeed ?? 0;
      this.njsOffset = data._noteJumpStartBeatOffset ?? 0;
      this.colorSchemeId = data._beatmapColorSchemeIdx ?? 0;
      this.environmentId = data._environmentNameIdx ?? 0;
      this.customData = deepCopy(data._customData ?? {});
   }

   static create(data: Partial<IInfoDifficulty>) {
      return new this(data);
   }

   toJSON(): IInfoDifficulty {
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
   copyColorScheme(colorScheme: IWrapInfoColorSchemeData): this;
   copyColorScheme(id: IWrapInfoColorSchemeData | number, info?: IWrapInfo): this {
      if (typeof id === 'number') {
         if (info!.colorSchemes.length < id) {
            return this;
         }
         const colorScheme = info!.colorSchemes[id].colorScheme;
         return this.copyColorScheme(colorScheme);
      }

      this.customData._colorLeft = Object.entries(id.saberLeftColor).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._colorRight = Object.entries(id.saberRightColor).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorLeft = Object.entries(id.environment0Color).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorRight = Object.entries(id.environment1Color).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorLeftBoost = Object.entries(id.environment0ColorBoost).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._envColorRightBoost = Object.entries(id.environment1ColorBoost).reduce(
         (p, v) => {
            if (v[0] !== 'a') p[v[0] as 'r'] = v[1];
            return p;
         },
         { r: 0, g: 0, b: 0 },
      );
      this.customData._obstacleColor = Object.entries(id.obstaclesColor).reduce(
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
