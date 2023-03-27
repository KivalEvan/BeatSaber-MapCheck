// deno-lint-ignore-file no-explicit-any
import { IWrapDifficultyAttribute } from '../types/beatmap/wrapper/difficulty';
import { IDifficulty as IDifficultyV2 } from '../types/beatmap/v2/difficulty';
import { IDifficulty as IDifficultyV3 } from '../types/beatmap/v3/difficulty';
import { Difficulty as DifficultyV2 } from './v2/difficulty';
import { Difficulty as DifficultyV3 } from './v3/difficulty';
import { WrapDifficulty } from './wrapper/difficulty';

export function isV2(data: IWrapDifficultyAttribute): data is DifficultyV2;
export function isV2(data: { [key: string]: any }): data is IDifficultyV2;
export function isV2(data: unknown) {
    return data instanceof WrapDifficulty || (typeof data === 'object' && data != null && '_version' in data);
}

export function isV3(data: IWrapDifficultyAttribute): data is DifficultyV3;
export function isV3(data: { [key: string]: any }): data is IDifficultyV3;
export function isV3(data: unknown) {
    return data instanceof WrapDifficulty || (typeof data === 'object' && data != null && 'version' in data);
}
