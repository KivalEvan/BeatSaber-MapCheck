import * as v2 from './v2/index';
import * as v3 from './v3/index';
import { clamp } from '../utils';

//TODO: convert ME/NE cut direction
export const toV3 = (
    difficultyData: v2.types.DifficultyData
): v3.types.DifficultyData => {
    const template = v3.template.difficulty();

    difficultyData._notes.forEach((n) => {
        if (v2.note.isBomb(n)) {
            template.bombNotes.push({
                b: n._time,
                x: n._lineIndex,
                y: n._lineLayer,
            });
        }
        if (v2.note.isNote(n)) {
            template.colorNotes.push({
                b: n._time,
                c: n._type as 0 | 1,
                x: n._lineIndex,
                y: n._lineLayer,
                d: clamp(n._cutDirection, 0, 8) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
                a: 0,
            });
        }
    });

    difficultyData._obstacles.forEach((o) =>
        template.obstacles.push({
            b: o._time,
            x: o._lineIndex,
            y: o._type === 2 ? o._lineLayer : o._type ? 2 : 0,
            d: o._duration,
            w: o._width,
            h: o._type === 2 ? o._height : o._type ? 3 : 5,
        })
    );

    difficultyData._events.forEach((e) => {
        template.basicBeatmapEvents.push({
            b: e._time,
            et: e._type,
            i: e._value,
            f: e._floatValue,
        });
    });

    template.useNormalEventsAsCompatibleEvents = true;

    return template;
};
