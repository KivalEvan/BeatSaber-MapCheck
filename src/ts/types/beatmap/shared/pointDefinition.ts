import { ColorPointDefinition } from './chroma';
import { Vector2PointDefinition, Vector3PointDefinition } from './heck';

export type PointDefinition = Vector2PointDefinition[] | Vector3PointDefinition[] | ColorPointDefinition[];
