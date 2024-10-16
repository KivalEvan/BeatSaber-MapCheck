import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import { ITool } from '../types/checks/check';

function getNote() {
   return Object.values(notes);
}

function getObstacle(): ITool[] {
   return Object.values(obstacles);
}

function getEvent(): ITool[] {
   return Object.values(events);
}

function getOther(): ITool[] {
   return Object.values(others);
}

function getGeneral(): ITool[] {
   return Object.values(general);
}

export function getComponentsDifficulty(): ITool[] {
   return [...getNote(), ...getObstacle(), ...getEvent(), ...getOther()];
}

export function getComponentsAll(): ITool[] {
   return [...getNote(), ...getObstacle(), ...getEvent(), ...getOther(), ...getGeneral()];
}

export const cachedKeyedComponents = {
   ...notes,
   ...obstacles,
   ...events,
   ...others,
   ...general,
};
