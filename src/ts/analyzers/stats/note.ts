import { BombNote } from '../../beatmap/v3';
import { BaseSlider } from '../../beatmap/v3/baseSlider';
import { ColorNote } from '../../beatmap/v3/colorNote';
import { IBaseSlider } from '../../types/beatmap/v3';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { ICountNote, ICountStatsNote } from '../../types/mapcheck/analyzers/stats';

/** Count number of red, blue, and bomb notes with their properties in given array and return a note count object.
 * ```ts
 * const list = count(notes);
 * console.log(list);
 * ```
 */
export const countNote = (
    notes: (ColorNote | BaseSlider<IBaseSlider>)[]
): ICountNote => {
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
            if (notes[i].hasChroma()) {
                noteCount.red.chroma++;
            }
            if (notes[i].hasNoodleExtensions()) {
                noteCount.red.noodleExtensions++;
            }
            if (notes[i].hasMappingExtensions()) {
                noteCount.red.mappingExtensions++;
            }
        } else if (notes[i].color === 1) {
            noteCount.blue.total++;
            if (notes[i].hasChroma()) {
                noteCount.blue.chroma++;
            }
            if (notes[i].hasNoodleExtensions()) {
                noteCount.blue.noodleExtensions++;
            }
            if (notes[i].hasMappingExtensions()) {
                noteCount.blue.mappingExtensions++;
            }
        }
    }
    return noteCount;
};

export const countBomb = (bombs: BombNote[]): ICountStatsNote => {
    const bombCount: ICountStatsNote = {
        total: 0,
        chroma: 0,
        noodleExtensions: 0,
        mappingExtensions: 0,
    };
    for (let i = bombs.length - 1; i >= 0; i--) {
        bombCount.total++;
        if (bombs[i].hasChroma()) {
            bombCount.chroma++;
        }
        if (bombs[i].hasNoodleExtensions()) {
            bombCount.noodleExtensions++;
        }
        if (bombs[i].hasMappingExtensions()) {
            bombCount.mappingExtensions++;
        }
    }
    return bombCount;
};

/** Count number of specified line index in a given array and return a counted number of line index.
 * ```ts
 * const xCount = countX(notes, 0);
 * ```
 */
export const countX = (notes: NoteContainer[], x: number): number => {
    return notes.filter((n) => n.data.posX === x).length;
};

/** Count number of specified line layer in a given array and return a counted number of line layer.
 * ```ts
 * const yCount = countY(notes, 0);
 * ```
 */
export const countY = (notes: NoteContainer[], y: number): number => {
    return notes.filter((n) => n.data.posY === y).length;
};

/** Count number of specified line index and line layer in a given array and return a counted number of line index and line layer.
 * ```ts
 * const xyCount = countXY(notes, 0, 0);
 * ```
 */
export const countXY = (notes: NoteContainer[], x: number, y: number): number => {
    return notes.filter((n) => n.data.posX === x && n.data.posY === y).length;
};

/** Count number of specified `_cutDirection` in a given array and return a counted number of `_cutDirection`.
 * ```ts
 * const cdCount = countDirection(notes, 0);
 * ```
 */
export const countDirection = (notes: NoteContainer[], cd: number): number => {
    return notes.filter((n) => n.type !== 'bomb' && n.data.direction === cd).length;
};

/** Count number of specified angle in a given array and return a counted number of angle.
 * ```ts
 * const angleCount = countAngle(notes, 0);
 * ```
 */
export const countAngle = (notes: NoteContainer[], angle: number): number => {
    return notes.filter((n) => n.type !== 'bomb' && n.data.getAngle() === angle).length;
};

/** Calculate note per second.
 * ```ts
 * const nps = nps(notes, 10);
 * ```
 */
export const nps = (notes: ColorNote[], duration: number): number => {
    return duration ? notes.length / duration : 0;
};

/** Calculate the peak by rolling average.
 * ```ts
 * const peakNPS = peak(notes, 10, BPM ?? 128);
 * ```
 */
export const peak = (notes: ColorNote[], beat: number, bpm: number): number => {
    let peakNPS = 0;
    let currentSectionStart = 0;

    for (let i = 0; i < notes.length; i++) {
        while (notes[i].time - notes[currentSectionStart].time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(
            peakNPS,
            (i - currentSectionStart + 1) / ((beat / bpm) * 60)
        );
    }

    return peakNPS;
};
