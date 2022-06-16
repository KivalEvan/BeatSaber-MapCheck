import { IDifficultyData } from '../../types/beatmap/v2/difficulty';
import { DifficultyData } from './difficulty';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyDataCheck } from './dataCheck';
import Logger from '../../logger';

const tag = (name: string) => {
    return `[v2::parse::${name}]`;
};

export function difficulty(data: IDifficultyData): DifficultyData {
    Logger.info(tag('difficulty'), 'Parsing beatmap difficulty v2.x.x');
    if (!data._version?.startsWith('2')) {
        Logger.warn(tag('difficulty'), 'Unidentified beatmap version');
        data._version = '2.0.0';
    }
    deepCheck(data, DifficultyDataCheck, 'difficulty', data._version);

    // haha why do i have to do this, beat games
    data._notes = data._notes ?? [];
    data._sliders = data._sliders ?? [];
    data._obstacles = data._obstacles ?? [];
    data._events = data._events ?? [];
    data._waypoints = data._waypoints ?? [];

    data._notes.sort((a, b) => a._time - b._time);
    data._sliders.sort((a, b) => a._headTime - b._headTime);
    data._obstacles.sort((a, b) => a._time - b._time);
    data._events.sort((a, b) => a._time - b._time);
    data._waypoints.sort((a, b) => a._time - b._time);

    return DifficultyData.create(data);
}
