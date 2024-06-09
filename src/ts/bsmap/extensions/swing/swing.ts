import type { TimeProcessor } from '../../beatmap/helpers/timeProcessor.ts';
import type { ISwingContainer } from './types/swing.ts';
import { checkDirection } from '../placement/note.ts';
import { NoteDirection } from '../../beatmap/shared/constants.ts';
import type { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject.ts';
import type { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote.ts';

export default class Swing implements ISwingContainer {
   time: number;
   duration: number;
   minSpeed: number;
   maxSpeed: number;
   ebpm: number;
   ebpmSwing: number;
   data: IWrapColorNote[];

   protected constructor(sc: ISwingContainer) {
      this.time = sc.time;
      this.duration = sc.duration;
      this.minSpeed = sc.minSpeed;
      this.maxSpeed = sc.maxSpeed;
      this.ebpm = sc.ebpm;
      this.ebpmSwing = sc.ebpmSwing;
      this.data = sc.data;
   }

   static generate(nc: IWrapColorNote[], bpm: TimeProcessor): ISwingContainer[] {
      const sc: ISwingContainer[] = [];
      let ebpm = 0;
      let ebpmSwing = 0;
      let minSpeed: number;
      let maxSpeed: number;
      const firstNote: { [key: number]: IWrapColorNote } = {};
      const lastNote: { [key: number]: IWrapColorNote } = {};
      const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
         0: [],
         1: [],
      };
      for (const n of nc) {
         minSpeed = 0;
         maxSpeed = Number.MAX_SAFE_INTEGER;
         if (lastNote[n.color]) {
            if (this.next(n, lastNote[n.color], bpm, swingNoteArray[n.color])) {
               minSpeed = this.calcMinSliderSpeed(swingNoteArray[n.color], bpm);
               maxSpeed = this.calcMaxSliderSpeed(swingNoteArray[n.color], bpm);
               if (!(minSpeed > 0 && maxSpeed !== Infinity)) {
                  minSpeed = 0;
                  maxSpeed = 0;
               }
               ebpmSwing = this.calcEBPMBetweenObject(n, firstNote[n.color], bpm);
               ebpm = this.calcEBPMBetweenObject(n, lastNote[n.color], bpm);
               sc.push({
                  time: firstNote[n.color].time,
                  duration: lastNote[n.color].time - firstNote[n.color].time,
                  data: swingNoteArray[n.color],
                  ebpm,
                  ebpmSwing,
                  maxSpeed,
                  minSpeed,
               });
               firstNote[n.color] = n;
               swingNoteArray[n.color] = [];
            }
         } else {
            firstNote[n.color] = n;
         }
         lastNote[n.color] = n;
         swingNoteArray[n.color].push(n);
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
               time: firstNote[color].time,
               duration: lastNote[color].time - firstNote[color].time,
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
      currNote: IWrapColorNote,
      prevNote: IWrapColorNote,
      bpm: TimeProcessor,
      context?: IWrapColorNote[],
   ): boolean {
      if (
         context &&
         context.length > 0 &&
         bpm.toRealTime(prevNote.time) + 0.005 < bpm.toRealTime(currNote.time) &&
         currNote.direction !== NoteDirection.ANY
      ) {
         for (const n of context) {
            if (n.direction !== NoteDirection.ANY && checkDirection(currNote, n, 90, false)) {
               return true;
            }
         }
      }
      if (context && context.length > 0) {
         for (const other of context) {
            if (currNote.isInline(other)) {
               return true;
            }
         }
      }
      return (
         (currNote.isWindow(prevNote) && bpm.toRealTime(currNote.time - prevNote.time) > 0.08) ||
         bpm.toRealTime(currNote.time - prevNote.time) > 0.07
      );
   }

   static calcEBPMBetweenObject(
      currObj: IWrapBaseObject,
      prevObj: IWrapBaseObject,
      timeProc: TimeProcessor,
   ): number {
      return (
         timeProc.bpm /
         (timeProc.toBeatTime(
            timeProc.toRealTime(currObj.time) - timeProc.toRealTime(prevObj.time),
         ) *
            2)
      );
   }

   private static calcMinSliderSpeed(notes: IWrapColorNote[], bpm: TimeProcessor): number {
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
                  (notes[i].isHorizontal(notes[i - 1]) || notes[i].isVertical(notes[i - 1])) &&
                  !hasStraight
               ) {
                  hasStraight = true;
                  curvedSpeed =
                     (notes[i].time - notes[i - 1].time) /
                     (notes[i].getDistance(notes[i - 1]) || 1);
               }
               hasDiagonal =
                  notes[i].isDiagonal(notes[i - 1]) ||
                  notes[i].isSlantedWindow(notes[i - 1]) ||
                  hasDiagonal;
               return (
                  (notes[i].time - notes[i - 1].time) / (notes[i].getDistance(notes[i - 1]) || 1)
               );
            }),
         ),
      );
      if (hasStraight && hasDiagonal) {
         return bpm.toRealTime(curvedSpeed);
      }
      return speed;
   }

   private static calcMaxSliderSpeed(notes: IWrapColorNote[], bpm: TimeProcessor): number {
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
                  (notes[i].isHorizontal(notes[i - 1]) || notes[i].isVertical(notes[i - 1])) &&
                  !hasStraight
               ) {
                  hasStraight = true;
                  curvedSpeed =
                     (notes[i].time - notes[i - 1].time) /
                     (notes[i].getDistance(notes[i - 1]) || 1);
               }
               hasDiagonal =
                  notes[i].isDiagonal(notes[i - 1]) ||
                  notes[i].isSlantedWindow(notes[i - 1]) ||
                  hasDiagonal;
               return (
                  (notes[i].time - notes[i - 1].time) / (notes[i].getDistance(notes[i - 1]) || 1)
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
