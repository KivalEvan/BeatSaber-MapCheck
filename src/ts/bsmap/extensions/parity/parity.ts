// rotation 0 means down vertical note
// TODO: proper rotation check based on position
// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA there's still more work needed for parity check
// TODO: cleanup the implementation
import { type ParityState, type ParityStatus, ParitySwitch } from './types/parity.ts';
import { predictDirection } from '../placement/note.ts';
import { NoteColor, NoteDirection, PosX, PosY } from '../../beatmap/shared/constants.ts';
import type { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapBombNote } from '../../types/beatmap/wrapper/bombNote.ts';
import { BombNote } from '../../beatmap/core/bombNote.ts';

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
      notes: IWrapColorNote[],
      bombs: IWrapBombNote[],
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
         this.state = this.predictStartState(notes, bombs, type);
         this.rotation = this.predictStartRotation(notes, type);
      }
      this.position = this.predictStartPosition(notes, type);
   }

   check(noteContext: IWrapColorNote[], bombContext: IWrapBombNote[]): ParityStatus {
      if (this.state === 'neutral') {
         return 'none';
      }
      if (!noteContext.length) {
         throw new Error('no notes were given');
      }

      const startTime = noteContext[0].time;
      const noteType = this.color;
      let currentState = this.state;
      let currentRotation = this.rotation;

      bombContext.forEach((bomb) => {
         if (bomb.time - 0.001 > startTime) {
            return;
         }
         if (bomb.posY === PosY.BOTTOM) {
            if (bomb.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               currentState = 'backhand';
               currentRotation = 0;
            }
         }
         if (bomb.posY === PosY.TOP) {
            if (bomb.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               currentState = 'forehand';
               currentRotation = 0;
            }
         }
      });

      let prevNote!: IWrapColorNote;
      let expectedDirection = NoteDirection.ANY;
      for (const note of noteContext) {
         if (note.direction !== NoteDirection.ANY) {
            expectedDirection = note.direction;
         }
         if (prevNote && expectedDirection === NoteDirection.ANY) {
            expectedDirection = predictDirection(note, prevNote);
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
   next(noteContext: IWrapColorNote[], bombContext: IWrapBombNote[]): void {
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
                  const note = noteContext[i] as IWrapColorNote;
                  if (noteInitParity[note.color].forehand.includes(note.direction)) {
                     this.state = 'backhand';
                     break;
                  }
                  if (noteInitParity[note.color].backhand.includes(note.direction)) {
                     this.state = 'forehand';
                     break;
                  }
                  if (this.state === 'neutral' && note.direction === NoteDirection.ANY) {
                     if (note.posY === 0) {
                        this.state = 'backhand';
                     }
                     if (note.posY > 0) {
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

      const startTime = noteContext[0].time;
      const noteType = this.color;

      bombContext.forEach((bomb) => {
         if (bomb.time - 0.001 > startTime) {
            return;
         }
         if (bomb.posY === PosY.BOTTOM) {
            if (bomb.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               this.state = 'forehand';
               this.rotation = 0;
            }
         }
         if (bomb.posY === PosY.TOP) {
            if (bomb.posX === (noteType ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT)) {
               this.state = 'backhand';
               this.rotation = 0;
            }
         }
      });

      let prevNote!: IWrapColorNote;
      let expectedDirection = NoteDirection.ANY;
      for (const note of noteContext) {
         if (note.direction !== NoteDirection.ANY) {
            expectedDirection = note.direction;
         }
         if (prevNote && expectedDirection === NoteDirection.ANY) {
            expectedDirection = predictDirection(note, prevNote);
         }
         prevNote = note;
      }
      if (expectedDirection !== NoteDirection.ANY) {
         this.rotation = noteParityRotation[this.color][this.state][expectedDirection];
      }
   }

   private predictStartState(
      notes: IWrapColorNote[],
      bombs: IWrapBombNote[],
      type: number,
   ): ParityState {
      const nc = [...notes, ...bombs].sort((a, b) => a.time - b.time);
      let startParity: ParityState = 'neutral';
      for (let i = 0, len = nc.length; i < len; i++) {
         if (nc[i] instanceof BombNote) {
            if (nc[i].posY === PosY.BOTTOM) {
               if (nc[i].posX === type ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT) {
                  startParity = 'backhand';
               }
            }
            if (nc[i].posY === PosY.TOP) {
               if (nc[i].posX === type ? PosX.MIDDLE_RIGHT : PosX.MIDDLE_LEFT) {
                  startParity = 'forehand';
               }
            }
            continue;
         }
         let note = nc[i] as IWrapColorNote;
         if (note.color === Math.abs(type - 1)) {
            continue;
         }
         if (note.color === type) {
            if (startParity !== 'neutral') {
               break;
            }
            const startTime = note.time;
            for (let j = i; j < nc.length; j++) {
               if (nc[j].time > note.time + 0.001 && startTime < note.time + 0.001) {
                  break;
               }
               note = nc[j] as IWrapColorNote;
               if (noteInitParity[note.color].forehand.includes(note.direction)) {
                  return 'backhand';
               }
               if (noteInitParity[note.color].backhand.includes(note.direction)) {
                  return 'forehand';
               }
               if (startParity === 'neutral' && note.direction === NoteDirection.ANY) {
                  if (note.posY === PosY.BOTTOM) {
                     startParity = 'backhand';
                  }
                  if (note.posY > PosY.BOTTOM) {
                     startParity = 'forehand';
                  }
               }
            }
            break;
         }
      }
      return startParity;
   }
   private predictStartRotation(nc: IWrapColorNote[], color: number): number {
      let rotation = 0;
      for (let i = 0, len = nc.length; i < len; i++) {
         let note = nc[i];
         if (note.color !== color) {
            continue;
         }
         if (note.color === color) {
            const startTime = note.time;
            for (let j = i; j < nc.length; j++) {
               if (nc[j].time > note.time + 0.001 && startTime < note.time + 0.001) {
                  break;
               }
               note = nc[j];
               if (note.direction !== NoteDirection.ANY) {
                  return noteInitRotation[note.color][note.direction];
               }
               if (note.direction === NoteDirection.ANY) {
                  if (note.posY === PosY.BOTTOM) {
                     if (note.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.color][6];
                     }
                     if (note.posX === PosX.RIGHT) {
                        rotation = noteInitRotation[note.color][7];
                     }
                  }
                  if (note.posY === PosY.MIDDLE) {
                     if (note.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.color][2];
                     }
                     if (note.posX === PosX.RIGHT) {
                        rotation = noteInitRotation[note.color][3];
                     }
                  }
                  if (note.posY === PosY.BOTTOM) {
                     if (note.posX === PosX.LEFT) {
                        rotation = noteInitRotation[note.color][4];
                     }
                     if (note.posX === PosX.RIGHT) {
                        rotation = noteInitRotation[note.color][5];
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
   private predictStartPosition(_: IWrapColorNote[], type: number): [number, number] {
      return type ? [-0.5, 1] : [0.5, 1];
   }
}
