import type { ICustomDataDifficulty as ICustomDataDifficultyV2 } from '../../v2/custom/difficulty.ts';
import type { ICustomDataDifficulty as ICustomDataDifficultyV3 } from '../../v3/custom/difficulty.ts';

export type ICustomDataDifficulty = ICustomDataDifficultyV2 & ICustomDataDifficultyV3;
