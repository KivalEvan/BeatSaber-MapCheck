import { Note, NoteCount } from './types/note';
import { BeatPerMinute } from '../shared/bpm';
import { radToDeg, shortRotDistance } from '../../utils';

/** Array index mapped to cut angle corresponding to the `_cutDirection`.
 * ```ts
 * 0 -> 180,
 * 1 -> 0,
 * 2 -> 270,
 * 3 -> 90,
 * 4 -> 225,
 * 5 -> 135,
 * 6 -> 315,
 * 7 -> 45,
 * 8 -> 0
 * ```
 */
export const cutAngle: Readonly<number[]> = [180, 0, 270, 90, 225, 135, 315, 45, 0];

export const flipDirection: Readonly<number[]> = [1, 0, 3, 2, 7, 6, 5, 4, 8];

/** Array index mapped to tuple of `_lineIndex` and `_lineLayer` corresponding to the `_cutDirection`.
 * ```ts
 * 0 -> [0, 1],
 * 1 -> [0, -1],
 * 2 -> [-1, 0],
 * 3 -> [1, 0],
 * 4 -> [-1, 1],
 * 5 -> [1, 1],
 * 6 -> [-1, -1],
 * 7 -> [1, -1],
 * 8 -> [0, 0]
 * ```
 */
export const cutDirectionSpace: { [key: number]: readonly [number, number] } = {
    0: [0, 1],
    1: [0, -1],
    2: [-1, 0],
    3: [1, 0],
    4: [-1, 1],
    5: [1, 1],
    6: [-1, -1],
    7: [1, -1],
    8: [0, 0],
};

/** Check if note is a red or blue note.
 * ```ts
 * if (isNote(note)) {}
 * ```
 */
export const isNote = (note: Note): boolean => {
    return note._type === 0 || note._type === 1;
};

/** Check if note is a bomb note
 * ```ts
 * if (isBomb(note)) {}
 * ```
 */
export const isBomb = (note: Note): boolean => {
    return note._type === 3;
};

/** Get note and return the Beatwalls' position x and y value in tuple.
 * ```ts
 * const notePos = getPosition(note);
 * ```
 */
export const getPosition = (note: Note): [number, number] => {
    if (note._customData?._position) {
        return [note._customData._position[0], note._customData._position[1]];
    }
    return [
        (note._lineIndex <= -1000
            ? note._lineIndex / 1000
            : note._lineIndex >= 1000
            ? note._lineIndex / 1000
            : note._lineIndex) - 2,
        note._lineLayer <= -1000
            ? note._lineLayer / 1000
            : note._lineLayer >= 1000
            ? note._lineLayer / 1000
            : note._lineLayer,
    ];
};

/** Get note and return standardised note angle.
 * ```ts
 * const noteAngle = getAngle(note);
 * ```
 */
export const getAngle = (note: Note): number => {
    if (note._customData?._cutDirection) {
        return note._customData._cutDirection > 0
            ? note._customData._cutDirection % 360
            : 360 + (note._customData._cutDirection % 360);
    }
    if (note._cutDirection >= 1000) {
        return Math.abs(((note._cutDirection % 1000) % 360) - 360);
    }
    return cutAngle[note._cutDirection] || 0;
};

/** Get two notes and return the distance between two notes.
 * ```ts
 * const noteDistance = distance(note1, note2);
 * ```
 */
export const distance = (n1: Note, n2: Note): number => {
    const [nX1, nY1] = getPosition(n1);
    const [nX2, nY2] = getPosition(n2);
    return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
};

/** Compare two notes and return if the notes is in vertical alignment.
 * ```ts
 * if (isVertical(note1, note2)) {}
 * ```
 */
export const isVertical = (n1: Note, n2: Note): boolean => {
    const [nX1] = getPosition(n1);
    const [nX2] = getPosition(n2);
    const d = nX1 - nX2;
    return d > -0.001 && d < 0.001;
};

/** Compare two notes and return if the notes is in horizontal alignment.
 * ```ts
 * if (isHorizontal(note1, note2)) {}
 * ```
 */
