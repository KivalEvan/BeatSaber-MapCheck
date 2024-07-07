import type { IInfoDifficulty } from '../../../types/beatmap/v2/info.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapInfoBeatmapAttribute } from '../../../types/beatmap/wrapper/info.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { DifficultyRanking } from '../../shared/difficulty.ts';

export const infoDifficulty: ISchemaContainer<IWrapInfoBeatmapAttribute, IInfoDifficulty> = {
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
         difficulty: data._difficulty,
         filename: data._beatmapFilename,
         njs: data._noteJumpMovementSpeed,
         njsOffset: data._noteJumpStartBeatOffset,
         colorSchemeId: data._beatmapColorSchemeIdx,
         environmentId: data._environmentNameIdx,
         customData: data._customData,
      };
   },
};
