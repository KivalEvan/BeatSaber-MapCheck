import type { ColorArray } from '../../../colors.ts';
import type { Vector2, Vector3 } from '../../../vector.ts';
import type {
   FloatPointDefinition,
   Vector3PointDefinition,
   Vector4PointDefinition,
} from '../../shared/custom/heck.ts';

/** Point Definition interface. */
export type IPointDefinition = {
   [key: string]:
      | [number]
      | Vector2
      | Vector3
      | ColorArray
      | FloatPointDefinition[]
      | Vector3PointDefinition[]
      | Vector4PointDefinition[];
};
