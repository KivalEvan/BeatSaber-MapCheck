import type { IInfo } from '../../../types/beatmap/v1/info.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { infoDifficulty } from './infoDifficulty.ts';
import type { EnvironmentName } from '../../../types/beatmap/shared/environment.ts';

export const info: ISchemaContainer<IWrapInfoAttribute, IInfo> = {
   serialize(data: IWrapInfoAttribute): IInfo {
      return {
         songName: data.song.title,
         songSubName: data.song.subTitle,
         authorName: data.song.author,
         beatsPerMinute: data.audio.bpm,
         previewStartTime: data.audio.previewStartTime,
         previewDuration: data.audio.previewDuration,
         coverImagePath: data.coverImageFilename,
         environmentName: data.environmentNames[0] as EnvironmentName,
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
            title: data.songName,
            subTitle: data.songSubName,
            author: data.authorName,
         },
         audio: {
            filename: data.difficultyLevels?.find((e) => e?.audioPath)?.audioPath,
            bpm: data.beatsPerMinute,
            previewStartTime: data.previewStartTime,
            previewDuration: data.previewDuration,
         },
         songPreviewFilename: data.difficultyLevels?.find((e) => e?.audioPath)?.audioPath,
         coverImageFilename: data.coverImagePath,
         environmentNames: [data.environmentName],

         difficulties: data.difficultyLevels?.map(infoDifficulty.deserialize),

         customData: {
            _contributors: data.contributors,
            _customEnvironment: data.customEnvironment,
            _customEnvironmentHash: data.customEnvironmentHash,
         },
      };
   },
};
