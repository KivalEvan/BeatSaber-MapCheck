import { BaseObject } from '../../beatmap/v3/baseObject';
import { IBaseObject } from '../../types/beatmap/v3';
import { ISwingContainer } from '../../types/mapcheck/analyzers/swing';

export const calcEBPMBetweenObject = <T extends IBaseObject, U extends IBaseObject>(
    currObj: BaseObject<T>,
    prevObj: BaseObject<U>,
    bpm: number
): number => {
    return bpm / ((currObj.time - prevObj.time) * 2);
};

export const getEffectiveBPMNote = (
    swings: ISwingContainer[],
    bpm: number
): NoteEBPM[] => {
    const noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = swings.length; i < len; i++) {
        const note: NoteEBPM = deepCopy(swings[i]) as NoteEBPM;
        if (lastNote[note.color]) {
            if (next(note, lastNote[note.color], bpm, swingNoteArray[note.color])) {
                note._ebpm = calcEBPMBetweenObject(note, lastNote[note.color], bpm);
                noteEBPM.push(note);
                swingNoteArray[note.color] = [];
            }
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(note);
    }
    return noteEBPM;
};

export const getEffectiveBPMSwingNote = (
    swings: ISwingContainer[],
    bpm: number
): NoteEBPM[] => {
    const noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = swings.length; i < len; i++) {
        const note: NoteEBPM = deepCopy(swings[i]) as NoteEBPM;
        if (lastNote[note.color]) {
            if (next(note, lastNote[note.color], bpm, swingNoteArray[note.color])) {
                note._ebpm = calcEBPMBetweenObject(note, lastNote[note.color], bpm);
                noteEBPM.push(note);
                lastNote[note.color] = note;
                swingNoteArray[note.color] = [];
            }
        } else {
            lastNote[note.color] = note;
        }
        swingNoteArray[note.color].push(note);
    }
    return noteEBPM;
};

export const getMaxEffectiveBPM = (notes: ColorNote[], bpm: number): number => {
    return Math.max(...this.getEffectiveBPMNote(notes, bpm).map((n) => n._ebpm), 0);
};

export const getMaxEffectiveBPMSwing = (notes: ColorNote[], bpm: number): number => {
    return Math.max(...getEffectiveBPMSwingNote(notes, bpm).map((n) => n._ebpm), 0);
};
