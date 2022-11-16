import { ColorPointDefinition } from '../../shared/custom/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../../shared/custom/heck';

/** Point Definition interface. */
export type IPointDefinition = {
    [key: string]:
        | PercentPointDefinition[]
        | Vector2PointDefinition[]
        | Vector3PointDefinition[]
        | ColorPointDefinition[];
};
