import { ColorNote } from '../../beatmap/core/colorNote.ts';
import { NoteDirection } from '../../beatmap/shared/constants.ts';
import type { IWrapBaseNote } from '../../types/beatmap/wrapper/baseNote.ts';
import { radToDeg, shortRotDistance } from '../../utils/math.ts';

// TODO: update with new position/rotation system
export function isEnd(currNote: IWrapBaseNote, prevNote: IWrapBaseNote, cd: number): boolean {
   // fuck u and ur dot note stack
   if (
      currNote.direction === NoteDirection.ANY &&
      prevNote.direction === NoteDirection.ANY &&
      cd !== NoteDirection.ANY
   ) {
      // if end note on right side
      if (currNote.posX > prevNote.posX) {
         if (
            cd === NoteDirection.UP_RIGHT ||
            cd === NoteDirection.RIGHT ||
            cd === NoteDirection.DOWN_RIGHT
         ) {
            return true;
         }
      }
      // if end note on left side
      if (currNote.posX < prevNote.posX) {
         if (
            cd === NoteDirection.DOWN_LEFT ||
            cd === NoteDirection.LEFT ||
            cd === NoteDirection.UP_LEFT
         ) {
            return true;
         }
      }
      // if end note is above
      if (currNote.posY > prevNote.posY) {
         if (
            cd === NoteDirection.UP_LEFT ||
            cd === NoteDirection.UP ||
            cd === NoteDirection.UP_RIGHT
         ) {
            return true;
         }
      }
      // if end note is below
      if (currNote.posY < prevNote.posY) {
         if (
            cd === NoteDirection.DOWN_LEFT ||
            cd === NoteDirection.DOWN ||
            cd === NoteDirection.DOWN_RIGHT
         ) {
            return true;
         }
      }
   }
   // if end note on right side
   if (currNote.posX > prevNote.posX) {
      // check if end note is arrowed
      if (
         currNote.direction === NoteDirection.UP_RIGHT ||
         currNote.direction === NoteDirection.RIGHT ||
         currNote.direction === NoteDirection.DOWN_RIGHT
      ) {
         return true;
      }
      // check if end note is dot and start arrow is pointing to it
      if (
         (prevNote.direction === NoteDirection.UP_RIGHT ||
            prevNote.direction === NoteDirection.RIGHT ||
            prevNote.direction === NoteDirection.DOWN_RIGHT) &&
         currNote.direction === NoteDirection.ANY
      ) {
         return true;
      }
   }
   // if end note on left side
   if (currNote.posX < prevNote.posX) {
      if (
         currNote.direction === NoteDirection.DOWN_LEFT ||
         currNote.direction === NoteDirection.LEFT ||
         currNote.direction === NoteDirection.UP_LEFT
      ) {
         return true;
      }
      if (
         (prevNote.direction === NoteDirection.DOWN_LEFT ||
            prevNote.direction === NoteDirection.LEFT ||
            prevNote.direction === NoteDirection.UP_LEFT) &&
         currNote.direction === NoteDirection.ANY
      ) {
         return true;
      }
   }
   // if end note is above
   if (currNote.posY > prevNote.posY) {
      if (
         currNote.direction === NoteDirection.UP_LEFT ||
         currNote.direction === NoteDirection.UP ||
         currNote.direction === NoteDirection.UP_RIGHT
      ) {
         return true;
      }
      if (
         (prevNote.direction === NoteDirection.UP_LEFT ||
            prevNote.direction === NoteDirection.UP ||
            prevNote.direction === NoteDirection.UP_RIGHT) &&
         currNote.direction === NoteDirection.ANY
      ) {
         return true;
      }
   }
   // if end note is below
   if (currNote.posY < prevNote.posY) {
      if (
         currNote.direction === NoteDirection.DOWN_LEFT ||
         currNote.direction === NoteDirection.DOWN ||
         currNote.direction === NoteDirection.DOWN_RIGHT
      ) {
         return true;
      }
      if (
         (prevNote.direction === NoteDirection.DOWN_LEFT ||
            prevNote.direction === NoteDirection.DOWN ||
            prevNote.direction === NoteDirection.DOWN_RIGHT) &&
         currNote.direction === NoteDirection.ANY
      ) {
         return true;
      }
   }
   return false;
}

/**
 * Check if the note intersect on swing path by angle and distance.
 * ```ts
 * if (isIntersect(note1, note2, [[20, 1.5]])) {}
 * ```
 */
