// deno-lint-ignore-file no-explicit-any
import { IWrapDifficultyAttribute } from '../types/beatmap/wrapper/difficulty';
import { IDifficulty as IV1Difficulty } from '../types/beatmap/v1/difficulty';
import { IDifficulty as IV2Difficulty } from '../types/beatmap/v2/difficulty';
import { IDifficulty as IV3Difficulty } from '../types/beatmap/v3/difficulty';
import { Difficulty as V1Difficulty } from './v1/difficulty';
import { Difficulty as V2Difficulty } from './v2/difficulty';
import { Difficulty as V3Difficulty } from './v3/difficulty';

export function isV1(data: IWrapDifficultyAttribute): data is V1Difficulty;
export function isV1(data: { [key: string]: any }): data is IV1Difficulty;
export function isV1(data: unknown) {
   return (
      data instanceof V1Difficulty ||
      (typeof data === 'object' &&
         data != null &&
         '_version' in data &&
         typeof data._version === 'string' &&
         data._version.startsWith('1'))
   );
}

export function isV2(data: IWrapDifficultyAttribute): data is V2Difficulty;
export function isV2(data: { [key: string]: any }): data is IV2Difficulty;
export function isV2(data: unknown) {
   return (
      data instanceof V2Difficulty ||
      (typeof data === 'object' &&
         data != null &&
         '_version' in data &&
         typeof data._version === 'string' &&
         data._version.startsWith('2'))
   );
}

export function isV3(data: IWrapDifficultyAttribute): data is V3Difficulty;
export function isV3(data: { [key: string]: any }): data is IV3Difficulty;
export function isV3(data: unknown) {
   return (
      data instanceof V3Difficulty ||
      (typeof data === 'object' &&
         data != null &&
         'version' in data &&
         typeof data.version === 'string' &&
         data.version.startsWith('3'))
   );
}
