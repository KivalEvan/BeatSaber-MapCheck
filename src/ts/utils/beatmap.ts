import { logger, resolveNoteAngle } from 'bsmap';
import { shortRotDistance } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { PrecalculateKey } from '../types/precalculate';

logger.setLevel(0);

export function noteDistance(
   note: Pick<types.wrapper.IWrapGridObject, 'posX' | 'posY' | 'customData'>,
   target: Pick<types.wrapper.IWrapGridObject, 'posX' | 'posY' | 'customData'>,
): number {
   const [pX, pY] = note.customData[PrecalculateKey.POSITION];
   const [qX, qY] = target.customData[PrecalculateKey.POSITION];
   return Math.sqrt(Math.pow(qX - pX, 2) + Math.pow(qY - pY, 2));
}

export function isNotePointing(
   note: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   target: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   const [pX, pY] = note.customData[PrecalculateKey.POSITION];
   const [qX, qY] = target.customData[PrecalculateKey.POSITION];
   const pA = note.customData[PrecalculateKey.ANGLE];
   const pqA = (Math.atan2(qY - pY, qX - pX) * 180) / Math.PI + 90;
   return shortRotDistance(pA, pqA, 360) <= angleTolerance;
}

export function isNoteSwingable(
   noteA: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   noteB: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   return (
      isNotePointing(noteA, noteB, angleTolerance) || isNotePointing(noteB, noteA, angleTolerance)
   );
}

export function isNotePointingRaw(
   note: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction'> & {
      angleOffset?: number;
   },
   target: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   const [pX, pY] = [note.posX, note.posY];
   const [qX, qY] = [target.posX, target.posY];
   const pA = resolveNoteAngle(note.direction);
   const pqA = (Math.atan2(qY - pY, qX - pX) * 180) / Math.PI + 90;
   return shortRotDistance(pA, pqA, 360) <= angleTolerance;
}

export function isNoteSwingableRaw(
   noteA: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   noteB: Pick<types.wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   return (
      isNotePointingRaw(noteA, noteB, angleTolerance) ||
      isNotePointingRaw(noteB, noteA, angleTolerance)
   );
}
