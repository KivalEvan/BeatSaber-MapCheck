import { Easings } from '../../easings';
import { Vector3PointDefinition } from '../shared/heck';

/** Heck Base Custom Event interface. */
export interface IHeckCustomEventDataBase {
    track: string | string[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    duration?: number;
    repeat?: number;
    easing?: Easings;
    position?: string | Vector3PointDefinition[];
    rotation?: string | Vector3PointDefinition[];
    localRotation?: string | Vector3PointDefinition[];
    scale?: string | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAssignPathAnimation extends IHeckCustomEventDataBase {
    easing?: Easings;
    position?: string | Vector3PointDefinition[];
    rotation?: string | Vector3PointDefinition[];
    localRotation?: string | Vector3PointDefinition[];
    scale?: string | Vector3PointDefinition[];
}

/** Heck Custom Data interface for difficulty custom data. */
export interface IHeckCustomData {
    eventDefinitions?: unknown[];
}
