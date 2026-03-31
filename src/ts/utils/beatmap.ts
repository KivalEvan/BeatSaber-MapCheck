import {
   BezierPath,
   degToRad,
   EnvironmentName,
   EventKind,
   lowestDifferenceMod,
   nearEqual,
   NoteDirection,
   resolveNoteAngle,
   SliderMidAnchorMode,
   BasicTrackDefinitions,
   Vector2,
   Vector3,
   vectorAdd,
   vectorMul,
   vectorSub,
   type wrapper,
} from 'bsmap';
import { PrecalculateKey } from '../types/precalculate';
import { vectorRotate } from './vector';

export function noteDistance(
   note: Pick<wrapper.IWrapGridObject, 'posX' | 'posY' | 'customData'>,
   target: Pick<wrapper.IWrapGridObject, 'posX' | 'posY' | 'customData'>,
): number {
   const [pX, pY] = note.customData[PrecalculateKey.POSITION];
   const [qX, qY] = target.customData[PrecalculateKey.POSITION];
   return Math.sqrt(Math.pow(qX - pX, 2) + Math.pow(qY - pY, 2));
}

export function isNotePointing(
   note: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   target: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   const [pX, pY] = note.customData[PrecalculateKey.POSITION];
   const [qX, qY] = target.customData[PrecalculateKey.POSITION];
   const pA = note.customData[PrecalculateKey.ANGLE];
   const pqA = (Math.atan2(qY - pY, qX - pX) * 180) / Math.PI + 90;
   return lowestDifferenceMod(pA, pqA, 360) <= angleTolerance;
}

export function isNoteSwingable(
   noteA: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   noteB: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   return (
      isNotePointing(noteA, noteB, angleTolerance) || isNotePointing(noteB, noteA, angleTolerance)
   );
}

export function isNotePointingRaw(
   note: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction'> & {
      angleOffset?: number;
   },
   target: Pick<wrapper.IWrapColorNote, 'posX' | 'posY'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   const [pX, pY] = [note.posX, note.posY];
   const [qX, qY] = [target.posX, target.posY];
   const pA = resolveNoteAngle(note.direction);
   const pqA = (Math.atan2(qY - pY, qX - pX) * 180) / Math.PI + 90;
   return lowestDifferenceMod(pA, pqA, 360) <= angleTolerance;
}

export function isNoteSwingableRaw(
   noteA: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   noteB: Pick<wrapper.IWrapColorNote, 'posX' | 'posY' | 'direction' | 'customData'> & {
      angleOffset?: number;
   },
   angleTolerance: number,
): boolean {
   return (
      isNotePointingRaw(noteA, noteB, angleTolerance) ||
      isNotePointingRaw(noteB, noteA, angleTolerance)
   );
}

