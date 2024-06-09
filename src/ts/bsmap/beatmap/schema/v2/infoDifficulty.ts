import type { IInfoDifficulty } from '../../../types/beatmap/v2/info.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoBeatmapAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { DifficultyRanking } from '../../shared/difficulty.ts';

const defaultValue = {
   _difficulty: 'Easy',
   _difficultyRank: 1,
   _beatmapFilename: 'UnnamedFile.dat',
   _noteJumpMovementSpeed: 0,
   _noteJumpStartBeatOffset: 0,
   _beatmapColorSchemeIdx: 0,
   _environmentNameIdx: 0,
   _customData: {},
} as Required<IInfoDifficulty>;
export const infoDifficulty: ISchemaContainer<IWrapInfoBeatmapAttribute, IInfoDifficulty> = {
   defaultValue,
   serialize(data: IWrapInfoBeatmapAttribute): IInfoDifficulty {
      return {
         _difficulty: data.difficulty,
         _difficultyRank: DifficultyRanking[data.difficulty],
         _beatmapFilename: data.filename,
         _noteJumpMovementSpeed: data.njs,
         _noteJumpStartBeatOffset: data.njsOffset,
         _beatmapColorSchemeIdx: data.colorSchemeId,
         _environmentNameIdx: data.environmentId,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IInfoDifficulty> = {}): Partial<IWrapInfoBeatmapAttribute> {
      return {
         difficulty: data._difficulty ?? defaultValue._difficulty,
         filename: data._beatmapFilename ?? defaultValue._beatmapFilename,
         njs: data._noteJumpMovementSpeed ?? defaultValue._noteJumpMovementSpeed,
         njsOffset: data._noteJumpStartBeatOffset ?? defaultValue._noteJumpStartBeatOffset,
         colorSchemeId: data._beatmapColorSchemeIdx ?? defaultValue._beatmapColorSchemeIdx,
         environmentId: data._environmentNameIdx ?? defaultValue._environmentNameIdx,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