export const isHorizontal = (n1: Note, n2: Note): boolean => {
    const [_, nY1] = getPosition(n1);
    const [_2, nY2] = getPosition(n2);
    const d = nY1 - nY2;
    return d > -0.001 && d < 0.001;
};

/** Compare two notes and return if the notes is in diagonal alignment.
 * ```ts
 * if (isDiagonal(note1, note2)) {}
 * ```
 */
export const isDiagonal = (n1: Note, n2: Note): boolean => {
    const [nX1, nY1] = getPosition(n1);
    const [nX2, nY2] = getPosition(n2);
    const dX = Math.abs(nX1 - nX2);
    const dY = Math.abs(nY1 - nY2);
    return dX === dY;
};

/** Compare two notes and return if the notes is an inline.
 * ```ts
 * if (isInline(note1, note2)) {}
 * ```
 */
export const isInline = (n1: Note, n2: Note, lapping = 0.5): boolean => {
    return distance(n1, n2) <= lapping;
};

/** Compare current note with the note ahead of it and return if the notes is a double.
 * ```ts
 * if (isDouble(note, notes, index)) {}
 * ```
 */
export const isDouble = (note: Note, notes: Note[], index: number): boolean => {
    for (let i = index, len = notes.length; i < len; i++) {
        if (notes[i]._time < note._time + 0.01 && notes[i]._type !== note._type) {
            return true;
        }
        if (notes[i]._time > note._time + 0.01) {
            return false;
        }
    }
    return false;
};

/** Compare two notes and return if the notes is adjacent.
 * ```ts
 * if (isAdjacent(note1, note2)) {}
 * ```
 */
export const isAdjacent = (n1: Note, n2: Note): boolean => {
    const d = distance(n1, n2);
    return d > 0.499 && d < 1.001;
};

/** Compare two notes and return if the notes is a window.
 * ```ts
 * if (isWindow(note1, note2)) {}
 * ```
 */
export const isWindow = (n1: Note, n2: Note): boolean => {
    return distance(n1, n2) > 1.8;
};

/** Compare two notes and return if the notes is a slanted window.
 * ```ts
 * if (isSlantedWindow(note1, note2)) {}
 * ```
 */
export const isSlantedWindow = (n1: Note, n2: Note): boolean => {
    return (
        isWindow(n1, n2) &&
        !isDiagonal(n1, n2) &&
        !isHorizontal(n1, n2) &&
        !isVertical(n1, n2)
    );
};

/** Check if the note intersect on swing path by angle and distance.
 * ```ts
 * if (isIntersect(note1, note2, [[20, 1.5]])) {}
 * ```
 */
// a fkin abomination that's what this is
export const isIntersect = (
    n1: Note,
    n2: Note,
    angleDistances: [number, number, number?][],
    ahead = false
): [boolean, boolean] => {
    const [nX1, nY1] = getPosition(n1);
    const [nX2, nY2] = getPosition(n2);
    const nA1 = getAngle(n1);
    const nA2 = getAngle(n2);
    const angle = ahead ? 540 : 360;
    let resultN1 = false;
    if (n1._cutDirection !== 8) {
        const a = (radToDeg(Math.atan2(nY1 - nY2, nX1 - nX2)) + 450) % 360;
        for (const [angleRange, maxDistance, offsetT] of angleDistances) {
            const offset = offsetT ?? 0;
            const aS = (nA1 + angle - angleRange + offset) % 360;
            const aE = (nA1 + angle + angleRange + offset) % 360;
            resultN1 =
                (maxDistance >=
                    Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
                    ((aS < aE && aS <= a && a <= aE) ||
                        (aS >= aE && (a <= aE || a >= aS)))) ||
                resultN1;
            if (resultN1) {
                break;
            }
        }
    }
    let resultN2 = false;
    if (n2._cutDirection !== 8) {
        const a = (radToDeg(Math.atan2(nY2 - nY1, nX2 - nX1)) + 450) % 360;
        for (const [angleRange, maxDistance, offsetT] of angleDistances) {
            const offset = offsetT ?? 0;
            const aS = (nA2 + angle - angleRange + offset) % 360;
            const aE = (nA2 + angle + angleRange + offset) % 360;
            resultN2 =
                (maxDistance >=
                    Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
                    ((aS < aE && aS <= a && a <= aE) ||
                        (aS >= aE && (a <= aE || a >= aS)))) ||
                resultN2;
            if (resultN2) {
                break;
            }
        }
    }
    return [resultN1, resultN2];
};

