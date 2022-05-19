// rotation 0 means down vertical note
// TODO: proper rotation check based on position
// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA there's still more work needed for parity check
// TODO: cleanup the implementation
import { ColorNote } from '../../beatmap/v3/colorNote';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { ParityState, ParityStatus } from '../../types/mapcheck/analyzers/parity';
import { predictDirection } from '../placement/note';

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
export default class Parity {
    private _state!: ParityState;
    private color!: number;
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
        notes: NoteContainer[],
        type: number,
        warningThreshold: number,
        errorThreshold: number,
        allowedRotation: number,
        parity?: ParityState
    ) {
        this.color = type;
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

    public check(noteContext: ColorNote[], bombContext: ColorNote[]): ParityStatus {
        if (this._state === 'neutral') {
            return 'none';
        }
        if (!noteContext.length) {
            throw new Error('no notes were given');
        }

        const startTime = noteContext[0].time;
        const noteType = this.color;
        let currentState = this._state;
        let currentRotation = this._rotation;

        bombContext.forEach((bomb) => {
            if (bomb.time - 0.001 > startTime) {
                return;
            }
            if (bomb.posY === 0) {
                if (bomb.posX === (noteType ? 2 : 1)) {
                    currentState = 'backhand';
                    currentRotation = 0;
                }
            }
            if (bomb.posY === 2) {
                if (bomb.posX === (noteType ? 2 : 1)) {
                    currentState = 'forehand';
                    currentRotation = 0;
                }
            }
        });

        let prevNote!: ColorNote;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note.direction !== 8) {
                expectedDirection = note.direction;
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
    public next(noteContext: ColorNote[], bombContext: ColorNote[]): void {
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
                            noteInitParity[note.color].forehand.includes(note.direction)
                        ) {
                            this._state = 'backhand';
                            break;
                        }
                        if (
                            noteInitParity[note.color].backhand.includes(note.direction)
                        ) {
                            this._state = 'forehand';
                            break;
                        }
                        if (this._state === 'neutral' && note.direction === 8) {
                            if (note.posY === 0) {
                                this._state = 'backhand';
                            }
                            if (note.posY > 0) {
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

        const startTime = noteContext[0].time;
        const noteType = this.color;

        bombContext.forEach((bomb) => {
            if (bomb.time - 0.001 > startTime) {
                return;
            }
            if (bomb.posY === 0) {
                if (bomb.posX === (noteType ? 2 : 1)) {
                    this._state = 'forehand';
                    this._rotation = 0;
                }
            }
            if (bomb.posY === 2) {
                if (bomb.posX === (noteType ? 2 : 1)) {
                    this._state = 'backhand';
                    this._rotation = 0;
                }
            }
        });

        let prevNote!: ColorNote;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note.direction !== 8) {
                expectedDirection = note.direction;
            }
            if (prevNote && expectedDirection === 8) {
                expectedDirection = predictDirection(note, prevNote);
            }
            prevNote = note;
        }
        if (expectedDirection !== 8) {
            this._rotation =
                noteParityRotation[this.color][this._state][expectedDirection];
        }
    }

    private predictStartState(notes: NoteContainer[], type: number): ParityState {
        let startParity: ParityState = 'neutral';
        for (let i = 0, len = notes.length; i < len; i++) {
            let note = notes[i];
            if (note.data.color === Math.abs(type - 1)) {
                continue;
            }
            if (note.data.color === 3) {
                if (note.data.posY === 0) {
                    if (note.data.posX === type ? 1 : 2) {
                        startParity = 'backhand';
                    }
                }
                if (note.data.posY === 2) {
                    if (note.data.posX === type ? 1 : 2) {
                        startParity = 'forehand';
                    }
                }
            }
            if (note.data.color === type) {
                if (startParity !== 'neutral') {
                    break;
                }
                const startTime = note.data.time;
                for (let j = i; j < notes.length; j++) {
                    if (
                        notes[j].data.time > note.data.time + 0.001 &&
                        startTime < note.data.time + 0.001
                    ) {
                        break;
                    }
                    note = notes[j];
                    if (
                        noteInitParity[note.data.color].forehand.includes(
                            note.data.direction
                        )
                    ) {
                        return 'backhand';
                    }
                    if (
                        noteInitParity[note.data.color].backhand.includes(
                            note.data.direction
                        )
                    ) {
                        return 'forehand';
                    }
                    if (startParity === 'neutral' && note.data.direction === 8) {
                        if (note.data.posY === 0) {
                            startParity = 'backhand';
                        }
                        if (note.data.posY > 0) {
                            startParity = 'forehand';
                        }
                    }
                }
                break;
            }
        }
        return startParity;
    }
    private predictStartRotation(notes: NoteContainer[], color: number): number {
        let rotation = 0;
        for (let i = 0, len = notes.length; i < len; i++) {
            let note = notes[i];
            if (note.data.color !== color) {
                continue;
            }
            if (note.data.color === color) {
                const startTime = note.time;
                for (let j = i; j < notes.length; j++) {
                    if (
                        notes[j].data.time > note.data.time + 0.001 &&
                        startTime < note.data.time + 0.001
                    ) {
                        break;
                    }
                    note = notes[j];
                    if (note.data.direction !== 8) {
                        return noteInitRotation[note.data.color][note.data.direction];
                    }
                    if (note.data.data.direction === 8) {
                        if (note.data.posY === 0) {
                            if (note.data.posX === 0) {
                                rotation = noteInitRotation[note.data.color][6];
                            }
                            if (note.data.posX === 3) {
                                rotation = noteInitRotation[note.data.color][7];
                            }
                        }
                        if (note.data.posY === 1) {
                            if (note.data.posX === 0) {
                                rotation = noteInitRotation[note.data.color][2];
                            }
                            if (note.data.posX === 3) {
                                rotation = noteInitRotation[note.data.color][3];
                            }
                        }
                        if (note.data.posY === 2) {
                            if (note.data.posX === 0) {
                                rotation = noteInitRotation[note.data.color][4];
                            }
                            if (note.data.posX === 3) {
                                rotation = noteInitRotation[note.data.color][5];
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
    private predictStartPosition(
        notes: NoteContainer[],
        type: number
    ): [number, number] {
        return type ? [-0.5, 1] : [0.5, 1];
    }
}
