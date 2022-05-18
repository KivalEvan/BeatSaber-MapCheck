// rotation 0 means down vertical note
// TODO: proper rotation check based on position
// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA there's still more work needed for parity check
// TODO: cleanup the implementation
import { Note } from './types/note';

type ParityState = 'forehand' | 'backhand' | 'neutral';
type ParityStatus = 'error' | 'warning' | 'none';
enum ParitySwitch {
    'forehand' = 'backhand',
    'backhand' = 'forehand',
}

const noteInitParity: {
    [key: number]: { backhand: number[]; forehand: number[] };
} = {
    0: {
        forehand: [1, 3, 6, 7],
        backhand: [0, 2, 4, 5],
    },
    1: {
        forehand: [1, 2, 6, 7],
        backhand: [0, 3, 4, 5],
    },
};
const noteInitRotation: { [key: number]: number[] } = {
    0: [0, 0, 90, 90, 45, -45, 45, -45],
    1: [0, 0, -90, -90, -45, 45, -45, 45],
};
const noteParityRotation: {
    [key: number]: { backhand: number[]; forehand: number[] };
} = {
    0: {
        forehand: [180, 0, -90, 90, -135, 135, -45, 45],
        backhand: [0, 180, 90, -90, 45, -45, 135, -135],
    },
    1: {
        forehand: [-180, 0, -90, 90, -135, 135, -45, 45],
        backhand: [0, -180, 90, -90, 45, -45, 135, -135],
    },
};

// TODO: probably body class for leaning
export class Parity {
    private _state!: ParityState;
    private _type!: number;
    private _rotation!: number;
    private _position!: [number, number];
    private _warningThreshold!: number;
    private _errorThreshold!: number;
    private _allowedRotation!: number;
    static readonly CONSTRAINT_ROTATION = [
        [-155, 195],
        [-195, 155],
    ];

    constructor(
        notes: Note[],
        type: number,
        warningThreshold: number,
        errorThreshold: number,
        allowedRotation: number,
        parity?: ParityState
    ) {
        this._type = type;
        this._warningThreshold = warningThreshold;
        this._errorThreshold = errorThreshold;
        this._allowedRotation = allowedRotation;
        if (parity && parity !== 'neutral') {
            this._state = parity;
            this._rotation = 0;
        } else {
            this._state = this.predictStartState(notes, type);
            this._rotation = this.predictStartRotation(notes, type);
        }
        this._position = this.predictStartPosition(notes, type);
    }

    get state(): ParityState {
        return this._state;
    }
    get rotation(): number {
        return this._rotation;
    }

