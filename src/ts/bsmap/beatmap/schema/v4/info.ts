import type { IInfo, IInfoDifficulty } from '../../../types/beatmap/v4/info.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type {
   IWrapInfoAttribute,
   IWrapInfoColorScheme,
} from '../../../types/beatmap/wrapper/info.ts';
import { hexToRgba, toColorObject } from '../../../utils/colors.ts';
import { colorToHex } from '../../../utils/colors.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { infoDifficulty } from './infoBeatmap.ts';

const defaultValue = {
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
} as DeepRequiredIgnore<IInfo, 'customData'>;
export const info: ISchemaContainer<IWrapInfoAttribute, IInfo> = {
   defaultValue,
   serialize(data: IWrapInfoAttribute): IInfo {
      return {
         version: '4.0.0',
         song: {
            author: data.song.author,
            title: data.song.title,
            subTitle: data.song.subTitle,
         },
         audio: {
            songFilename: data.audio.filename,
            songDuration: data.audio.duration,
            audioDataFilename: data.audio.audioDataFilename,
            bpm: data.audio.bpm,
            lufs: data.audio.lufs,
            previewStartTime: data.audio.previewStartTime,
            previewDuration: data.audio.previewDuration,
         },
         songPreviewFilename: data.songPreviewFilename,
         coverImageFilename: data.coverImageFilename,
         environmentNames: data.environmentNames.map((e) => e),
         colorSchemes: data.colorSchemes.map((e) => {
            const cs: Required<IInfo>['colorSchemes'][number] = {
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
         difficultyBeatmaps: data.difficulties.map(infoDifficulty.serialize),
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: DeepPartial<IInfo> = {}): DeepPartial<IWrapInfoAttribute> {
      return {
         version: 4,
         song: {
            author: data.song?.author ?? defaultValue.song.author,
            title: data.song?.title ?? defaultValue.song.title,
            subTitle: data.song?.subTitle ?? defaultValue.song.subTitle,
         },
         audio: {
            filename: data.audio?.songFilename ?? defaultValue.audio.songFilename,
            duration: data.audio?.songDuration ?? defaultValue.audio.songDuration,
            audioDataFilename:
               data.audio?.audioDataFilename ?? defaultValue.audio.audioDataFilename,
            bpm: data.audio?.bpm ?? defaultValue.audio.bpm,
            lufs: data.audio?.lufs ?? defaultValue.audio.lufs,
            previewStartTime: data.audio?.previewStartTime ?? defaultValue.audio.previewStartTime,
            previewDuration: data.audio?.previewDuration ?? defaultValue.audio.previewDuration,
         },
         songPreviewFilename: data.songPreviewFilename ?? defaultValue.songPreviewFilename,
         coverImageFilename: data.coverImageFilename ?? defaultValue.coverImageFilename,
         environmentNames: (data.environmentNames ?? defaultValue.environmentNames).map((e) => e!),
         colorSchemes: (data.colorSchemes ?? defaultValue.colorSchemes).map((e) => {
            e = e!;
            const scheme: IWrapInfoColorScheme = {
               useOverride: true,
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
         }),
         difficulties: (data.difficultyBeatmaps ?? []).map((d) =>
            infoDifficulty.deserialize(d as IInfoDifficulty),
         ),
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
