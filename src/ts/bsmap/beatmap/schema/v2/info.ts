import type {
   Environment360Name,
   EnvironmentName,
   EnvironmentV3Name,
} from '../../../types/beatmap/shared/environment.ts';
import type { IInfo, IInfoSet } from '../../../types/beatmap/v2/info.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy, shallowCopy } from '../../../utils/misc.ts';
import type {
   IWrapInfoAttribute,
   IWrapInfoColorScheme,
} from '../../../types/beatmap/wrapper/info.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { infoDifficulty } from './infoDifficulty.ts';

const defaultValue = {
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
} as Required<IInfo>;
export const info: ISchemaContainer<IWrapInfoAttribute, IInfo> = {
   defaultValue,
   serialize(data: IWrapInfoAttribute): IInfo {
      const authorSet = new Set();
      const d: IInfo = {
         _version: '2.1.0',
         _songName: data.song.title,
         _songSubName: data.song.subTitle,
         _songAuthorName: data.song.author,
         _levelAuthorName: '',
         _beatsPerMinute: data.audio.bpm,
         _songTimeOffset: data.audio.audioOffset,
         _shuffle: data.audio.shuffle,
         _shufflePeriod: data.audio.shufflePeriod,
         _previewStartTime: data.audio.previewStartTime,
         _previewDuration: data.audio.previewDuration,
         _songFilename: data.audio.filename,
         _coverImageFilename: data.coverImageFilename,
         _environmentName:
            (data.environmentNames.find(
               (e) => e !== 'GlassDesertEnvironment' && e !== 'MultiplayerEnvironment',
            ) as EnvironmentName & EnvironmentV3Name) ?? defaultValue._environmentName,
         _allDirectionsEnvironmentName:
            (data.environmentNames.find(
               (e) => e === 'GlassDesertEnvironment' || e === 'MultiplayerEnvironment',
            ) as Environment360Name) ?? defaultValue._allDirectionsEnvironmentName,
         _environmentNames: data.environmentNames.map((e) => e),
         _colorSchemes: data.colorSchemes.map((e) => {
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
         _customData: deepCopy(data.customData),
         _difficultyBeatmapSets: data.difficulties.reduce((set, d) => {
            let found = set.find((s) => s._beatmapCharacteristicName === d.characteristic);
            if (!found) {
               found = {
                  _beatmapCharacteristicName: d.characteristic,
                  _difficultyBeatmaps: [],
               };
               set.push(found);
            }
            d.authors.mappers.forEach((e) => authorSet.add(e));
            d.authors.lighters.forEach((e) => authorSet.add(e));
            found._difficultyBeatmaps!.push(infoDifficulty.serialize(d));
            return set;
         }, [] as IInfoSet[]),
      };
      d._levelAuthorName = [...authorSet].join(', ');
      return d;
   },
   deserialize(data: DeepPartial<IInfo> = {}): DeepPartial<IWrapInfoAttribute> {
      const d: DeepPartial<IWrapInfoAttribute> = {
         version: 2,
         song: {
            title: data._songName ?? defaultValue._songName,
            subTitle: data._songSubName ?? defaultValue._songSubName,
            author: data._songAuthorName ?? defaultValue._songAuthorName,
         },
         audio: {
            bpm: data._beatsPerMinute ?? defaultValue._beatsPerMinute,
            previewStartTime: data._previewStartTime ?? defaultValue._previewStartTime,
            previewDuration: data._previewDuration ?? defaultValue._previewDuration,
            filename: data._songFilename ?? defaultValue._songFilename,
            audioOffset: data._songTimeOffset ?? defaultValue._songTimeOffset,
            shuffle: data._shuffle ?? defaultValue._shuffle,
            shufflePeriod: data._shufflePeriod ?? defaultValue._shufflePeriod,
         },
         songPreviewFilename: data._songFilename ?? defaultValue._songFilename,
         coverImageFilename: data._coverImageFilename ?? defaultValue._coverImageFilename,
         environmentNames: (data._environmentNames ?? defaultValue._environmentNames).map((e) => e),
         colorSchemes: (data._colorSchemes ?? defaultValue._colorSchemes).map((e) => {
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
         }),
         difficulties: (data._difficultyBeatmapSets ?? defaultValue._difficultyBeatmapSets).flatMap(
            (set) =>
               set._difficultyBeatmaps?.map((diff) => {
                  const m = infoDifficulty.deserialize(diff);
                  m.characteristic = set._beatmapCharacteristicName;
                  m.authors = {
                     mappers: [data._levelAuthorName ?? defaultValue._levelAuthorName],
                     lighters: [data._levelAuthorName ?? defaultValue._levelAuthorName],
                  };
                  return m;
               }),
         ),
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };

      if (!d.environmentNames!.length) {
         d.environmentNames = [data._environmentName, data._allDirectionsEnvironmentName];
         d.difficulties!.forEach((d) => {
            d!.environmentId =
               d!.characteristic === '360Degree' || d!.characteristic === '90Degree' ? 1 : 0;
         });
      }

      return d;
   },
};
