import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Difficulty } from './difficulty';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyCheck } from './dataCheck';
import logger from '../../logger';
import { IBaseObject } from '../../types/beatmap/v2/object';

function tag(name: string): string[] {
    return ['v2', 'parse', name];
}

const sortObjectTime = (a: IBaseObject, b: IBaseObject) => a._time - b._time;

export function difficulty(
    data: Partial<IDifficulty>,
    checkData: {
        enabled: boolean;
        throwError?: boolean;
    } = { enabled: true, throwError: true },
): Difficulty {
    logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v2.x.x');
    if (!data._version?.startsWith('2')) {
        logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
        data._version = '2.0.0';
    }
    if (checkData.enabled) {
        deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
    }

    data._notes = data._notes ?? [];
    data._sliders = data._sliders ?? [];
    data._obstacles = data._obstacles ?? [];
    data._events = data._events ?? [];
    data._waypoints = data._waypoints ?? [];

    data._notes.sort(sortObjectTime);
    data._sliders.sort((a, b) => a._headTime - b._headTime);
    data._obstacles.sort(sortObjectTime);
    data._events.sort(sortObjectTime);
    data._waypoints.sort(sortObjectTime);

    return new Difficulty(data);
}
