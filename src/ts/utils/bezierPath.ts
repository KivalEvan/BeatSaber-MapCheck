import * as types from 'bsmap/types';
import {
   clamp,
   mod,
   nearEqual,
   vectorAdd,
   vectorMagnitude,
   vectorMul,
   vectorNormalize,
   vectorSub,
} from 'bsmap/utils';

const enum ControlMode {
   Aligned,
   Mirrored,
   Free,
   Automatic,
}

export class BezierPath {
   #points: types.Vector3[] = [];
   #controlMode: ControlMode = ControlMode.Automatic;
   #perAnchorNormalsAngle: number[] = [];
   #neighbourDistances: number[] = [];

   get controlPointMode(): ControlMode {
      return this.#controlMode;
   }
   set controlPointMode(value: ControlMode) {
      if (this.#controlMode != value) {
         this.#controlMode = value;
         if (this.#controlMode === ControlMode.Automatic) {
            this.#autoSetAllControlPoints();
         }
      }
   }

   get pointsCount(): number {
      return this.#points.length;
   }

   get anchorPointsCount(): number {
      return Math.floor((this.#points.length + 2) / 3);
   }

   get segmentsCount(): number {
      return Math.floor(this.#points.length / 3);
   }

   constructor(centre: types.Vector3 = [0, 0, 0]) {
      const up: types.Vector3 = [0, 1, 0];
      this.#points = [
         vectorAdd(centre, vectorMul([-1, 0, 0], 2)),
         vectorAdd(vectorAdd(centre, vectorMul([-1, 0, 0], 1)), vectorMul(up, 0.5)),
         vectorSub(vectorAdd(centre, vectorMul([1, 0, 0], 1)), -vectorMul(up, 0.5)),
         vectorAdd(centre, vectorMul([1, 0, 0], 2)),
      ];
      this.#perAnchorNormalsAngle = [0, 0];
      this.#neighbourDistances = [0, 0];
   }

   updateByAnchorPoints(anchors: readonly types.Vector3[]): void {
      this.#points = [anchors[0], [0, 0, 0], [0, 0, 0], anchors[1]];
      this.#perAnchorNormalsAngle = [0, 0];
      for (let i = 2; i < anchors.length; i++) {
         this.addSegmentToEnd(anchors[i]);
         this.#perAnchorNormalsAngle.push(0);
      }
   }

   updateControlPoints(points: readonly types.Vector3[]): void {
      for (let i = 0; i < points.length / 2; i++) {
         this.setPoint(1 + i * 3, points[i * 2]);
         this.setPoint(2 + i * 3, points[i * 2 + 1]);
      }
   }

   getPoint(i: number): types.Vector3 {
      return this.#points[i];
   }

   setPoint(i: number, localPosition: types.Vector3): void {
      this.#points[i] = localPosition;
   }

   addSegmentToEnd(anchorPos: types.Vector3): void {
      let len = this.#points.length - 1;
      let vector: types.Vector3 = vectorSub(this.#points[len], this.#points[len - 1]);
      if (this.#controlMode != ControlMode.Mirrored && this.#controlMode != ControlMode.Automatic) {
         const magnitude = vectorMagnitude(vectorSub(this.#points[len], anchorPos));
         vector = vectorMul(
            vectorNormalize(vectorSub(this.#points[len], this.#points[len - 1])),
            magnitude * 0.5,
         );
      }
      const control1: types.Vector3 = vectorAdd(this.#points[len], vector);
      const control2: types.Vector3 = vectorMul(vectorAdd(anchorPos, control1), 0.5);
      this.#points.push(control1, control2, anchorPos);
      this.#perAnchorNormalsAngle.push(
         this.#perAnchorNormalsAngle[this.#perAnchorNormalsAngle.length - 1],
      );
      if (this.#controlMode === ControlMode.Automatic) {
         this.#autoSetAllAffectedControlPoints(this.#points.length - 1);
      }
   }

   getPointsInSegment(
      segmentIndex: number,
   ): [types.Vector3, types.Vector3, types.Vector3, types.Vector3] {
      const num = 3 * clamp(segmentIndex, 0, this.segmentsCount - 1);
      return [
         this.#points[num],
         this.#points[num + 1],
         this.#points[num + 2],
         this.#points[num + 3],
      ];
   }

   getAnchorNormalAngle(anchorIndex: number): number {
      return mod(this.#perAnchorNormalsAngle[anchorIndex], 360);
   }

   setAnchorNormalAngle(anchorIndex: number, angle: number): void {
      angle = mod(angle, 360);
      if (!nearEqual(this.#perAnchorNormalsAngle[anchorIndex], angle)) {
         this.#perAnchorNormalsAngle[anchorIndex] = angle;
      }
   }

   #autoSetAllAffectedControlPoints(updatedAnchorIndex: number): void {
      for (let i = updatedAnchorIndex - 3; i <= updatedAnchorIndex + 3; i += 3) {
         if (i >= 0 && i < this.#points.length) {
            this.#autoSetAnchorControlPoints(this.#loopIndex(i));
         }
      }
      this.#autoSetStartAndEndControls();
   }

   #autoSetAllControlPoints(): void {
      if (this.anchorPointsCount > 2) {
         for (let i = 0; i < this.#points.length; i += 3) {
            this.#autoSetAnchorControlPoints(i);
         }
      }
      this.#autoSetStartAndEndControls();
   }

   #autoSetAnchorControlPoints(anchorIndex: number): void {
      const vector: types.Vector3 = this.#points[anchorIndex];
      let zero: types.Vector3 = [0, 0, 0];
      for (let i = 0; i < 2; i++) {
         this.#neighbourDistances[i] = 0;
      }
      if (anchorIndex - 3 >= 0) {
         const vector2: types.Vector3 = vectorSub(
            this.#points[this.#loopIndex(anchorIndex - 3)],
            vector,
         );
         zero = vectorAdd(zero, vectorNormalize(vector2));
         this.#neighbourDistances[0] = vectorMagnitude(vector2);
      }
      if (anchorIndex + 3 >= 0) {
         const vector3: types.Vector3 = vectorSub(
            this.#points[this.#loopIndex(anchorIndex + 3)],
            vector,
         );
         zero = vectorSub(zero, vectorNormalize(vector3));
         this.#neighbourDistances[1] = 0 - vectorMagnitude(vector3);
      }
      zero = vectorNormalize(zero);
      for (let j = 0; j < 2; j++) {
         let num = anchorIndex + j * 2 - 1;
         if (num >= 0 && num < this.#points.length) {
            this.#points[this.#loopIndex(num)] = vectorAdd(
               vector,
               vectorMul(zero, this.#neighbourDistances[j] * 0.3),
            );
         }
      }
   }

   #autoSetStartAndEndControls(): void {
      if (this.anchorPointsCount === 2) {
         this.#points[1] = vectorAdd(
            this.#points[0],
            vectorMul(vectorSub(this.#points[3], this.#points[0]), 0.25),
         );
         this.#points[2] = vectorAdd(
            this.#points[3],
            vectorMul(vectorSub(this.#points[0], this.#points[3]), 0.25),
         );
      } else {
         this.#points[1] = vectorMul(vectorAdd(this.#points[0], this.#points[2]), 0.5);
         this.#points[this.#points.length - 2] = vectorMul(
            vectorAdd(this.#points[this.#points.length - 1], this.#points[this.#points.length - 3]),
            0.5,
         );
      }
   }

   #loopIndex(i: number): number {
      return (i + this.#points.length) % this.#points.length;
   }
}
