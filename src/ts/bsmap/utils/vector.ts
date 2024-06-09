import type { EasingFunction } from '../types/easings.ts';
import type {
   Vector2,
   Vector2Object,
   Vector3,
   Vector3Object,
   Vector4,
   Vector4Object,
} from '../types/vector.ts';
import { lerp } from './math.ts';

type VectorObject = Partial<Vector2Object> | Partial<Vector3Object> | Partial<Vector4Object>;

export function isVector2(obj: unknown): obj is Vector2 {
   return Array.isArray(obj) && obj.length === 2 && obj.every((n) => typeof n === 'number');
}

export function isVector3(obj: unknown): obj is Vector3 {
   return Array.isArray(obj) && obj.length === 3 && obj.every((n) => typeof n === 'number');
}

export function isVector4(obj: unknown): obj is Vector4 {
   return Array.isArray(obj) && obj.length === 4 && obj.every((n) => typeof n === 'number');
}

export function vectorAdd<T extends Vector2 | Vector3 | Vector4 | number[] | undefined>(
   vec: T,
   value?: number | number[],
): T;
export function vectorAdd(vec?: Vector2, value?: VectorObject): Vector2;
export function vectorAdd(vec?: Vector3, value?: VectorObject): Vector3;
export function vectorAdd(vec?: Vector4, value?: VectorObject): Vector4;
export function vectorAdd<T extends Vector2 | Vector3 | Vector4 | number[]>(
   vec?: T,
   value?: number | T | VectorObject,
): T | undefined {
   if (!vec) return vec;
   if (typeof value === 'number') return vec.map((v) => v + value) as T;
   vec = [...vec];
   if (value) {
      if (Array.isArray(value)) {
         for (let i = 0; i < vec.length; i++) {
            if (typeof value[i] === 'number') {
               vec[i] += value[i];
            }
         }
      } else {
         switch (vec.length) {
            case 4:
               vec[3] = vec[3] + ((value as Vector4Object).w ?? 0);
            /* falls through */
            case 3:
               vec[2] = vec[2] + ((value as Vector3Object).z ?? 0);
            /* falls through */
            case 2:
               vec[1] = vec[1] + (value.y ?? 0);
               vec[0] = vec[0] + (value.x ?? 0);
         }
      }
   }
   return vec;
}

export function vectorSub<T extends Vector2 | Vector3 | Vector4 | number[] | undefined>(
   vec: T,
   value?: number | number[],
): T;
export function vectorSub(vec?: Vector2, value?: VectorObject): Vector2;
export function vectorSub(vec?: Vector3, value?: VectorObject): Vector3;
export function vectorSub(vec?: Vector4, value?: VectorObject): Vector4;
export function vectorSub<T extends Vector2 | Vector3 | Vector4 | number[]>(
   vec?: T,
   value?: number | T | VectorObject,
): T | undefined {
   if (!vec) return vec;
   if (typeof value === 'number') return vec.map((v) => v - value) as T;
   vec = [...vec];
   if (value) {
      if (Array.isArray(value)) {
         for (let i = 0; i < vec.length; i++) {
            if (typeof value[i] === 'number') {
               vec[i] -= value[i];
            }
         }
      } else {
         switch (vec.length) {
            case 4:
               vec[3] = vec[3] - ((value as Vector4Object).w ?? 0);
            /* falls through */
            case 3:
               vec[2] = vec[2] - ((value as Vector3Object).z ?? 0);
            /* falls through */
            case 2:
               vec[1] = vec[1] - (value.y ?? 0);
               vec[0] = vec[0] - (value.x ?? 0);
         }
      }
   }
   return vec;
}

