import { ColorArray } from '../../../colors';
import { Vector2, Vector3 } from '../../../vector';
import {
    FloatPointDefinition,
    Vector3PointDefinition,
    Vector4PointDefinition,
} from '../../shared/custom/heck';

/** Point Definition interface. */
export type IPointDefinition = {
    [key: string]:
        | number
        | Vector2
        | Vector3
        | ColorArray
        | FloatPointDefinition[]
        | Vector3PointDefinition[]
        | Vector4PointDefinition[];
};
