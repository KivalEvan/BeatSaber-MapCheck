import { ColorArray } from '../../../colors';
import { Vector2, Vector3 } from '../../../vector';
import { ColorPointDefinition } from '../../shared/custom/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../../shared/custom/heck';

/** Point Definition interface. */
export type IPointDefinition = {
    [key: string]:
        | number
        | Vector2
        | Vector3
        | ColorArray
        | PercentPointDefinition[]
        | Vector2PointDefinition[]
        | Vector3PointDefinition[]
        | ColorPointDefinition[];
};
