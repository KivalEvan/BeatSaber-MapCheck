import { IWrapBombNote } from '../../types/beatmap/wrapper/bombNote';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';
import { IWrapBaseSlider } from '../../types/beatmap/wrapper/baseSlider';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import { ICountNote, ICountStatsNote } from './types/stats';

/** Count number of red, blue, and bomb notes with their properties in given array and return a note count object.
 * ```ts
 * const list = count(notes);
 * console.log(list);
 * ```
 */
export function countNote(notes: (IWrapColorNote | IWrapBaseSlider)[]): ICountNote {
    const noteCount: ICountNote = {
        red: {
            total: 0,
            chroma: 0,
            noodleExtensions: 0,
            mappingExtensions: 0,
        },
        blue: {
            total: 0,
            chroma: 0,
            noodleExtensions: 0,
            mappingExtensions: 0,
        },
    };
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i].color === 0) {
            noteCount.red.total++;
            if (notes[i].isChroma()) {
                noteCount.red.chroma++;
            }
            if (notes[i].isNoodleExtensions()) {
                noteCount.red.noodleExtensions++;
            }
            if (notes[i].isMappingExtensions()) {
                noteCount.red.mappingExtensions++;
            }
        } else if (notes[i].color === 1) {
            noteCount.blue.total++;
            if (notes[i].isChroma()) {
                noteCount.blue.chroma++;
            }
            if (notes[i].isNoodleExtensions()) {
                noteCount.blue.noodleExtensions++;
            }
            if (notes[i].isMappingExtensions()) {
                noteCount.blue.mappingExtensions++;
            }
        }
    }
    return noteCount;
}

export function countBomb(bombs: IWrapBombNote[]): ICountStatsNote {
    const bombCount: ICountStatsNote = {
        total: 0,
        chroma: 0,
        noodleExtensions: 0,
        mappingExtensions: 0,
    };
    for (let i = bombs.length - 1; i >= 0; i--) {
        bombCount.total++;
        if (bombs[i].isChroma()) {
            bombCount.chroma++;
        }
        if (bombs[i].isNoodleExtensions()) {
            bombCount.noodleExtensions++;
        }
        if (bombs[i].isMappingExtensions()) {
            bombCount.mappingExtensions++;
        }
    }
    return bombCount;
}

/** Count number of specified line index in a given array and return a counted number of line index.
 * ```ts
 * const xCount = countX(notes, 0);
 * ```
 */
export function countX(notes: NoteContainer[], x: number): number {
    return notes.filter((n) => n.data.posX === x).length;
}

/** Count number of specified line layer in a given array and return a counted number of line layer.
 * ```ts
 * const yCount = countY(notes, 0);
 * ```
 */
export function countY(notes: NoteContainer[], y: number): number {
    return notes.filter((n) => n.data.posY === y).length;
}

/** Count number of specified line index and line layer in a given array and return a counted number of line index and line layer.
 * ```ts
 * const xyCount = countXY(notes, 0, 0);
 * ```
 */
export function countXY(notes: NoteContainer[], x: number, y: number): number {
    return notes.filter((n) => n.data.posX === x && n.data.posY === y).length;
}

/** Count number of specified `_cutDirection` in a given array and return a counted number of `_cutDirection`.
 * ```ts
 * const cdCount = countDirection(notes, 0);
 * ```
 */
export function countDirection(notes: NoteContainer[], cd: number): number {
    return notes.filter((n) => n.type !== 'bomb' && n.data.direction === cd).length;
}

/** Count number of specified angle in a given array and return a counted number of angle.
 * ```ts
 * const angleCount = countAngle(notes, 0);
 * ```
 */
export function countAngle(notes: NoteContainer[], angle: number): number {
    return notes.filter((n) => n.type !== 'bomb' && n.data.getAngle() === angle).length;
}

/** Calculate note per second.
 * ```ts
 * const nps = nps(notes, 10);
 * ```
 */
export function nps(notes: IWrapColorNote[], duration: number): number {
    return duration ? notes.length / duration : 0;
}

/** Calculate the peak by rolling average.
 * ```ts
 * const peakNPS = peak(notes, 10, BPM ?? 128);
 * ```
 */
export function peak(notes: IWrapColorNote[], beat: number, bpm: number): number {
    let peakNPS = 0;
    let currentSectionStart = 0;

    for (let i = 0; i < notes.length; i++) {
        while (notes[i].time - notes[currentSectionStart].time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(peakNPS, (i - currentSectionStart + 1) / ((beat / bpm) * 60));
    }

    return peakNPS;
}
