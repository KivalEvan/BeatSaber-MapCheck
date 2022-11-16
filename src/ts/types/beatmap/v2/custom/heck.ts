import { Easings } from '../../../easings';
import { Vector3PointDefinition } from '../../shared/custom/heck';

/** Heck Base Custom Event interface. */
export interface IHeckCustomEventDataBase {
    _track: string | string[];
}

/** AnimateTrack interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    _duration?: number;
    _easing?: Easings;
    _position?: string | Vector3PointDefinition[];
    _rotation?: string | Vector3PointDefinition[];
    _localRotation?: string | Vector3PointDefinition[];
    _scale?: string | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAssignPathAnimation extends IHeckCustomEventDataBase {
    _easing?: Easings;
    _position?: string | Vector3PointDefinition[];
    _rotation?: string | Vector3PointDefinition[];
    _localRotation?: string | Vector3PointDefinition[];
    _scale?: string | Vector3PointDefinition[];
}
