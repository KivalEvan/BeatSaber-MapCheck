// deno-lint-ignore-file no-explicit-any
import { optimizeInfo as optimizeV1Info } from '../schema/v1/optimize/info.ts';
import { optimizeInfo as optimizeV2Info } from '../schema/v2/optimize/info.ts';
import { optimizeInfo as optimizeV4Info } from '../schema/v4/optimize/info.ts';
import { optimizeDifficulty as optimizeV1Difficulty } from '../schema/v1/optimize/difficulty.ts';
import { optimizeDifficulty as optimizeV2Difficulty } from '../schema/v2/optimize/difficulty.ts';
import { optimizeDifficulty as optimizeV3Difficulty } from '../schema/v3/optimize/difficulty.ts';
import { optimizeDifficulty as optimizeV4Difficulty } from '../schema/v4/optimize/difficulty.ts';
import { optimizeLightshow as optimizeV3Lightshow } from '../schema/v3/optimize/lightshow.ts';
import { optimizeLightshow as optimizeV4Lightshow } from '../schema/v4/optimize/lightshow.ts';
import type { IOptimizeOptions } from '../../types/beatmap/options/optimize.ts';

export const infoOptimizeMap: Record<number, (data: any, options: IOptimizeOptions) => void> = {
   1: optimizeV1Info,
   2: optimizeV2Info,
   4: optimizeV4Info,
};

export const difficultyOptimizeMap: Record<number, (data: any, options: IOptimizeOptions) => void> =
   {
      1: optimizeV1Difficulty,
      2: optimizeV2Difficulty,
      3: optimizeV3Difficulty,
      4: optimizeV4Difficulty,
   };

export const lightshowOptimizeMap: Record<number, (data: any, options: IOptimizeOptions) => void> =
   {
      3: optimizeV3Lightshow,
      4: optimizeV4Lightshow,
   };