// TODO: update with new position/rotation system
export const isEnd = (currNote: Note, prevNote: Note, cd: number): boolean => {
    // fuck u and ur dot note stack
    if (currNote._cutDirection === 8 && prevNote._cutDirection === 8 && cd !== 8) {
        // if end note on right side
        if (currNote._lineIndex > prevNote._lineIndex) {
            if (cd === 5 || cd === 3 || cd === 7) {
                return true;
            }
        }
        // if end note on left side
        if (currNote._lineIndex < prevNote._lineIndex) {
            if (cd === 6 || cd === 2 || cd === 4) {
                return true;
            }
        }
        // if end note is above
        if (currNote._lineLayer > prevNote._lineLayer) {
            if (cd === 4 || cd === 0 || cd === 5) {
                return true;
            }
        }
        // if end note is below
        if (currNote._lineLayer < prevNote._lineLayer) {
            if (cd === 6 || cd === 1 || cd === 7) {
                return true;
            }
        }
    }
    // if end note on right side
    if (currNote._lineIndex > prevNote._lineIndex) {
        // check if end note is arrowed
        if (
            currNote._cutDirection === 5 ||
            currNote._cutDirection === 3 ||
            currNote._cutDirection === 7
        ) {
            return true;
        }
        // check if end note is dot and start arrow is pointing to it
        if (
            (prevNote._cutDirection === 5 ||
                prevNote._cutDirection === 3 ||
                prevNote._cutDirection === 7) &&
            currNote._cutDirection === 8
        ) {
            return true;
        }
    }
    // if end note on left side
    if (currNote._lineIndex < prevNote._lineIndex) {
        if (
            currNote._cutDirection === 6 ||
            currNote._cutDirection === 2 ||
            currNote._cutDirection === 4
        ) {
            return true;
        }
        if (
            (prevNote._cutDirection === 6 ||
                prevNote._cutDirection === 2 ||
                prevNote._cutDirection === 4) &&
            currNote._cutDirection === 8
        ) {
            return true;
        }
    }
    // if end note is above
    if (currNote._lineLayer > prevNote._lineLayer) {
        if (
            currNote._cutDirection === 4 ||
            currNote._cutDirection === 0 ||
            currNote._cutDirection === 5
        ) {
            return true;
        }
        if (
            (prevNote._cutDirection === 4 ||
                prevNote._cutDirection === 0 ||
                prevNote._cutDirection === 5) &&
            currNote._cutDirection === 8
        ) {
            return true;
        }
    }
    // if end note is below
    if (currNote._lineLayer < prevNote._lineLayer) {
        if (
            currNote._cutDirection === 6 ||
            currNote._cutDirection === 1 ||
            currNote._cutDirection === 7
        ) {
            return true;
        }
        if (
            (prevNote._cutDirection === 6 ||
                prevNote._cutDirection === 1 ||
                prevNote._cutDirection === 7) &&
            currNote._cutDirection === 8
        ) {
            return true;
        }
    }
    return false;
};

