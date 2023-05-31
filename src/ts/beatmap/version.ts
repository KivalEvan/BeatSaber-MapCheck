// deno-lint-ignore-file no-explicit-any
import { IWrapDifficultyAttribute } from '../types/beatmap/wrapper/difficulty';
import { IDifficulty as IDifficultyV1 } from '../types/beatmap/v1/difficulty';
import { IDifficulty as IDifficultyV2 } from '../types/beatmap/v2/difficulty';
import { IDifficulty as IDifficultyV3 } from '../types/beatmap/v3/difficulty';
import { Difficulty as DifficultyV1 } from './v1/difficulty';
import { Difficulty as DifficultyV2 } from './v2/difficulty';
import { Difficulty as DifficultyV3 } from './v3/difficulty';

export function isV1(data: IWrapDifficultyAttribute): data is DifficultyV1;
export function isV1(data: { [key: string]: any }): data is IDifficultyV1;
export function isV1(data: unknown) {
    return (
        data instanceof DifficultyV1 ||
        (typeof data === 'object' &&
            data != null &&
            '_version' in data &&
            typeof data._version === 'string' &&
            data._version.startsWith('1'))
    );
}

export function isV2(data: IWrapDifficultyAttribute): data is DifficultyV2;
export function isV2(data: { [key: string]: any }): data is IDifficultyV2;
export function isV2(data: unknown) {
    return (
        data instanceof DifficultyV2 ||
        (typeof data === 'object' &&
            data != null &&
            '_version' in data &&
            typeof data._version === 'string' &&
            data._version.startsWith('2'))
    );
}

export function isV3(data: IWrapDifficultyAttribute): data is DifficultyV3;
export function isV3(data: { [key: string]: any }): data is IDifficultyV3;
export function isV3(data: unknown) {
    return (
        data instanceof DifficultyV3 ||
        (typeof data === 'object' &&
            data != null &&
            'version' in data &&
            typeof data.version === 'string' &&
            data.version.startsWith('3'))
    );
}
