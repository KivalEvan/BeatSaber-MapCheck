import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import { Tool } from '../types/mapcheck/tools/tool';

export default class AnalysisComponent {
    private constructor() {}

    private static getNote = (): Tool[] => {
        return Object.keys(notes).map((key) => notes[key as keyof typeof notes]);
    };

    private static getObstacle = (): Tool[] => {
        return Object.keys(obstacles).map(
            (key) => obstacles[key as keyof typeof obstacles]
        );
    };

    private static getEvent = (): Tool[] => {
        return Object.keys(events).map((key) => events[key as keyof typeof events]);
    };

    private static getOther = (): Tool[] => {
        return Object.keys(others).map((key) => others[key as keyof typeof others]);
    };

    static getGeneral = (): Tool[] => {
        return Object.keys(general).map((key) => general[key as keyof typeof general]);
    };

    static getDifficulty = (): Tool[] => {
        return [
            ...this.getNote(),
            ...this.getObstacle(),
            ...this.getEvent(),
            ...this.getOther(),
        ];
    };

    static getAll = (): Tool[] => {
        return [
            ...this.getNote(),
            ...this.getObstacle(),
            ...this.getEvent(),
            ...this.getOther(),
            ...this.getGeneral(),
        ];
    };
}