// TODO: update with new position/rotation system
export const predictDirection = (currNote: Note, prevNote: Note): number => {
    if (isEnd(currNote, prevNote, 8)) {
        return currNote._cutDirection === 8
            ? prevNote._cutDirection
            : currNote._cutDirection;
    }
    if (currNote._cutDirection !== 8) {
        return currNote._cutDirection;
    }
    if (currNote._time > prevNote._time) {
        // if end note on right side
        if (currNote._lineIndex > prevNote._lineIndex) {
            if (isHorizontal(currNote, prevNote)) {
                return 3;
            }
        }
        // if end note on left side
        if (currNote._lineIndex < prevNote._lineIndex) {
            if (isHorizontal(currNote, prevNote)) {
                return 2;
            }
        }
        // if end note is above
        if (currNote._lineLayer > prevNote._lineLayer) {
            if (isVertical(currNote, prevNote)) {
                return 0;
            }
            if (currNote._lineIndex > prevNote._lineIndex) {
                return 5;
            }
            if (currNote._lineIndex < prevNote._lineIndex) {
                return 4;
            }
        }
        // if end note is below
        if (currNote._lineLayer < prevNote._lineLayer) {
            if (isVertical(currNote, prevNote)) {
                return 1;
            }
            if (currNote._lineIndex > prevNote._lineIndex) {
                return 7;
            }
            if (currNote._lineIndex < prevNote._lineIndex) {
                return 6;
            }
        }
    }
    return 8;
};

/** Check if note has Chroma properties.
 * ```ts
 * if (hasChroma(note)) {}
 * ```
 */
export const hasChroma = (note: Note): boolean => {
    return (
        Array.isArray(note._customData?._color) ||
        typeof note._customData?._disableSpawnEffect === 'boolean'
    );
};

/** Check if note has Noodle Extensions properties.
 * ```ts
 * if (hasNoodleExtensions(note)) {}
 * ```
 */
// god i hate these
export const hasNoodleExtensions = (note: Note): boolean => {
    return (
        Array.isArray(note._customData?._animation) ||
        typeof note._customData?._cutDirection === 'number' ||
        typeof note._customData?._disableNoteGravity === 'boolean' ||
        typeof note._customData?._disableNoteLook === 'boolean' ||
        typeof note._customData?._fake === 'boolean' ||
        Array.isArray(note._customData?._flip) ||
        typeof note._customData?._interactable === 'boolean' ||
        Array.isArray(note._customData?._localRotation) ||
        typeof note._customData?._noteJumpMovementSpeed === 'number' ||
        typeof note._customData?._noteJumpStartBeatOffset === 'number' ||
        Array.isArray(note._customData?._position) ||
        Array.isArray(note._customData?._rotation) ||
        typeof note._customData?._track === 'string'
    );
};

/** Check if note has Mapping Extensions properties.
 * ```ts
 * if (hasMappingExtensions(note)) {}
 * ```
 */
export const hasMappingExtensions = (note: Note): boolean => {
    return (
        note._cutDirection >= 1000 ||
        note._lineIndex > 3 ||
        note._lineIndex < 0 ||
        note._lineLayer > 2 ||
        note._lineLayer < 0
    );
};

/** Check if note has a valid cut direction.
 * ```ts
 * if (isValidDirection(note)) {}
 * ```
 */
export const isValidDirection = (note: Note): boolean => {
    return note._cutDirection >= 0 && note._cutDirection <= 8;
};

/** Check if note is a valid, vanilla note.
 * ```ts
 * if (isValid(note)) {}
 * ```
 */
export const isValid = (note: Note): boolean => {
    return !hasMappingExtensions(note) && isValidDirection(note);
};

/** Count number of red, blue, and bomb notes with their properties in given array and return a note count object.
 * ```ts
 * const list = count(notes);
 * console.log(list);
 * ```
 */
export const count = (notes: Note[]): NoteCount => {
    const noteCount: NoteCount = {
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
        bomb: {
            total: 0,
            chroma: 0,
            noodleExtensions: 0,
            mappingExtensions: 0,
        },
    };
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i]._type === 0) {
            noteCount.red.total++;
            if (
                notes[i]._customData?._color ||
                notes[i]._customData?._disableSpawnEffect
            ) {
                noteCount.red.chroma++;
            }
        } else if (notes[i]._type === 1) {
            noteCount.blue.total++;
            if (
                notes[i]._customData?._color ||
                notes[i]._customData?._disableSpawnEffect
            ) {
                noteCount.blue.chroma++;
            }
        } else if (notes[i]._type === 3) {
            noteCount.bomb.total++;
            if (
                notes[i]._customData?._color ||
                notes[i]._customData?._disableSpawnEffect
            ) {
                noteCount.bomb.chroma++;
            }
        }
    }
    return noteCount;
};