export function vectorMul<T extends Vector2 | Vector3 | Vector4 | number[] | undefined>(
   vec: T,
   value?: number | number[],
): T;
export function vectorMul(vec?: Vector2, value?: VectorObject): Vector2;
export function vectorMul(vec?: Vector3, value?: VectorObject): Vector3;
export function vectorMul(vec?: Vector4, value?: VectorObject): Vector4;
export function vectorMul<T extends Vector2 | Vector3 | Vector4 | number[]>(
   vec?: T,
   value?: number | T | VectorObject,
): T | undefined {
   if (!vec) return vec;
   if (typeof value === 'number') return vec.map((v) => v * value) as T;
   vec = [...vec];
   if (value) {
      if (Array.isArray(value)) {
         for (let i = 0; i < vec.length; i++) {
            if (typeof value[i] === 'number') {
               vec[i] *= value[i];
            }
         }
      } else {
         switch (vec.length) {
            case 4:
               vec[3] = vec[3] * ((value as Vector4Object).w ?? 1);
            /* falls through */
            case 3:
               vec[2] = vec[2] * ((value as Vector3Object).z ?? 1);
            /* falls through */
            case 2:
               vec[1] = vec[1] * (value.y ?? 1);
               vec[0] = vec[0] * (value.x ?? 1);
         }
      }
   }
   return vec;
}

export function vectorDiv<T extends Vector2 | Vector3 | Vector4 | number[] | undefined>(
   vec: T,
   value?: number | number[],
): T;
export function vectorDiv(vec?: Vector2, value?: VectorObject): Vector2;
export function vectorDiv(vec?: Vector3, value?: VectorObject): Vector3;
export function vectorDiv(vec?: Vector4, value?: VectorObject): Vector4;
export function vectorDiv<T extends Vector2 | Vector3 | Vector4 | number[]>(
   vec?: T,
   value?: number | T | VectorObject,
): T | undefined {
   if (!vec) return vec;
   if (typeof value === 'number') return vec.map((v) => v / value) as T;
   vec = [...vec];
   if (value) {
      if (Array.isArray(value)) {
         for (let i = 0; i < vec.length; i++) {
            if (typeof value[i] === 'number') {
               vec[i] /= value[i];
            }
         }
      } else {
         switch (vec.length) {
            case 4:
               vec[3] = vec[3] / ((value as Vector4Object).w ?? 1);
            /* falls through */
            case 3:
               vec[2] = vec[2] / ((value as Vector3Object).z ?? 1);
            /* falls through */
            case 2:
               vec[1] = vec[1] / (value.y ?? 1);
               vec[0] = vec[0] / (value.x ?? 1);
         }
      }
   }
   return vec;
}

export function lerpVector<T extends Vector2 | Vector3 | Vector4 | number[] | undefined>(
   alpha: number,
   vec: T,
   value?: number[],
   easing?: EasingFunction,
): T;
export function lerpVector(
   valpha: number,
   ec?: Vector2,
   value?: VectorObject,
   easing?: EasingFunction,
): Vector2;
export function lerpVector(
   alpha: number,
   vec?: Vector3,
   value?: VectorObject,
   easing?: EasingFunction,
): Vector3;
export function lerpVector(
   alpha: number,
   vec?: Vector4,
   value?: VectorObject,
   easing?: EasingFunction,
): Vector4;
export function lerpVector<T extends Vector2 | Vector3 | Vector4 | number[]>(
   alpha: number,
   vec?: T,
   value?: T | VectorObject,
   easing?: EasingFunction,
): T | undefined {
   if (!vec) return vec;
   if (!easing) easing = (x: number) => x;
   vec = [...vec];
   if (value) {
      if (Array.isArray(value)) {
         for (let i = 0; i < vec.length; i++) {
            if (typeof value[i] === 'number') {
               vec[i] = lerp(alpha, vec[i], value[i], easing);
            }
         }
      } else {
         switch (vec.length) {
            case 4:
               vec[3] = lerp(alpha, vec[3], (value as Vector4Object).w ?? vec[3], easing);
            /* falls through */
            case 3:
               vec[2] = lerp(alpha, vec[2], (value as Vector3Object).z ?? vec[2], easing);
            /* falls through */
            case 2:
               vec[1] = lerp(alpha, vec[1], value.y ?? vec[1], easing);
               vec[0] = lerp(alpha, vec[0], value.x ?? vec[0], easing);
         }
      }
   }
   return vec;
}
