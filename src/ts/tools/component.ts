import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import * as template from './template';

export const getAll = (): template.Tool[] => {
    const compsNote: template.Tool[] = Object.keys(notes).map(
        (key) => notes[key as keyof typeof notes]
    );
    const compsObstacle: template.Tool[] = Object.keys(obstacles).map(
        (key) => obstacles[key as keyof typeof obstacles]
    );
    const compEvents: template.Tool[] = Object.keys(events).map(
        (key) => events[key as keyof typeof events]
    );
    const compOthers: template.Tool[] = Object.keys(others).map(
        (key) => others[key as keyof typeof others]
    );
    const compGeneral: template.Tool[] = Object.keys(general).map(
        (key) => general[key as keyof typeof general]
    );
    return [...compsNote, ...compsObstacle, ...compEvents, ...compOthers, ...compGeneral];
};
