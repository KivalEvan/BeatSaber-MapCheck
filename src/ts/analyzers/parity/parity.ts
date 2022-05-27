// rotation 0 means down vertical note
// TODO: proper rotation check based on position
// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA there's still more work needed for parity check
// TODO: cleanup the implementation
import { NoteContainer, NoteContainerBomb, NoteContainerNote } from '../../types/beatmap/v3/container';
import { ParityState, ParityStatus, ParitySwitch } from '../../types/mapcheck/analyzers/parity';
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
    private state!: ParityState;
    private color!: number;
    private rotation!: number;
    private position!: [number, number];
    private warningThreshold!: number;
    private errorThreshold!: number;
    private allowedRotation!: number;
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
        parity?: ParityState,
    ) {
        this.color = type;
        this.warningThreshold = warningThreshold;
        this.errorThreshold = errorThreshold;
        this.allowedRotation = allowedRotation;
        if (parity && parity !== 'neutral') {
            this.state = parity;
            this.rotation = 0;
        } else {
            this.state = this.predictStartState(notes, type);
            this.rotation = this.predictStartRotation(notes, type);
        }
        this.position = this.predictStartPosition(notes, type);
    }

    public check(noteContext: NoteContainer[], bombContext: NoteContainerBomb[]): ParityStatus {
        if (this.state === 'neutral') {
            return 'none';
        }
        if (!noteContext.length) {
            throw new Error('no notes were given');
        }

        const startTime = noteContext[0].data.time;
        const noteType = this.color;
        let currentState = this.state;
        let currentRotation = this.rotation;

        bombContext.forEach((bomb) => {
            if (bomb.data.time - 0.001 > startTime) {
                return;
            }
            if (bomb.data.posY === 0) {
                if (bomb.data.posX === (noteType ? 2 : 1)) {
                    currentState = 'backhand';
                    currentRotation = 0;
                }
            }
            if (bomb.data.posY === 2) {
                if (bomb.data.posX === (noteType ? 2 : 1)) {
                    currentState = 'forehand';
                    currentRotation = 0;
                }
            }
        });

        let prevNote!: NoteContainerNote;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note.type !== 'note') {
                continue;
            }
            if (note.data.direction !== 8) {
                expectedDirection = note.data.direction;
            }
            if (prevNote && expectedDirection === 8) {
                expectedDirection = predictDirection(note.data, prevNote.data);
            }
            prevNote = note;
        }
        if (expectedDirection === 8) {
            return 'none';
        }

        const parityRotation = noteParityRotation[noteType][ParitySwitch[currentState]][expectedDirection];

        if (
            (currentRotation > parityRotation ? currentRotation - parityRotation : parityRotation - currentRotation) >
            180
        ) {
            return 'error';
        }
        if (
            parityRotation < Parity.CONSTRAINT_ROTATION[noteType][0] + this.errorThreshold ||
            parityRotation > Parity.CONSTRAINT_ROTATION[noteType][1] - this.errorThreshold
        ) {
            return 'error';
        }
        if (
            parityRotation < Parity.CONSTRAINT_ROTATION[noteType][0] + this.warningThreshold ||
            parityRotation > Parity.CONSTRAINT_ROTATION[noteType][1] - this.warningThreshold
        ) {
            return 'warning';
        }
        if (
            (currentRotation > parityRotation ? currentRotation - parityRotation : parityRotation - currentRotation) >
            this.allowedRotation
        ) {
            return 'warning';
        }

        return 'none';
    }
    public next(noteContext: NoteContainer[], bombContext: NoteContainerBomb[]): void {
        if (this.check(noteContext, bombContext) !== 'error') {
            switch (this.state) {
                case 'forehand': {
                    this.state = 'backhand';
                    break;
                }
                case 'backhand': {
                    this.state = 'forehand';
                    break;
                }
                case 'neutral': {
                    for (let i = 0; i < noteContext.length; i++) {
                        if (noteContext[i].type !== 'note') {
                            continue;
                        }
                        const note = noteContext[i] as NoteContainerNote;
                        if (noteInitParity[note.data.color].forehand.includes(note.data.direction)) {
                            this.state = 'backhand';
                            break;
                        }
                        if (noteInitParity[note.data.color].backhand.includes(note.data.direction)) {
                            this.state = 'forehand';
                            break;
                        }
                        if (this.state === 'neutral' && note.data.direction === 8) {
                            if (note.data.posY === 0) {
                                this.state = 'backhand';
                            }
                            if (note.data.posY > 0) {
                                this.state = 'forehand';
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (this.state === 'neutral') {
            throw new Error('parity unexpected input');
        }

        const startTime = noteContext[0].data.time;
        const noteType = this.color;

        bombContext.forEach((bomb) => {
            if (bomb.data.time - 0.001 > startTime) {
                return;
            }
            if (bomb.data.posY === 0) {
                if (bomb.data.posX === (noteType ? 2 : 1)) {
                    this.state = 'forehand';
                    this.rotation = 0;
                }
            }
            if (bomb.data.posY === 2) {
                if (bomb.data.posX === (noteType ? 2 : 1)) {
                    this.state = 'backhand';
                    this.rotation = 0;
                }
            }
        });

        let prevNote!: NoteContainerNote;
        let expectedDirection = 8;
        for (const note of noteContext) {
            if (note.type !== 'note') {
                continue;
            }
            if (note.data.direction !== 8) {
                expectedDirection = note.data.direction;
            }
            if (prevNote && expectedDirection === 8) {
                expectedDirection = predictDirection(note.data, prevNote.data);
            }
            prevNote = note;
        }
        if (expectedDirection !== 8) {
            this.rotation = noteParityRotation[this.color][this.state][expectedDirection];
        }
    }

    private predictStartState(nc: NoteContainer[], type: number): ParityState {
        let startParity: ParityState = 'neutral';
        for (let i = 0, len = nc.length; i < len; i++) {
            if (nc[i].type === 'bomb') {
                if (nc[i].data.posY === 0) {
                    if (nc[i].data.posX === type ? 1 : 2) {
                        startParity = 'backhand';
                    }
                }
                if (nc[i].data.posY === 2) {
                    if (nc[i].data.posX === type ? 1 : 2) {
                        startParity = 'forehand';
                    }
                }
            }
            if (nc[i].type !== 'note') {
                continue;
            }
            let note = nc[i] as NoteContainerNote;
            if (note.data.color === Math.abs(type - 1)) {
                continue;
            }
            if (note.data.color === type) {
                if (startParity !== 'neutral') {
                    break;
                }
                const startTime = note.data.time;
                for (let j = i; j < nc.length; j++) {
                    if (nc[j].data.time > note.data.time + 0.001 && startTime < note.data.time + 0.001) {
                        break;
                    }
                    note = nc[j] as NoteContainerNote;
                    if (noteInitParity[note.data.color].forehand.includes(note.data.direction)) {
                        return 'backhand';
                    }
                    if (noteInitParity[note.data.color].backhand.includes(note.data.direction)) {
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
    private predictStartRotation(nc: NoteContainer[], color: number): number {
        let rotation = 0;
        for (let i = 0, len = nc.length; i < len; i++) {
            if (nc[i].type !== 'note') {
                continue;
            }
            let note = nc[i] as NoteContainerNote;
            if (note.data.color !== color) {
                continue;
            }
            if (note.data.color === color) {
                const startTime = note.data.time;
                for (let j = i; j < nc.length; j++) {
                    if (nc[j].data.time > note.data.time + 0.001 && startTime < note.data.time + 0.001) {
                        break;
                    }
                    note = nc[j] as NoteContainerNote;
                    if (note.data.direction !== 8) {
                        return noteInitRotation[note.data.color][note.data.direction];
                    }
                    if (note.data.direction === 8) {
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
    private predictStartPosition(notes: NoteContainer[], type: number): [number, number] {
        return type ? [-0.5, 1] : [0.5, 1];
    }
}
