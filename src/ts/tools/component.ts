import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import * as template from './template';

const getNote = (): template.Tool[] => {
    return Object.keys(notes).map((key) => notes[key as keyof typeof notes]);
};

const getObstacle = (): template.Tool[] => {
    return Object.keys(obstacles).map((key) => obstacles[key as keyof typeof obstacles]);
};

const getEvent = (): template.Tool[] => {
    return Object.keys(events).map((key) => events[key as keyof typeof events]);
};

const getOther = (): template.Tool[] => {
    return Object.keys(others).map((key) => others[key as keyof typeof others]);
};

export const getGeneral = (): template.Tool[] => {
    return Object.keys(general).map((key) => general[key as keyof typeof general]);
};

export const getDifficulty = (): template.Tool[] => {
    return [...getNote(), ...getObstacle(), ...getEvent(), ...getOther()];
};

export const getAll = (): template.Tool[] => {
    return [...getNote(), ...getObstacle(), ...getEvent(), ...getOther(), ...getGeneral()];
};
