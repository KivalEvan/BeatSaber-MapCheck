// rotation 0 means down vertical note
// TODO: proper rotation check based on position
// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA there's still more work needed for parity check
// TODO: cleanup the implementation
import {
   NoteContainer,
   NoteContainerBomb,
   NoteContainerNote,
} from '../../types/beatmap/wrapper/container';
import { ParityState, ParityStatus, ParitySwitch } from './types/parity';
import { predictDirection } from '../placement/note';
import { NoteColor, NoteDirection, PosX, PosY } from '../../beatmap/shared/constants';

const noteInitParity: {
   [key: number]: { backhand: number[]; forehand: number[] };
} = {
   [NoteColor.RED]: {
      forehand: [
         NoteDirection.DOWN,
         NoteDirection.RIGHT,
         NoteDirection.DOWN_LEFT,
         NoteDirection.DOWN_RIGHT,
      ],
      backhand: [
         NoteDirection.UP,
         NoteDirection.LEFT,
         NoteDirection.UP_LEFT,
         NoteDirection.UP_RIGHT,
      ],
   },
   [NoteColor.BLUE]: {
      forehand: [
         NoteDirection.DOWN,
         NoteDirection.LEFT,
         NoteDirection.DOWN_LEFT,
         NoteDirection.DOWN_RIGHT,
      ],
      backhand: [
         NoteDirection.UP,
         NoteDirection.RIGHT,
         NoteDirection.UP_LEFT,
         NoteDirection.UP_RIGHT,
      ],
   },
};
const noteInitRotation: { [key: number]: number[] } = {
   [NoteColor.RED]: [0, 0, 90, 90, 45, -45, 45, -45],
   [NoteColor.BLUE]: [0, 0, -90, -90, -45, 45, -45, 45],
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

   check(noteContext: NoteContainer[], bombContext: NoteContainerBomb[]): ParityStatus {
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
         if (bomb.data.posY === PosY.BOTTOM) {
            if (bomb.data.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               currentState = 'backhand';
               currentRotation = 0;
            }
         }
         if (bomb.data.posY === PosY.TOP) {
            if (bomb.data.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               currentState = 'forehand';
               currentRotation = 0;
            }
         }
      });

      let prevNote!: NoteContainerNote;
      let expectedDirection = NoteDirection.ANY;
      for (const note of noteContext) {
         if (note.type !== 'note') {
            continue;
         }
         if (note.data.direction !== NoteDirection.ANY) {
            expectedDirection = note.data.direction;
         }
         if (prevNote && expectedDirection === NoteDirection.ANY) {
            expectedDirection = predictDirection(note.data, prevNote.data);
         }
         prevNote = note;
      }
      if (expectedDirection === NoteDirection.ANY) {
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
         (currentRotation > parityRotation
            ? currentRotation - parityRotation
            : parityRotation - currentRotation) > this.allowedRotation
      ) {
         return 'warning';
      }

      return 'none';
   }
   next(noteContext: NoteContainer[], bombContext: NoteContainerBomb[]): void {
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
                  if (this.state === 'neutral' && note.data.direction === NoteDirection.ANY) {
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
         if (bomb.data.posY === PosY.BOTTOM) {
            if (bomb.data.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               this.state = 'forehand';
               this.rotation = 0;
            }
         }
         if (bomb.data.posY === PosY.TOP) {
            if (bomb.data.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               this.state = 'backhand';
               this.rotation = 0;
            }
         }
      });

      let prevNote!: NoteContainerNote;
      let expectedDirection = NoteDirection.ANY;
      for (const note of noteContext) {
         if (note.type !== 'note') {
            continue;
         }
         if (note.data.direction !== NoteDirection.ANY) {
            expectedDirection = note.data.direction;
         }
         if (prevNote && expectedDirection === NoteDirection.ANY) {
            expectedDirection = predictDirection(note.data, prevNote.data);
         }
         prevNote = note;
      }
      if (expectedDirection !== NoteDirection.ANY) {
         this.rotation = noteParityRotation[this.color][this.state][expectedDirection];
      }
   }

   private predictStartState(nc: NoteContainer[], type: number): ParityState {
      let startParity: ParityState = 'neutral';
      for (let i = 0, len = nc.length; i < len; i++) {
         if (nc[i].type === 'bomb') {
            if (nc[i].data.posY === PosY.BOTTOM) {
               if (nc[i].data.posX === type ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT) {
                  startParity = 'backhand';
               }
            }
            if (nc[i].data.posY === PosY.TOP) {
               if (nc[i].data.posX === type ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT) {
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
               if (startParity === 'neutral' && note.data.direction === NoteDirection.ANY) {
                  if (note.data.posY === PosY.BOTTOM) {
                     startParity = 'backhand';
                  }
                  if (note.data.posY > PosY.BOTTOM) {
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
               if (note.data.direction !== NoteDirection.ANY) {
                  return noteInitRotation[note.data.color][note.data.direction];
               }
               if (note.data.direction === NoteDirection.ANY) {
                  if (note.data.posY === PosY.BOTTOM) {
                     if (note.data.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.data.color][6];
                     }
                     if (note.data.posX === PosX.RIGHT) {
                        rotation = noteInitRotation[note.data.color][7];
                     }
                  }
                  if (note.data.posY === PosY.MIDDLE) {
                     if (note.data.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.data.color][2];
                     }
                     if (note.data.posX === PosX.RIGHT) {
                        rotation = noteInitRotation[note.data.color][3];
                     }
                  }
                  if (note.data.posY === PosY.BOTTOM) {
                     if (note.data.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.data.color][4];
                     }
                     if (note.data.posX === PosX.RIGHT) {
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
   // deno-lint-ignore no-unused-vars
   private predictStartPosition(notes: NoteContainer[], type: number): [number, number] {
      return type ? [-0.5, 1] : [0.5, 1];
   }
}
