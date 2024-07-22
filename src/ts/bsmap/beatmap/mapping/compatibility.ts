// deno-lint-ignore-file no-explicit-any
import { compatInfo as compatV1Info } from '../schema/v1/compat/info.ts';
import { compatInfo as compatV2Info } from '../schema/v2/compat/info.ts';
import { compatInfo as compatV4Info } from '../schema/v4/compat/info.ts';
import { compatAudioData as compatV2AudioData } from '../schema/v2/compat/audioData.ts';
import { compatAudioData as compatV4AudioData } from '../schema/v4/compat/audioData.ts';
import { compatDifficulty as compatV1Difficulty } from '../schema/v1/compat/difficulty.ts';
import { compatDifficulty as compatV2Difficulty } from '../schema/v2/compat/difficulty.ts';
import { compatDifficulty as compatV3Difficulty } from '../schema/v3/compat/difficulty.ts';
import { compatDifficulty as compatV4Difficulty } from '../schema/v4/compat/difficulty.ts';
import { compatLightshow as compatV3Lightshow } from '../schema/v3/compat/lightshow.ts';
import { compatLightshow as compatV4Lightshow } from '../schema/v4/compat/lightshow.ts';
import type { ICompatibilityOptions } from '../../types/beatmap/options/compatibility.ts';

export const infoCompatibilityMap: Record<
   number,
   (data: any, options: ICompatibilityOptions) => void
> = {
   1: compatV1Info,
   2: compatV2Info,
   4: compatV4Info,
};

export const audioDataCompatibilityMap: Record<
   number,
   (data: any, options: ICompatibilityOptions) => void
> = {
   2: compatV2AudioData,
   4: compatV4AudioData,
};

export const difficultyCompatibilityMap: Record<
   number,
   (data: any, options: ICompatibilityOptions) => void
> = {
   1: compatV1Difficulty,
   2: compatV2Difficulty,
   3: compatV3Difficulty,
   4: compatV4Difficulty,
};

export const lightshowCompatibilityMap: Record<
   number,
   (data: any, options: ICompatibilityOptions) => void
> = {
   3: compatV3Lightshow,
   4: compatV4Lightshow,
};