// a fkin abomination that's what currNote is
export function isIntersect(
   currNote: IWrapBaseNote,
   compareTo: IWrapBaseNote,
   angleDistances: [number, number, number?][],
   ahead = false,
): [boolean, boolean] {
   const [nX1, nY1] = currNote.getPosition();
   const [nX2, nY2] = compareTo.getPosition();
   const angle = ahead ? 540 : 360;
   let resultN1 = false;
   if (currNote.direction !== 8) {
      const nA1 = currNote.getAngle();
      const a = (radToDeg(Math.atan2(nY1 - nY2, nX1 - nX2)) + 450) % 360;
      for (const [angleRange, maxDistance, offsetT] of angleDistances) {
         const offset = offsetT ?? 0;
         const aS = (nA1 + angle - angleRange + offset) % 360;
         const aE = (nA1 + angle + angleRange + offset) % 360;
         resultN1 =
            (maxDistance >= Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
               ((aS < aE && aS <= a && a <= aE) || (aS >= aE && (a <= aE || a >= aS)))) ||
            resultN1;
         if (resultN1) {
            break;
         }
      }
   }
   let resultN2 = false;
   if (compareTo instanceof ColorNote && compareTo.direction !== 8) {
      const nA2 = compareTo.getAngle();
      const a = (radToDeg(Math.atan2(nY2 - nY1, nX2 - nX1)) + 450) % 360;
      for (const [angleRange, maxDistance, offsetT] of angleDistances) {
         const offset = offsetT ?? 0;
         const aS = (nA2 + angle - angleRange + offset) % 360;
         const aE = (nA2 + angle + angleRange + offset) % 360;
         resultN2 =
            (maxDistance >= Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
               ((aS < aE && aS <= a && a <= aE) || (aS >= aE && (a <= aE || a >= aS)))) ||
            resultN2;
         if (resultN2) {
            break;
         }
      }
   }
   return [resultN1, resultN2];
}

// TODO: update with new position/rotation system
export function predictDirection(currNote: IWrapBaseNote, prevNote: IWrapBaseNote): number {
   if (isEnd(currNote, prevNote, NoteDirection.ANY)) {
      return currNote.direction === NoteDirection.ANY ? prevNote.direction : currNote.direction;
   }
   if (currNote.direction !== NoteDirection.ANY) {
      return currNote.direction;
   }
   if (currNote.time > prevNote.time) {
      // if end note on right side
      if (currNote.posX > prevNote.posX) {
         if (currNote.isHorizontal(prevNote)) {
            return NoteDirection.RIGHT;
         }
      }
      // if end note on left side
      if (currNote.posX < prevNote.posX) {
         if (currNote.isHorizontal(prevNote)) {
            return NoteDirection.LEFT;
         }
      }
      // if end note is above
      if (currNote.posY > prevNote.posY) {
         if (currNote.isVertical(prevNote)) {
            return NoteDirection.UP;
         }
         if (currNote.posX > prevNote.posX) {
            return NoteDirection.UP_RIGHT;
         }
         if (currNote.posX < prevNote.posX) {
            return NoteDirection.UP_LEFT;
         }
      }
      // if end note is below
      if (currNote.posY < prevNote.posY) {
         if (currNote.isVertical(prevNote)) {
            return NoteDirection.DOWN;
         }
         if (currNote.posX > prevNote.posX) {
            return NoteDirection.DOWN_RIGHT;
         }
         if (currNote.posX < prevNote.posX) {
            return NoteDirection.DOWN_LEFT;
         }
      }
   }
   return NoteDirection.ANY;
}

/**
 * Check the angle equality of the two notes.
 * @param {(IWrapBaseNote|number|null)}  - First beatmap note, note `direction`, or null value
 * @param {(IWrapBaseNote|number|null)} n2 - Second beatmap note, note `direction`, or null value
 * @param {number} angleTol - Angle tolerance
 * @param {boolean} equal - If it should check inner or outer angle
 * @returns {boolean} If condition is met
 */
export function checkDirection(
   n1: IWrapBaseNote | number | null,
   n2: IWrapBaseNote | number | null,
   angleTol: number,
   equal: boolean,
): boolean {
   let nA1!: number;
   let nA2!: number;
   if (n1 === null || n2 === null) {
      return false;
   }
   if (typeof n1 === 'number') {
      nA1 = n1;
   } else {
      if (n1.direction === NoteDirection.ANY) {
         return false;
      }
      nA1 = n1.getAngle();
   }
   if (typeof n2 === 'number') {
      nA2 = n2;
   } else {
      if (n2.direction === NoteDirection.ANY) {
         return false;
      }
      nA2 = n2.getAngle();
   }
   return equal
      ? shortRotDistance(nA1, nA2, 360) <= angleTol
      : shortRotDistance(nA1, nA2, 360) >= angleTol;
}
