import { ColorArray } from '../../../colors';
import { Vector2, Vector3 } from '../../../vector';
import { ColorPointDefinition } from '../../shared/custom/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../../shared/custom/heck';

/** Point Definition interface. */
export interface IPointDefinition {
    _name: string;
    _points:
        | number
        | Vector2
        | Vector3
        | ColorArray
        | PercentPointDefinition[]
        | Vector2PointDefinition[]
        | Vector3PointDefinition[]
        | ColorPointDefinition[];
}
