import type { IInfoDifficulty } from '../../../types/beatmap/v4/info.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoBeatmapAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
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
} as Required<IInfoDifficulty>;
export const infoDifficulty: ISchemaContainer<IWrapInfoBeatmapAttribute, IInfoDifficulty> = {
   defaultValue,
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
         characteristic: data.characteristic ?? defaultValue.characteristic,
         difficulty: data.difficulty ?? defaultValue.difficulty,
         authors: {
            mappers: (data.beatmapAuthors?.mappers ?? defaultValue.beatmapAuthors.mappers).map(
               (s) => s,
            ),
            lighters: (data.beatmapAuthors?.lighters ?? defaultValue.beatmapAuthors.lighters).map(
               (s) => s,
            ),
         },
         filename: data.beatmapDataFilename ?? defaultValue.beatmapDataFilename,
         lightshowFilename: data.lightshowDataFilename ?? defaultValue.lightshowDataFilename,
         njs: data.noteJumpMovementSpeed ?? defaultValue.noteJumpMovementSpeed,
         njsOffset: data.noteJumpStartBeatOffset ?? defaultValue.noteJumpStartBeatOffset,
         colorSchemeId: data.beatmapColorSchemeIdx ?? defaultValue.beatmapColorSchemeIdx,
         environmentId: data.environmentNameIdx ?? defaultValue.environmentNameIdx,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
