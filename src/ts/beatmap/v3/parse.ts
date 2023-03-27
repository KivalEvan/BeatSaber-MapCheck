import { IBaseObject } from '../../types/beatmap/v3/baseObject';
import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { Difficulty } from './difficulty';
import { DifficultyCheck } from './dataCheck';
import { deepCheck } from '../shared/dataCheck';
import logger from '../../logger';
import { IEvent } from '../../types/beatmap/v2/event';

const tag = (name: string) => {
    return `[v3::parse::${name}]`;
};

const sortObjectTime = (a: IBaseObject, b: IBaseObject) => a.b - b.b;

// temporary fix to CM error
export function conversionFix(data: Partial<IDifficulty>) {
    if (data.basicBeatmapEvents) {
        data.basicBeatmapEvents = data.basicBeatmapEvents.map((ev) => {
            if ('_time' in ev) {
                const oldEv = ev as unknown as IEvent;
                return {
                    b: oldEv._time,
                    et: oldEv._type,
                    i: oldEv._value,
                    f: oldEv._floatValue ?? 1,
                    customData: oldEv._customData,
                };
            }
            return ev;
        });
    }
}

export function difficulty(
    data: Partial<IDifficulty>,
    checkData: {
        enable: boolean;
        throwError?: boolean;
    } = { enable: true, throwError: true },
): Difficulty {
    logger.info(tag('difficulty'), 'Parsing beatmap difficulty v3.x.x');
    if (!(data.version === '3.0.0' || data.version === '3.1.0' || data.version === '3.2.0')) {
        logger.warn(tag('difficulty'), 'Unidentified beatmap version');
        data.version = '3.0.0';
    }
    conversionFix(data);
    if (checkData.enable) {
        deepCheck(data, DifficultyCheck, 'difficulty', data.version, checkData.throwError);
    }

    // haha why do i have to do this, beat games
    data.bpmEvents = data.bpmEvents ?? [];
    data.rotationEvents = data.rotationEvents ?? [];
    data.colorNotes = data.colorNotes ?? [];
    data.bombNotes = data.bombNotes ?? [];
    data.obstacles = data.obstacles ?? [];
    data.sliders = data.sliders ?? [];
    data.burstSliders = data.burstSliders ?? [];
    data.waypoints = data.waypoints ?? [];
    data.basicBeatmapEvents = data.basicBeatmapEvents ?? [];
    data.colorBoostBeatmapEvents = data.colorBoostBeatmapEvents ?? [];
    data.lightColorEventBoxGroups = data.lightColorEventBoxGroups ?? [];
    data.lightRotationEventBoxGroups = data.lightRotationEventBoxGroups ?? [];
    data.lightTranslationEventBoxGroups = data.lightTranslationEventBoxGroups ?? [];

    data.bpmEvents.sort(sortObjectTime);
    data.rotationEvents.sort(sortObjectTime);
    data.colorNotes.sort(sortObjectTime);
    data.bombNotes.sort(sortObjectTime);
    data.obstacles.sort(sortObjectTime);
    data.sliders.sort(sortObjectTime);
    data.burstSliders.sort(sortObjectTime);
    data.waypoints.sort(sortObjectTime);
    data.basicBeatmapEvents.sort(sortObjectTime);
    data.colorBoostBeatmapEvents.sort(sortObjectTime);
    data.lightColorEventBoxGroups.sort(sortObjectTime);
    data.lightRotationEventBoxGroups.sort(sortObjectTime);

    return Difficulty.create(data);
}
