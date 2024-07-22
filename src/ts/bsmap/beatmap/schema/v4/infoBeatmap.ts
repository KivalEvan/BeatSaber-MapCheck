import type { IInfoDifficulty } from '../../../types/beatmap/v4/info.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoBeatmapAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

export const infoBeatmap: ISchemaContainer<IWrapInfoBeatmapAttribute, IInfoDifficulty> = {
   serialize(data: IWrapInfoBeatmapAttribute): IInfoDifficulty {
      return {
         characteristic: data.characteristic,
         difficulty: data.difficulty,
         beatmapAuthors: {
            mappers: [...data.authors.mappers],
            lighters: [...data.authors.lighters],
         },
         environmentNameIdx: data.environmentId,
         beatmapColorSchemeIdx: data.colorSchemeId,
         noteJumpMovementSpeed: data.njs,
         noteJumpStartBeatOffset: data.njsOffset,
         lightshowDataFilename: data.lightshowFilename,
         beatmapDataFilename: data.filename,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: DeepPartial<IInfoDifficulty> = {}): DeepPartial<IWrapInfoBeatmapAttribute> {
      return {
         characteristic: data.characteristic,
         difficulty: data.difficulty,
         authors: {
            mappers: data.beatmapAuthors?.mappers?.map((s) => s),
            lighters: data.beatmapAuthors?.lighters?.map((s) => s),
         },
         filename: data.beatmapDataFilename,
         lightshowFilename: data.lightshowDataFilename,
         njs: data.noteJumpMovementSpeed,
         njsOffset: data.noteJumpStartBeatOffset,
         colorSchemeId: data.beatmapColorSchemeIdx,
         environmentId: data.environmentNameIdx,
         customData: data.customData,
      };
   },
};
