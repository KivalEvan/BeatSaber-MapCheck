import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Difficulty } from './difficulty';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyCheck } from './dataCheck';
import logger from '../../logger';
import { IBaseObject } from '../../types/beatmap/v2/object';

const tag = (name: string) => {
    return `[v2::parse::${name}]`;
};

const sortObjectTime = (a: IBaseObject, b: IBaseObject) => a._time - b._time;

export function difficulty(
    data: Partial<IDifficulty>,
    checkData: {
        enable: boolean;
        throwError?: boolean;
    } = { enable: true, throwError: true },
): Difficulty {
    logger.info(tag('difficulty'), 'Parsing beatmap difficulty v2.x.x');
    if (!data._version?.startsWith('2')) {
        logger.warn(tag('difficulty'), 'Unidentified beatmap version');
        data._version = '2.0.0';
    }
    if (checkData.enable) {
        deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
    }

    // haha why do i have to do this, beat games
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

    return Difficulty.create(data);
}
