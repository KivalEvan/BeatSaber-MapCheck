import type { Easings } from '../../../easings.ts';
import type { Vector3, Vector4 } from '../../../vector.ts';
import type { BaseModifierChroma } from './chroma.ts';
import type { BaseModifierNE } from './noodleExtensions.ts';

export type FloatPointDefinition = [
   percent: number,
   time: number,
   ...options: (Easings | PointFlag | PointModifier)[],
];
export type Vector3PointDefinition =
   | [...vector3: Vector3, time: number, ...options: (Easings | PointFlag | PointModifier)[]]
   | BaseModifierNE;
export type Vector4PointDefinition =
   | [
        ...vector4: Vector4,
        time: number,
        ...options: ('lerpHSV' | Easings | PointFlag | PointModifier)[],
     ]
   | BaseModifierChroma;

export type PointModifier = `op${'None' | 'Add' | 'Sub' | 'Mul' | 'Div'}`;
export type PointFlag = 'splineCatmullRom';
