import { IDifficulty } from '../../types/beatmap/v1/difficulty';
import { Difficulty } from './difficulty';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyCheck } from './dataCheck';
import logger from '../../logger';
import { IBaseObject } from '../../types/beatmap/v1/object';

function tag(name: string): string[] {
    return ['v1', 'parse', name];
}

const sortObjectTime = (a: IBaseObject, b: IBaseObject) => a._time - b._time;

export function difficulty(
    data: Partial<IDifficulty>,
    checkData: {
        enabled: boolean;
        throwError?: boolean;
    } = { enabled: true, throwError: true },
): Difficulty {
    logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v1.x.x');
    if (!data._version?.startsWith('1')) {
        logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
        data._version = '1.5.0';
    }
    if (checkData.enabled) {
        deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
    }

    data._notes = data._notes ?? [];
    data._obstacles = data._obstacles ?? [];
    data._events = data._events ?? [];

    data._notes.sort(sortObjectTime);
    data._obstacles.sort(sortObjectTime);
    data._events.sort(sortObjectTime);

    return new Difficulty(data);
}