    public check(noteContext: Note[], bombContext: Note[]): ParityStatus {
        if (this._state === 'neutral') {
            return 'none';
        }
        if (!noteContext.length) {
            throw new Error('no notes were given');
        }

        const startTime = noteContext[0]._time;
        const noteType = this._type;
        let currentState = this._state;
        let currentRotation = this._rotation;

        bombContext.forEach((bomb) => {
            if (bomb._time - 0.001 > startTime) {
                return;
            }
            if (bomb._lineLayer === 0) {
                if (bomb._lineIndex === (noteType ? 2 : 1)) {
                    currentState = 'backhand';
                    currentRotation = 0;
                }
            }
            if (bomb._lineLayer === 2) {
                if (bomb._lineIndex === (noteType ? 2 : 1)) {
                    currentState = 'forehand';
                    currentRotation = 0;
                }
            }
        });

        let prevNote!: Note;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note._cutDirection !== 8) {
                expectedDirection = note._cutDirection;
            }
            if (prevNote && expectedDirection === 8) {
                expectedDirection = predictDirection(note, prevNote);
            }
            prevNote = note;
        }
        if (expectedDirection === 8) {
            return 'none';
        }

        const parityRotation =
            noteParityRotation[noteType][ParitySwitch[currentState]][expectedDirection];

        if (
            (currentRotation > parityRotation
                ? currentRotation - parityRotation
                : parityRotation - currentRotation) > 180
        ) {
            return 'error';
        }
        if (
            parityRotation <
                Parity.CONSTRAINT_ROTATION[noteType][0] + this._errorThreshold ||
            parityRotation >
                Parity.CONSTRAINT_ROTATION[noteType][1] - this._errorThreshold
        ) {
            return 'error';
        }
        if (
            parityRotation <
                Parity.CONSTRAINT_ROTATION[noteType][0] + this._warningThreshold ||
            parityRotation >
                Parity.CONSTRAINT_ROTATION[noteType][1] - this._warningThreshold
        ) {
            return 'warning';
        }
        if (
            (currentRotation > parityRotation
                ? currentRotation - parityRotation
                : parityRotation - currentRotation) > this._allowedRotation
        ) {
            return 'warning';
        }

        return 'none';
    }
    public next(noteContext: Note[], bombContext: Note[]): void {
        if (this.check(noteContext, bombContext) !== 'error') {
            switch (this._state) {
                case 'forehand': {
                    this._state = 'backhand';
                    break;
                }
                case 'backhand': {
                    this._state = 'forehand';
                    break;
                }
                case 'neutral': {
                    for (let i = 0; i < noteContext.length; i++) {
                        const note = noteContext[i];
                        if (
                            noteInitParity[note._type].forehand.includes(
                                note._cutDirection
                            )
                        ) {
                            this._state = 'backhand';
                            break;
                        }
                        if (
                            noteInitParity[note._type].backhand.includes(
                                note._cutDirection
                            )
                        ) {
                            this._state = 'forehand';
                            break;
                        }
                        if (this._state === 'neutral' && note._cutDirection === 8) {
                            if (note._lineLayer === 0) {
                                this._state = 'backhand';
                            }
                            if (note._lineLayer > 0) {
                                this._state = 'forehand';
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (this._state === 'neutral') {
            throw new Error('parity unexpected input');
        }

        const startTime = noteContext[0]._time;
        const noteType = this._type;

        bombContext.forEach((bomb) => {
            if (bomb._time - 0.001 > startTime) {
                return;
            }
            if (bomb._lineLayer === 0) {
                if (bomb._lineIndex === (noteType ? 2 : 1)) {
                    this._state = 'forehand';
                    this._rotation = 0;
                }
            }
            if (bomb._lineLayer === 2) {
                if (bomb._lineIndex === (noteType ? 2 : 1)) {
                    this._state = 'backhand';
                    this._rotation = 0;
                }
            }
        });

        let prevNote!: Note;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note._cutDirection !== 8) {
                expectedDirection = note._cutDirection;
            }
            if (prevNote && expectedDirection === 8) {
                expectedDirection = predictDirection(note, prevNote);
            }
            prevNote = note;
        }
        if (expectedDirection !== 8) {
            this._rotation =
                noteParityRotation[this._type][this._state][expectedDirection];
        }
    }

    private predictStartState(notes: Note[], type: number): ParityState {
        let startParity: ParityState = 'neutral';
        for (let i = 0, len = notes.length; i < len; i++) {
            let note = notes[i];
            if (note._type === Math.abs(type - 1)) {
                continue;
            }
            if (note._type === 3) {
                if (note._lineLayer === 0) {
                    if (note._lineIndex === type ? 1 : 2) {
                        startParity = 'backhand';
                    }
                }
                if (note._lineLayer === 2) {
                    if (note._lineIndex === type ? 1 : 2) {
                        startParity = 'forehand';
                    }
                }
            }
            if (note._type === type) {
                if (startParity !== 'neutral') {
                    break;
                }
                const startTime = note._time;
                for (let j = i; j < notes.length; j++) {
                    if (
                        notes[j]._time > note._time + 0.001 &&
                        startTime < note._time + 0.001
                    ) {
                        break;
                    }
                    note = notes[j];
                    if (
                        noteInitParity[note._type].forehand.includes(note._cutDirection)
                    ) {
                        return 'backhand';
                    }
                    if (
                        noteInitParity[note._type].backhand.includes(note._cutDirection)
                    ) {
                        return 'forehand';
                    }
                    if (startParity === 'neutral' && note._cutDirection === 8) {
                        if (note._lineLayer === 0) {
                            startParity = 'backhand';
                        }
                        if (note._lineLayer > 0) {
                            startParity = 'forehand';
                        }
                    }
                }
                break;
            }
        }
        return startParity;
    }
    private predictStartRotation(notes: Note[], type: number): number {
        let rotation = 0;
        for (let i = 0, len = notes.length; i < len; i++) {
            let note = notes[i];
            if (note._type !== type) {
                continue;
            }
            if (note._type === type) {
                const startTime = note._time;
                for (let j = i; j < notes.length; j++) {
                    if (
                        notes[j]._time > note._time + 0.001 &&
                        startTime < note._time + 0.001
                    ) {
                        break;
                    }
                    note = notes[j];
                    if (note._cutDirection !== 8) {
                        return noteInitRotation[note._type][note._cutDirection];
                    }
                    if (note._cutDirection === 8) {
                        if (note._lineLayer === 0) {
                            if (note._lineIndex === 0) {
                                rotation = noteInitRotation[note._type][6];
                            }
                            if (note._lineIndex === 3) {
                                rotation = noteInitRotation[note._type][7];
                            }
                        }
                        if (note._lineLayer === 1) {
                            if (note._lineIndex === 0) {
                                rotation = noteInitRotation[note._type][2];
                            }
                            if (note._lineIndex === 3) {
                                rotation = noteInitRotation[note._type][3];
                            }
                        }
                        if (note._lineLayer === 2) {
                            if (note._lineIndex === 0) {
                                rotation = noteInitRotation[note._type][4];
                            }
                            if (note._lineIndex === 3) {
                                rotation = noteInitRotation[note._type][5];
                            }
                        }
                    }
                }
                break;
            }
        }
        return rotation;
    }
    // "predict" btw
    private predictStartPosition(notes: Note[], type: number): [number, number] {
        return type ? [-0.5, 1] : [0.5, 1];
    }
}
