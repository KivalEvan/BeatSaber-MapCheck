import { ColorPointDefinition } from '../shared/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../shared/heck';

/** Point Definition interface. */
export type IPointDefinition = {
    [key: string]:
        | PercentPointDefinition[]
        | Vector2PointDefinition[]
        | Vector3PointDefinition[]
        | ColorPointDefinition[];
};