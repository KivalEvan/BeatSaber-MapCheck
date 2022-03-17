import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import { Tool } from '../types/mapcheck/tools/template';

const getNote = (): Tool[] => {
    return Object.keys(notes).map((key) => notes[key as keyof typeof notes]);
};

const getObstacle = (): Tool[] => {
    return Object.keys(obstacles).map(
        (key) => obstacles[key as keyof typeof obstacles]
    );
};

const getEvent = (): Tool[] => {
    return Object.keys(events).map((key) => events[key as keyof typeof events]);
};

const getOther = (): Tool[] => {
    return Object.keys(others).map((key) => others[key as keyof typeof others]);
};

export const getGeneral = (): Tool[] => {
    return Object.keys(general).map((key) => general[key as keyof typeof general]);
};

export const getDifficulty = (): Tool[] => {
    return [...getNote(), ...getObstacle(), ...getEvent(), ...getOther()];
};

export const getAll = (): Tool[] => {
    return [
        ...getNote(),
        ...getObstacle(),
        ...getEvent(),
        ...getOther(),
        ...getGeneral(),
    ];
};
