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

export const isWindow = (n1: Note, n2: Note): boolean => {
    return (
        Math.max(
            Math.abs(n1._lineIndex - n2._lineIndex),
            Math.abs(n1._lineLayer - n2._lineLayer)
        ) >= 2
    );
};

export const isSlantedWindow = (n1: Note, n2: Note): boolean => {
    return isWindow(n1, n2) && !isDiagonal(n1, n2) && !isHorizontal(n1, n2) && !isVertical(n1, n2);
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
    let count = 0;
    notes.forEach((n) => {
        if (isNote(n) && n._lineIndex === i) {
            count++;
        }
    });
    return count;
};

export const countLayer = (notes: Note[], l: number): number => {
    let count = 0;
    notes.forEach((n) => {
        if (isNote(n) && n._lineLayer === l) {
            count++;
        }
    });
    return count;
};

export const countIndexLayer = (notes: Note[], i: number, l: number): number => {
    let count = 0;
    notes.forEach((n) => {
        if (isNote(n) && n._lineIndex === i && n._lineLayer === l) {
            count++;
        }
    });
    return count;
};
export const calculate = (notes: Note[], duration: number): number => {
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

export const checkDirection = (n1: Note, n2: Note, angleTol: number, equal: boolean): boolean => {
    if (n1._cutDirection === 8 || n2._cutDirection === 8) {
        return false;
    }
    return equal
        ? shortRotDistance(getAngle(n1), getAngle(n2), 360) <= angleTol
        : shortRotDistance(getAngle(n1), getAngle(n2), 360) >= angleTol;
};
