import * as types from 'bsmap/types';
import { vectorAdd, vectorMul, vectorSub } from 'bsmap/utils';
import { vectorLerp } from './vector';

export function cubicBezierSplitCurve(
   p0: types.Vector3,
   p1: types.Vector3,
   p2: types.Vector3,
   p3: types.Vector3,
   t: number,
): [
   a0: types.Vector3,
   c0: types.Vector3,
   c1: types.Vector3,
   a1: types.Vector3,
   c2: types.Vector3,
   c3: types.Vector3,
   a2: types.Vector3,
] {
   const q0 = vectorLerp(p0, p1, t);
   const q1 = vectorLerp(p1, p2, t);
   const q2 = vectorLerp(p2, p3, t);

   const r0 = vectorLerp(q0, q1, t);
   const r1 = vectorLerp(q1, q2, t);

   const s = vectorLerp(r0, r1, t);

   return [p0, q0, r0, s, r1, q2, p3];
}

export function cubicBezier(
   p0: types.Vector3,
   p1: types.Vector3,
   p2: types.Vector3,
   p3: types.Vector3,
   t: number,
): types.Vector3 {
   const q0 = vectorLerp(p0, p1, t);
   const q1 = vectorLerp(p1, p2, t);
   const q2 = vectorLerp(p2, p3, t);

   const r0 = vectorLerp(q0, q1, t);
   const r1 = vectorLerp(q1, q2, t);

   return vectorLerp(r0, r1, t);
}

export function bezierCurve(
   p0: types.Vector2,
   p1: types.Vector2,
   p2: types.Vector2,
   t: number,
): [types.Vector2, types.Vector2] {
   const n = 1 - t;
   const pos = vectorAdd(
      vectorMul(p0, n * n),
      vectorAdd(vectorMul(p1, 2 * n * t), vectorMul(p2, t * t)),
   );
   const tangent = vectorAdd(
      vectorMul(vectorSub(p1, p0), 2 * n),
      vectorMul(vectorSub(p2, p1), 2 * t),
   );
   return [pos, tangent];
}
