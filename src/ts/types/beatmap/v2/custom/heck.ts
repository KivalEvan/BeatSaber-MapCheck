import { Easings } from '../../../easings';
import { Vector3 } from '../../../vector';
import { Vector3PointDefinition } from '../../shared/custom/heck';

/** Heck Base Custom Event interface. */
export interface IHeckBase {
    _track?: string | string[];
}

/** AnimateTrack interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAnimateTrack extends Required<IHeckBase> {
    _duration?: number;
    _easing?: Easings;
    _position?: string | Vector3 | Vector3PointDefinition[];
    _rotation?: string | Vector3 | Vector3PointDefinition[];
    _localRotation?: string | Vector3 | Vector3PointDefinition[];
    _scale?: string | Vector3 | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAssignPathAnimation extends Required<IHeckBase> {
    _easing?: Easings;
    _position?: string | Vector3 | Vector3PointDefinition[];
    _rotation?: string | Vector3 | Vector3PointDefinition[];
    _localRotation?: string | Vector3 | Vector3PointDefinition[];
    _scale?: string | Vector3 | Vector3PointDefinition[];
}
