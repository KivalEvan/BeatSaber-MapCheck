import type { IInfo } from '../../../types/beatmap/v1/info.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { infoDifficulty } from './infoDifficulty.ts';
import type { EnvironmentName } from '../../../types/beatmap/shared/environment.ts';

const defaultValue = {
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
} as Required<IInfo>;
export const info: ISchemaContainer<IWrapInfoAttribute, IInfo> = {
   defaultValue,
   serialize(data: IWrapInfoAttribute): IInfo {
      return {
         songName: data.song.title,
         songSubName: data.song.subTitle,
         authorName: data.song.author,
         beatsPerMinute: data.audio.bpm,
         previewStartTime: data.audio.previewStartTime,
         previewDuration: data.audio.previewDuration,
         coverImagePath: data.coverImageFilename,
         environmentName:
            (data.environmentNames[0] as EnvironmentName) ?? defaultValue.environmentName,
         difficultyLevels: data.difficulties.map(infoDifficulty.serialize),
         oneSaber: data.difficulties.some((m) => m.characteristic === 'OneSaber'),
         contributors: deepCopy(data.customData._contributors),
         customEnvironment: data.customData._customEnvironment,
         customEnvironmentHash: data.customData._customEnvironmentHash,
      };
   },
   deserialize(data: DeepPartial<IInfo> = {}): DeepPartial<IWrapInfoAttribute> {
      return {
         version: 1,
         song: {
            title: data.songName ?? defaultValue.songName,
            subTitle: data.songSubName ?? defaultValue.songSubName,
            author: data.authorName ?? defaultValue.authorName,
         },
         audio: {
            filename: (data.difficultyLevels ?? defaultValue.difficultyLevels).find(
               (e) => e?.audioPath,
            )?.audioPath,
            bpm: data.beatsPerMinute ?? defaultValue.beatsPerMinute,
            previewStartTime: data.previewStartTime ?? defaultValue.previewStartTime,
            previewDuration: data.previewDuration ?? defaultValue.previewDuration,
         },
         songPreviewFilename: (data.difficultyLevels ?? defaultValue.difficultyLevels).find(
            (e) => e?.audioPath,
         )?.audioPath,
         coverImageFilename: data.coverImagePath ?? defaultValue.coverImagePath,
         environmentNames: [data.environmentName ?? defaultValue.environmentName],

         difficulties: (data.difficultyLevels ?? defaultValue.difficultyLevels).map(
            infoDifficulty.deserialize,
         ),

         customData: {
            _contributors: deepCopy(data.contributors ?? defaultValue.contributors),
            _customEnvironment: data.customEnvironment ?? defaultValue.customEnvironment,
            _customEnvironmentHash:
               data.customEnvironmentHash ?? defaultValue.customEnvironmentHash,
         },
      };
   },
};
