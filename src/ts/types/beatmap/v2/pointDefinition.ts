import { ColorPointDefinition } from '../shared/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../shared/heck';

/** Point Definition interface. */
export interface IPointDefinition {
    _name: string;
    _points: PercentPointDefinition[] | Vector2PointDefinition[] | Vector3PointDefinition[] | ColorPointDefinition[];
}
