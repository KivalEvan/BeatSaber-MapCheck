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
import { infoBeatmap } from './infoBeatmap.ts';
import { is360Environment } from '../../helpers/environment.ts';

export const info: ISchemaContainer<IWrapInfoAttribute, IInfo> = {
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
            data.environmentBase.normal ||
            (data.environmentNames.find((e) => !is360Environment(e)) as EnvironmentName &
               EnvironmentV3Name) ||
            'DefaultEnvironment',
         _allDirectionsEnvironmentName:
            data.environmentBase.allDirections ||
            (data.environmentNames.find((e) => is360Environment(e)) as Environment360Name) ||
            'GlassDesertEnvironment',
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
            found._difficultyBeatmaps!.push(infoBeatmap.serialize(d));
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
            title: data._songName,
            subTitle: data._songSubName,
            author: data._songAuthorName,
         },
         audio: {
            bpm: data._beatsPerMinute,
            previewStartTime: data._previewStartTime,
            previewDuration: data._previewDuration,
            filename: data._songFilename,
            audioOffset: data._songTimeOffset,
            shuffle: data._shuffle,
            shufflePeriod: data._shufflePeriod,
         },
         songPreviewFilename: data._songFilename,
         coverImageFilename: data._coverImageFilename,
         environmentBase: {
            normal: data._environmentName,
            allDirections: data._allDirectionsEnvironmentName,
         },
         environmentNames: data._environmentNames?.map((e) => e),
         colorSchemes: data._colorSchemes?.map((e) => {
            const scheme: DeepPartial<IWrapInfoColorScheme> = {
               useOverride: !!e.useOverride,
               name: e.colorScheme?.colorSchemeId,
               saberLeftColor: {
                  r: e.colorScheme?.saberAColor?.r,
                  g: e.colorScheme?.saberAColor?.g,
                  b: e.colorScheme?.saberAColor?.b,
                  a: e.colorScheme?.saberAColor?.a,
               },
               saberRightColor: {
                  r: e.colorScheme?.saberBColor?.r,
                  g: e.colorScheme?.saberBColor?.g,
                  b: e.colorScheme?.saberBColor?.b,
                  a: e.colorScheme?.saberBColor?.a,
               },
               environment0Color: {
                  r: e.colorScheme?.environmentColor0?.r,
                  g: e.colorScheme?.environmentColor0?.g,
                  b: e.colorScheme?.environmentColor0?.b,
                  a: e.colorScheme?.environmentColor0?.a,
               },
               environment1Color: {
                  r: e.colorScheme?.environmentColor1?.r,
                  g: e.colorScheme?.environmentColor1?.g,
                  b: e.colorScheme?.environmentColor1?.b,
                  a: e.colorScheme?.environmentColor1?.a,
               },
               obstaclesColor: {
                  r: e.colorScheme?.obstaclesColor?.r,
                  g: e.colorScheme?.obstaclesColor?.g,
                  b: e.colorScheme?.obstaclesColor?.b,
                  a: e.colorScheme?.obstaclesColor?.a,
               },
               environment0ColorBoost: {
                  r: e.colorScheme?.environmentColor0Boost?.r,
                  g: e.colorScheme?.environmentColor0Boost?.g,
                  b: e.colorScheme?.environmentColor0Boost?.b,
                  a: e.colorScheme?.environmentColor0Boost?.a,
               },
               environment1ColorBoost: {
                  r: e.colorScheme?.environmentColor1Boost?.r,
                  g: e.colorScheme?.environmentColor1Boost?.g,
                  b: e.colorScheme?.environmentColor1Boost?.b,
                  a: e.colorScheme?.environmentColor1Boost?.a,
               },
            };
            if (e.colorScheme?.environmentColorW) {
               scheme.environmentWColor = {
                  r: e.colorScheme?.environmentColorW?.r,
                  g: e.colorScheme?.environmentColorW?.g,
                  b: e.colorScheme?.environmentColorW?.b,
                  a: e.colorScheme?.environmentColorW?.a,
               };
            }
            if (e.colorScheme?.environmentColorWBoost) {
               scheme.environmentWColorBoost = {
                  r: e.colorScheme?.environmentColorWBoost?.r,
                  g: e.colorScheme?.environmentColorWBoost?.g,
                  b: e.colorScheme?.environmentColorWBoost?.b,
                  a: e.colorScheme?.environmentColorWBoost?.a,
               };
            }
            return scheme;
         }),
         difficulties: data._difficultyBeatmapSets?.flatMap((set) =>
            set._difficultyBeatmaps?.map((diff) => {
               const m = infoBeatmap.deserialize(diff);
               m.characteristic = set._beatmapCharacteristicName;
               m.authors = {
                  mappers: [data._levelAuthorName],
               };
               return m;
            }),
         ),
         customData: data._customData,
      };

      return d;
   },
};
