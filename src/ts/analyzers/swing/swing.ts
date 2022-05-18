import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { ISwingContainer } from '../../types/mapcheck/analyzers/swing';
import { ColorNote } from '../../beatmap/v3/colorNote';
import { NoteContainer } from '../../types/beatmap/v3/container';

export default class Swing implements ISwingContainer {
    time: number;
    duration: number;
    minSwing: number;
    maxSwing: number;
    ebpm: number;
    ebpmSwing: number;
    data: NoteContainer[];

    private constructor() {}

    static create() {
        return new this();
    }

    // Thanks Qwasyx#3000 for improved swing detection
    static next = (
        currNote: ColorNote,
        prevNote: ColorNote,
        bpm: BeatPerMinute,
        context?: NoteContainer[]
    ): boolean => {
        if (
            context &&
            context.length > 0 &&
            bpm.toRealTime(prevNote.time) + 0.005 < bpm.toRealTime(currNote.time) &&
            currNote.direction !== 8
        ) {
            for (const n of context) {
                if (n.type === 'note') {
                    if (
                        n.data.direction !== 8 &&
                        ColorNote.checkDirection(currNote, n.data, 90, false)
                    ) {
                        return true;
                    }
                }
            }
        }
        if (context && context.length > 0) {
            for (const other of context) {
                if (other.type === 'note' && currNote.isInline(other.data)) {
                    return true;
                }
            }
        }
        return (
            (currNote.isWindow(prevNote) &&
                bpm.toRealTime(currNote.time - prevNote.time) > 0.08) ||
            bpm.toRealTime(currNote.time - prevNote.time) > 0.07
        );
    };
}
