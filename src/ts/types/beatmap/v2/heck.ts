import { Easings } from '../../easings';
import { ColorPointDefinition } from '../shared/chroma';
import { PercentPointDefinition, Vector3PointDefinition } from '../shared/heck';
import { PointDefinition } from '../shared/pointDefinition';

/** Heck Base Custom Event interface. */
export interface IHeckCustomEventDataBase {
    _track: string | string[];
}

/** AnimateTrack interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Vector3PointDefinition[];
    _rotation?: string | Vector3PointDefinition[];
    _localRotation?: string | Vector3PointDefinition[];
    _scale?: string | Vector3PointDefinition[];
    _dissolve?: string | PercentPointDefinition[];
    _dissolveArrow?: string | PercentPointDefinition[];
    _color?: string | ColorPointDefinition[];
    _interactable?: string | PercentPointDefinition[];
    _time?: string | PercentPointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAssignPathAnimation extends IHeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Vector3PointDefinition[];
    _rotation?: string | Vector3PointDefinition[];
    _localRotation?: string | Vector3PointDefinition[];
    _scale?: string | Vector3PointDefinition[];
    _dissolve?: string | PercentPointDefinition[];
    _dissolveArrow?: string | PercentPointDefinition[];
    _color?: string | ColorPointDefinition[];
    _interactable?: string | PercentPointDefinition[];
    _definitePosition?: string | Vector3PointDefinition[];
}

/** Heck Custom Event interface for AnimateTrack. */
export interface IHeckCustomEventAnimateTrack {
    _time: number;
    _type: 'AnimateTrack';
    _data: IHeckCustomEventDataAnimateTrack;
}

/** Heck Custom Event interface for AssignPathAnimation. */
export interface IHeckCustomEventAssignPathAnimation {
    _time: number;
    _type: 'AssignPathAnimation';
    _data: IHeckCustomEventDataAssignPathAnimation;
}

export type IHeckCustomEvent = IHeckCustomEventAnimateTrack | IHeckCustomEventAssignPathAnimation;

/** Heck Point Definition interface. */
export interface IHeckPointDefinition {
    _name: string;
    _points: PointDefinition;
}

/** Heck Custom Data interface for difficulty custom data. */
export interface IHeckCustomData {
    _customEvents?: IHeckCustomEvent[];
    _pointDefinitions?: IHeckPointDefinition[];
}
