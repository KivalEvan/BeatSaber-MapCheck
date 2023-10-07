import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { ISwingContainer } from './types/swing';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import { checkDirection } from '../placement/note';
import { NoteDirection } from '../../beatmap/shared/constants';
import { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject';

export default class Swing implements ISwingContainer {
   time: number;
   duration: number;
   minSpeed: number;
   maxSpeed: number;
   ebpm: number;
   ebpmSwing: number;
   data: NoteContainer[];

   protected constructor(sc: ISwingContainer) {
      this.time = sc.time;
      this.duration = sc.duration;
      this.minSpeed = sc.minSpeed;
      this.maxSpeed = sc.maxSpeed;
      this.ebpm = sc.ebpm;
      this.ebpmSwing = sc.ebpmSwing;
      this.data = sc.data;
   }

   static generate(nc: NoteContainer[], bpm: BeatPerMinute): ISwingContainer[] {
      const sc: ISwingContainer[] = [];
      let ebpm = 0;
      let ebpmSwing = 0;
      let minSpeed: number;
      let maxSpeed: number;
      const firstNote: { [key: number]: NoteContainerNote } = {};
      const lastNote: { [key: number]: NoteContainerNote } = {};
      const swingNoteArray: { [key: number]: NoteContainer[] } = {
         0: [],
         1: [],
      };
      for (const n of nc) {
         if (n.type !== 'note') {
            continue;
         }
         minSpeed = 0;
         maxSpeed = Number.MAX_SAFE_INTEGER;
         if (lastNote[n.data.color]) {
            if (this.next(n, lastNote[n.data.color], bpm, swingNoteArray[n.data.color])) {
               minSpeed = this.calcMinSliderSpeed(swingNoteArray[n.data.color], bpm);
               maxSpeed = this.calcMaxSliderSpeed(swingNoteArray[n.data.color], bpm);
               if (!(minSpeed > 0 && maxSpeed !== Infinity)) {
                  minSpeed = 0;
                  maxSpeed = 0;
               }
               ebpmSwing = this.calcEBPMBetweenObject(n.data, firstNote[n.data.color].data, bpm);
               ebpm = this.calcEBPMBetweenObject(n.data, lastNote[n.data.color].data, bpm);
               sc.push({
                  time: firstNote[n.data.color].data.time,
                  duration: lastNote[n.data.color].data.time - firstNote[n.data.color].data.time,
                  data: swingNoteArray[n.data.color],
                  ebpm,
                  ebpmSwing,
                  maxSpeed,
                  minSpeed,
               });
               firstNote[n.data.color] = n;
               swingNoteArray[n.data.color] = [];
            }
         } else {
            firstNote[n.data.color] = n;
         }
         lastNote[n.data.color] = n;
         swingNoteArray[n.data.color].push(n);
      }
      for (let color = 0; color < 2; color++) {
         if (lastNote[color]) {
            minSpeed = this.calcMinSliderSpeed(swingNoteArray[color], bpm);
            maxSpeed = this.calcMaxSliderSpeed(swingNoteArray[color], bpm);
            if (!(minSpeed > 0 && maxSpeed !== Infinity)) {
               minSpeed = 0;
               maxSpeed = 0;
            }
            sc.push({
               time: firstNote[color].data.time,
               duration: lastNote[color].data.time - firstNote[color].data.time,
               data: swingNoteArray[color],
               ebpm,
               ebpmSwing,
               maxSpeed,
               minSpeed,
            });
         }
      }
      return sc;
   }

   // Thanks Qwasyx#3000 for improved swing detection
   static next(
      currNote: NoteContainer,
      prevNote: NoteContainer,
      bpm: BeatPerMinute,
      context?: NoteContainer[],
   ): boolean {
      if (currNote.type === 'bomb' || prevNote.type === 'bomb') {
         throw new Error('Invalid type');
      }
      if (
         context &&
         context.length > 0 &&
         bpm.toRealTime(prevNote.data.time) + 0.005 < bpm.toRealTime(currNote.data.time) &&
         currNote.data.direction !== NoteDirection.ANY
      ) {
         for (const n of context) {
            if (n.type === 'note') {
               if (
                  n.data.direction !== NoteDirection.ANY &&
                  checkDirection(currNote.data, n.data, 90, false)
               ) {
                  return true;
               }
            }
         }
      }
      if (context && context.length > 0) {
         for (const other of context) {
            if (other.type === 'note' && currNote.data.isInline(other.data)) {
               return true;
            }
         }
      }
      return (
         (currNote.data.isWindow(prevNote.data) &&
            bpm.toRealTime(currNote.data.time - prevNote.data.time) > 0.08) ||
         bpm.toRealTime(currNote.data.time - prevNote.data.time) > 0.07
      );
   }

   static calcEBPMBetweenObject(
      currObj: IWrapBaseObject,
      prevObj: IWrapBaseObject,
      bpm: BeatPerMinute,
   ): number {
      return (
         bpm.value /
         (bpm.toBeatTime(bpm.toRealTime(currObj.time) - bpm.toRealTime(prevObj.time)) * 2)
      );
   }

   private static calcMinSliderSpeed(notes: NoteContainer[], bpm: BeatPerMinute): number {
      let hasStraight = false;
      let hasDiagonal = false;
      let curvedSpeed = 0;
      const speed = bpm.toRealTime(
         Math.max(
            ...notes.map((_, i) => {
               if (i === 0) {
                  return 0;
               }
               if (
                  (notes[i].data.isHorizontal(notes[i - 1].data) ||
                     notes[i].data.isVertical(notes[i - 1].data)) &&
                  !hasStraight
               ) {
                  hasStraight = true;
                  curvedSpeed =
                     (notes[i].data.time - notes[i - 1].data.time) /
                     (notes[i].data.getDistance(notes[i - 1].data) || 1);
               }
               hasDiagonal =
                  notes[i].data.isDiagonal(notes[i - 1].data) ||
                  notes[i].data.isSlantedWindow(notes[i - 1].data) ||
                  hasDiagonal;
               return (
                  (notes[i].data.time - notes[i - 1].data.time) /
                  (notes[i].data.getDistance(notes[i - 1].data) || 1)
               );
            }),
         ),
      );
      if (hasStraight && hasDiagonal) {
         return bpm.toRealTime(curvedSpeed);
      }
      return speed;
   }

   private static calcMaxSliderSpeed(notes: NoteContainer[], bpm: BeatPerMinute): number {
      let hasStraight = false;
      let hasDiagonal = false;
      let curvedSpeed = Number.MAX_SAFE_INTEGER;
      const speed = bpm.toRealTime(
         Math.min(
            ...notes.map((_, i) => {
               if (i === 0) {
                  return Number.MAX_SAFE_INTEGER;
               }
               if (
                  (notes[i].data.isHorizontal(notes[i - 1].data) ||
                     notes[i].data.isVertical(notes[i - 1].data)) &&
                  !hasStraight
               ) {
                  hasStraight = true;
                  curvedSpeed =
                     (notes[i].data.time - notes[i - 1].data.time) /
                     (notes[i].data.getDistance(notes[i - 1].data) || 1);
               }
               hasDiagonal =
                  notes[i].data.isDiagonal(notes[i - 1].data) ||
                  notes[i].data.isSlantedWindow(notes[i - 1].data) ||
                  hasDiagonal;
               return (
                  (notes[i].data.time - notes[i - 1].data.time) /
                  (notes[i].data.getDistance(notes[i - 1].data) || 1)
               );
            }),
         ),
      );
      if (hasStraight && hasDiagonal) {
         return bpm.toRealTime(curvedSpeed);
      }
      return speed;
   }
}