// straight from source because idk
// what the hell they did there to be different from standard implementation
export function getArcPath(arc: wrapper.IWrapArc): BezierPath {
   const controlPointDistancePerSqrtNotesDistance = 3.5;
   const midAnchorOffset = 3.5;
   const midControlPointZModifier = 0.15;
   const midControlPointYModifier = 0.25;
   const midControlPointXModifier = 0.25;
   const noteSize = 0.5;

   const bezierPath = new BezierPath();
   const size = 0.45 * noteSize * 0.5;
   const zTime =
      arc.customData[PrecalculateKey.TAIL_SECOND_TIME] -
      arc.customData[PrecalculateKey.SECOND_TIME];
   const f = degToRad(arc.customData[PrecalculateKey.ANGLE]);
   const f2 = degToRad(arc.customData[PrecalculateKey.TAIL_ANGLE]);
   const headDirection: Vector2 = [Math.sin(f), 0 - Math.cos(f)];
   const tailDirection: Vector2 = [Math.sin(f2), 0 - Math.cos(f2)];
   let initialAnchor: Vector2 = vectorMul(headDirection, size);
   let endAnchor: Vector2 = vectorMul(vectorMul(tailDirection, size), -1);
   if (!arc.customData[PrecalculateKey.HEAD_NOTES].length) {
      initialAnchor = vectorMul(initialAnchor, 0.1);
   }
   if (!arc.customData[PrecalculateKey.TAIL_NOTES].length) {
      endAnchor = vectorMul(endAnchor, 0.1);
   }

   const initialPoint: Vector3 = [
      arc.customData[PrecalculateKey.POSITION][0] + initialAnchor[0],
      arc.customData[PrecalculateKey.POSITION][1] + initialAnchor[1],
      size,
   ];
   const endPoint: Vector3 = [
      arc.customData[PrecalculateKey.TAIL_POSITION][0] + endAnchor[0],
      arc.customData[PrecalculateKey.TAIL_POSITION][1] + endAnchor[1],
      zTime + size,
   ];

   let midPoint: Vector3 = vectorMul(vectorAdd(initialPoint, endPoint), 0.5);
   let rads = 0;
   let allowMidAnchor =
      nearEqual(
         lowestDifferenceMod(
            arc.customData[PrecalculateKey.ANGLE],
            arc.customData[PrecalculateKey.TAIL_ANGLE],
            180,
         ),
         0,
      ) &&
      arc.customData[PrecalculateKey.POSITION][0] ===
         arc.customData[PrecalculateKey.TAIL_POSITION][0];
   if (allowMidAnchor) {
      if (arc.midAnchor == SliderMidAnchorMode.CLOCKWISE) {
         rads = -Math.PI / 2;
      } else if (arc.midAnchor == SliderMidAnchorMode.COUNTER_CLOCKWISE) {
         rads = Math.PI / 2;
      } else {
         allowMidAnchor = false;
      }
   }
   const midAnchor: Vector3 = [...vectorRotate(headDirection, rads), 0];
   midPoint = vectorAdd(midPoint, vectorMul(midAnchor, midAnchorOffset));

   const anchorList = [];
   anchorList.push(initialPoint);
   if (allowMidAnchor) {
      anchorList.push(midPoint);
   }
   anchorList.push(endPoint);
   bezierPath.updateByAnchorPoints(anchorList);

   const initialDirection: Vector3 = vectorMul(
      cutDirectionToControlPointPosition(arc.direction, arc.customData[PrecalculateKey.ANGLE]),
      controlPointDistancePerSqrtNotesDistance * arc.lengthMultiplier,
   );
   const endDirection: Vector3 = vectorMul(
      vectorMul(
         cutDirectionToControlPointPosition(
            arc.tailDirection,
            arc.customData[PrecalculateKey.TAIL_ANGLE],
         ),
         controlPointDistancePerSqrtNotesDistance * arc.tailLengthMultiplier,
      ),
      -1,
   );
   let initialVector: Vector3 = vectorAdd(initialPoint, initialDirection);
   let endVector: Vector3 = vectorAdd(endPoint, endDirection);
   if (allowMidAnchor) {
      const midPoint1: Vector3 = vectorSub(initialVector, midPoint);
      const midPoint2: Vector3 = vectorSub(endVector, midPoint);
      const zOffset = (Math.abs(midPoint1[2]) + Math.abs(midPoint2[2])) * midControlPointZModifier;
      const yOffset = (Math.abs(midPoint1[1]) + Math.abs(midPoint2[1])) * midControlPointYModifier;
      const xOffset = (Math.abs(midPoint1[0]) + Math.abs(midPoint2[0])) * midControlPointXModifier;
      let yStart = yOffset;
      let yEnd = 0 - yOffset;
      if (initialVector[1] < endVector[1]) {
         yStart = 0 - yStart;
         yEnd = 0 - yEnd;
      }
      if (nearEqual(initialVector[1], endVector[1])) {
         yStart = 0;
         yEnd = 0;
      }
      let xStart = xOffset;
      let xEnd = 0 - xOffset;
      if (initialVector[0] < endVector[0]) {
         xStart = 0 - xStart;
         xEnd = 0 - xEnd;
      }
      if (nearEqual(initialVector[0], endVector[0])) {
         xStart = 0;
         xEnd = 0;
      }
      const midVector1: Vector3 = vectorAdd(midPoint, [xStart, yStart, 0 - zOffset]);
      const midVector2: Vector3 = vectorAdd(midPoint, [xEnd, yEnd, zOffset]);

      bezierPath.updateControlPoints([initialVector, midVector1, midVector2, endVector]);
      bezierPath.setAnchorNormalAngle(2, 0);
   } else {
      bezierPath.updateControlPoints([initialVector, endVector]);
   }
   bezierPath.setAnchorNormalAngle(0, 0);
   bezierPath.setAnchorNormalAngle(1, 0);

   return bezierPath;
}

export function cutDirectionToControlPointPosition(cutDirection: number, angle: number): Vector3 {
   if (cutDirection === NoteDirection.ANY) {
      return [0, 0, 0];
   }
   return [Math.sin(degToRad(angle)), 0 - Math.cos(degToRad(angle)), -0.00001];
}

export function isLightEvent(type: number, environment: EnvironmentName): boolean {
   const e = BasicTrackDefinitions[environment]?.[type];
   return e ? e.type === EventKind.Light : true;
}