/** Count number of specified line index in a given array and return a counted number of line index.
 * ```ts
 * const indexCount = countIndex(notes, 0);
 * ```
 */
export const countIndex = (notes: Note[], i: number): number => {
    return notes.filter((n) => n._lineIndex === i).length;
};

/** Count number of specified line layer in a given array and return a counted number of line layer.
 * ```ts
 * const layerCount = countLayer(notes, 0);
 * ```
 */
export const countLayer = (notes: Note[], l: number): number => {
    return notes.filter((n) => n._lineLayer === l).length;
};

/** Count number of specified line index and line layer in a given array and return a counted number of line index and line layer.
 * ```ts
 * const indexLayerCount = countIndexLayer(notes, 0, 0);
 * ```
 */
export const countIndexLayer = (notes: Note[], i: number, l: number): number => {
    return notes.filter((n) => n._lineIndex === i && n._lineLayer === l).length;
};

/** Count number of specified `_cutDirection` in a given array and return a counted number of `_cutDirection`.
 * ```ts
 * const cdCount = countDirection(notes, 0);
 * ```
 */
export const countDirection = (notes: Note[], cd: number): number => {
    return notes.filter((n) => n._cutDirection === cd).length;
};

/** Count number of specified angle in a given array and return a counted number of angle.
 * ```ts
 * const angleCount = countAngle(notes, 0);
 * ```
 */
export const countAngle = (notes: Note[], angle: number): number => {
    return notes.filter((n) => getAngle(n) === angle).length;
};

/** Calculate note per second.
 * ```ts
 * const nps = nps(notes, 10);
 * ```
 */
export const nps = (notes: Note[], duration: number): number => {
    return duration ? notes.filter((n) => isNote(n)).length / duration : 0;
};

/** Calculate the peak by rolling average.
 * ```ts
 * const peakNPS = peak(notes, 10, BPM ?? 128);
 * ```
 */
export const peak = (
    notes: Note[],
    beat: number,
    bpm: BeatPerMinute | number
): number => {
    const nArr = notes.filter(isNote);
    let peakNPS = 0;
    let currentSectionStart = 0;
    const bpmV = typeof bpm === 'number' ? bpm : bpm.value;

    for (let i = 0; i < nArr.length; i++) {
        while (nArr[i]._time - nArr[currentSectionStart]._time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(
            peakNPS,
            (i - currentSectionStart + 1) / ((beat / bpmV) * 60)
        );
    }

    return peakNPS;
};

/** Check the angle equality of the two notes.
 * @param {(Note|number|null)} n1 - First beatmap note, note `_cutDirection`, or null value
 * @param {(Note|number|null)} n2 - Second beatmap note, note `_cutDirection`, or null value
 * @param {number} angleTol - Angle tolerance
 * @param {boolean} equal - If it should check inner or outer angle
 * @returns {boolean} If condition is met
 */
export const checkDirection = (
    n1: Note | number | null,
    n2: Note | number | null,
    angleTol: number,
    equal: boolean
): boolean => {
    let nA1!: number;
    let nA2!: number;
    if (n1 === null || n2 === null) {
        return false;
    }
    if (typeof n1 === 'number') {
        nA1 = n1;
    } else {
        if (n1._cutDirection === 8) {
            return false;
        }
        nA1 = getAngle(n1);
    }
    if (typeof n2 === 'number') {
        nA2 = n2;
    } else {
        if (n2._cutDirection === 8) {
            return false;
        }
        nA2 = getAngle(n2);
    }
    return equal
        ? shortRotDistance(nA1, nA2, 360) <= angleTol
        : shortRotDistance(nA1, nA2, 360) >= angleTol;
};
