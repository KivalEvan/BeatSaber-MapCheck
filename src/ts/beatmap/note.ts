import { shortRotDistance } from '../utils';
import { CustomDataNote } from './customData';

export interface Note {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _type: number;
    _cutDirection: number;
    _customData?: CustomDataNote;
    [key: string]: any;
}

interface NoteCount {
    red: NoteCountStats;
    blue: NoteCountStats;
    bomb: NoteCountStats;
}

interface NoteCountStats {
    total: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export const cutAngle = [
    0, // 0
    180, // 1
    270, // 2
    90, // 3
    315, // 4
    45, // 5
    225, // 6
    135, // 7
    0, // 8
];

export const flipDirection = [
    1, // 0
    0, // 1
    3, // 2
    2, // 3
    7, // 4
    6, // 5
    5, // 6
    4, // 7
    8, // 8
];

export const isNote = (n: Note): boolean => {
    return n._type === 0 || n._type === 1;
};

// TODO: Mapping Extensions and Noodle Extensions note position support
export const isVertical = (n1: Note, n2: Note): boolean => {
    return n1._lineIndex - n2._lineIndex === 0;
};

export const isHorizontal = (n1: Note, n2: Note): boolean => {
    return n1._lineLayer - n2._lineLayer === 0;
};

export const isDiagonal = (n1: Note, n2: Note): boolean => {
    return Math.abs(n1._lineIndex - n2._lineIndex) === Math.abs(n1._lineLayer - n2._lineLayer);
};

export const isInline = (n1: Note, n2: Note): boolean => {
    return n1._lineLayer === n2._lineLayer && n1._lineIndex === n2._lineIndex;
};

export const distance = (n1: Note, n2: Note): number => {
    return Math.max(
        Math.abs(n1._lineIndex - n2._lineIndex),
        Math.abs(n1._lineLayer - n2._lineLayer)
    );
};

export const isWindow = (n1: Note, n2: Note): boolean => {
    return distance(n1, n2) >= 2;
};

export const isSlantedWindow = (n1: Note, n2: Note): boolean => {
    return isWindow(n1, n2) && !isDiagonal(n1, n2) && !isHorizontal(n1, n2) && !isVertical(n1, n2);
};

export const hasChroma = (note: Note): boolean => {
    return (
        Array.isArray(note._customData?._color) ||
        typeof note._customData?._disableSpawnEffect === 'boolean'
    );
};

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

export const hasMappingExtensions = (note: Note): boolean => {
    return (
        note._cutDirection >= 1000 ||
        note._lineIndex > 3 ||
        note._lineIndex < 0 ||
        note._lineLayer > 2 ||
        note._lineLayer < 0
    );
};

export const isValid = (note: Note): boolean => {
    return !hasMappingExtensions(note) && note._cutDirection >= 0 && note._cutDirection <= 8;
};

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
            if (notes[i]._customData?._color || notes[i]._customData?._disableSpawnEffect) {
                noteCount.red.chroma++;
            }
        } else if (notes[i]._type === 1) {
            noteCount.blue.total++;
            if (notes[i]._customData?._color || notes[i]._customData?._disableSpawnEffect) {
                noteCount.blue.chroma++;
            }
        } else if (notes[i]._type === 3) {
            noteCount.bomb.total++;
            if (notes[i]._customData?._color || notes[i]._customData?._disableSpawnEffect) {
                noteCount.bomb.chroma++;
            }
        }
    }
    return noteCount;
};

export const countIndex = (notes: Note[], i: number): number => {
    return notes.filter((n) => n._lineIndex === i).length;
};

export const countLayer = (notes: Note[], l: number): number => {
    return notes.filter((n) => n._lineLayer === l).length;
};

export const countIndexLayer = (notes: Note[], i: number, l: number): number => {
    return notes.filter((n) => n._lineIndex === i && n._lineLayer === l).length;
};

export const countDirection = (notes: Note[], cd: number): number => {
    return notes.filter((n) => n._cutDirection === cd).length;
};

export const countAngle = (notes: Note[], angle: number): number => {
    return notes.filter((n) => getAngle(n) === angle).length;
};

export const nps = (notes: Note[], duration: number): number => {
    return notes.filter((n) => isNote(n)).length / duration;
};

export const peak = (notes: Note[], beat: number, bpm: number): number => {
    const nArr = notes.filter((n) => n._type === 0 || n._type === 1);
    let peakNPS = 0;
    let currentSectionStart = 0;

    for (let i = 0; i < nArr.length; i++) {
        while (nArr[i]._time - nArr[currentSectionStart]._time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(peakNPS, (i - currentSectionStart + 1) / ((beat / bpm) * 60));
    }

    return peakNPS;
};

export const getAngle = (n: Note): number => {
    if (n._customData?._cutDirection) {
        return n._customData._cutDirection;
    }
    if (n._cutDirection >= 1000) {
        return n._cutDirection % 1000;
    }
    return cutAngle[n._cutDirection];
};

export const checkDirection = (
    n1: Note | number,
    n2: Note | number,
    angleTol: number,
    equal: boolean
): boolean => {
    let n1Angle!: number;
    let n2Angle!: number;
    if (typeof n1 === 'number') {
        if (n1 === 8) {
            return false;
        }
        n1Angle = cutAngle[n1];
    } else {
        if (n1._cutDirection === 8) {
            return false;
        }
        n1Angle = getAngle(n1);
    }
    if (typeof n2 === 'number') {
        if (n2 === 8) {
            return false;
        }
        n2Angle = cutAngle[n2];
    } else {
        if (n2._cutDirection === 8) {
            return false;
        }
        n2Angle = getAngle(n2);
    }
    return equal
        ? shortRotDistance(n1Angle, n2Angle, 360) <= angleTol
        : shortRotDistance(n1Angle, n2Angle, 360) >= angleTol;
};
