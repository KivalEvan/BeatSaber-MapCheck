import { Easings } from '../shared/easings';
import { ColorPointDefinition, PercentPointDefinition, PointDefinition, Vector3PointDefinition } from '../shared/heck';

/** Heck Base Custom Event interface. */
export interface IHeckCustomEventDataBase {
    track: string | string[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    duration: number;
    easing?: Easings;
    position?: string | Vector3PointDefinition[];
    rotation?: string | Vector3PointDefinition[];
    localRotation?: string | Vector3PointDefinition[];
    scale?: string | Vector3PointDefinition[];
    dissolve?: string | PercentPointDefinition[];
    dissolveArrow?: string | PercentPointDefinition[];
    color?: string | ColorPointDefinition[];
    interactable?: string | PercentPointDefinition[];
    time?: string | PercentPointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAssignPathAnimation extends IHeckCustomEventDataBase {
    duration: number;
    easing?: Easings;
    position?: string | Vector3PointDefinition[];
    rotation?: string | Vector3PointDefinition[];
    localRotation?: string | Vector3PointDefinition[];
    scale?: string | Vector3PointDefinition[];
    dissolve?: string | PercentPointDefinition[];
    dissolveArrow?: string | PercentPointDefinition[];
    color?: string | ColorPointDefinition[];
    interactable?: string | PercentPointDefinition[];
    definitePosition?: string | Vector3PointDefinition[];
}

/** Heck Custom Event interface for AnimateTrack. */
export interface IHeckCustomEventAnimateTrack {
    b: number;
    t: 'AnimateTrack';
    d: IHeckCustomEventDataAnimateTrack;
}

/** Heck Custom Event interface for AssignPathAnimation. */
export interface IHeckCustomEventAssignPathAnimation {
    b: number;
    t: 'AssignPathAnimation';
    d: IHeckCustomEventDataAssignPathAnimation;
}

/** Heck Custom Event interface for InvokeEvent. */
// export interface IHeckCustomEventInvokeEvent {
//     b: number;
//     t: 'InvokeEvent';
//     d: IHeckCustomEventDataInvokeEvent;
// }

export type IHeckCustomEvent = IHeckCustomEventAnimateTrack | IHeckCustomEventAssignPathAnimation;
// | IHeckCustomEventInvokeEvent;

/** Heck Point Definition interface. */
export interface IHeckPointDefinition {
    name: string;
    points: PointDefinition[];
}

/** Heck Custom Data interface for difficulty custom data. */
export interface IHeckCustomData {
    eventDefinitions?: unknown[];
    pointDefinitions?: IHeckPointDefinition[];
}
