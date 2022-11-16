import { ColorPointDefinition } from '../../shared/custom/chroma';
import { PercentPointDefinition, Vector2PointDefinition, Vector3PointDefinition } from '../../shared/custom/heck';

/** Point Definition interface. */
export interface IPointDefinition {
    _name: string;
    _points: PercentPointDefinition[] | Vector2PointDefinition[] | Vector3PointDefinition[] | ColorPointDefinition[];
}
