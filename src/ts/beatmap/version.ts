// deno-lint-ignore-file no-explicit-any
import type { IWrapDifficulty } from '../types/beatmap/wrapper/difficulty.ts';
import { Difficulty as V1Difficulty } from './v1/difficulty.ts';
import { Difficulty as V2Difficulty } from './v2/difficulty.ts';
import { Difficulty as V3Difficulty } from './v3/difficulty.ts';
import { Difficulty as V4Difficulty } from './v4/difficulty.ts';
import type { WrapDifficulty } from './wrapper/difficulty.ts';

export function isV1(data: IWrapDifficulty): data is V1Difficulty;
export function isV1(data: WrapDifficulty<Record<string, any>>): data is V1Difficulty;
export function isV1(data: unknown): data is V1Difficulty {
   return data instanceof V1Difficulty;
}

export function isV2(data: IWrapDifficulty): data is V2Difficulty;
export function isV2(data: WrapDifficulty<Record<string, any>>): data is V2Difficulty;
export function isV2(data: unknown): data is V2Difficulty {
   return data instanceof V2Difficulty;
}

export function isV3(data: IWrapDifficulty): data is V3Difficulty;
export function isV3(data: WrapDifficulty<Record<string, any>>): data is V3Difficulty;
export function isV3(data: unknown): data is V3Difficulty {
   return data instanceof V3Difficulty;
}

export function isV4(data: IWrapDifficulty): data is V4Difficulty;
export function isV4(data: WrapDifficulty<Record<string, any>>): data is V4Difficulty;
export function isV4(data: unknown): data is V4Difficulty {
   return data instanceof V4Difficulty;
}
