import { Easings } from '../shared/easings';
export type Array2DPoint = [number, number];
export type Array3DPoint = [number, number, number];
export type ArrayColorPointDefinition = [
    number,
    number,
    number,
    number,
    number,
    Easings?
];
export type ArrayPercentPointDefinition = [number, number, Easings?];
export type Array2DPointDefinition =
    | [number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, 'splineCatmullRom'?];
export type Array3DPointDefinition =
    | [number, number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, number, 'splineCatmullRom'?];
export type ArrayPointDefinition =
    | Array2DPointDefinition[]
    | Array3DPointDefinition[]
    | ArrayColorPointDefinition[];

export const heckName = 'Heck';

/** Heck Base Custom Event interface.
 * ```ts
 * _track: string | string[]
 * ```
 */
export interface IHeckCustomEventDataBase {
    _track: string | string[];
}

/** AnimateTrack interface for Heck Custom Event.
 * ```ts
 * _duration: float,
 * _easing?: Easings,
 * _position?: string | Array3DPointDefinition[],
 * _rotation?: string | Array3DPointDefinition[],
 * _localRotation?: string | Array3DPointDefinition[],
 * _scale?: string | Array3DPointDefinition[],
 * _dissolve?: string | ArrayPercentPointDefinition[],
 * _dissolveArrow?: string | ArrayPercentPointDefinition[],
 * _color?: string | ArrayColorPointDefinition[],
 * _interactable?: string | ArrayPercentPointDefinition[],
 * _time?: string | ArrayPercentPointDefinition[]
 * ```
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _time?: string | ArrayPercentPointDefinition[];
}

/** AssignPathAnimation interface for Heck Custom Event.
 * ```ts
 * _duration: float,
 * _easing?: Easings,
 * _position?: string | Array3DPointDefinition[],
 * _rotation?: string | Array3DPointDefinition[],
 * _localRotation?: string | Array3DPointDefinition[],
 * _scale?: string | Array3DPointDefinition[],
 * _dissolve?: string | ArrayPercentPointDefinition[],
 * _dissolveArrow?: string | ArrayPercentPointDefinition[],
 * _color?: string | ArrayColorPointDefinition[],
 * _interactable?: string | ArrayPercentPointDefinition[],
 * _definitePosition?: string | Array3DPointDefinition[]
 * ```
 * @extends IHeckCustomEventDataBase
 */
export interface IHeckCustomEventDataAssignPathAnimation
    extends IHeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _definitePosition?: string | Array3DPointDefinition[];
}

/** Heck Custom Event interface for AnimateTrack.
 * ```ts
 * _time: float,
 * _type: 'AnimateTrack',
 * _data: NECustomEventDataAnimateTrack
 * ```
 */
export interface IHeckCustomEventAnimateTrack {
    _time: number;
    _type: 'AnimateTrack';
    _data: IHeckCustomEventDataAnimateTrack;
}

/** Heck Custom Event interface for AssignPathAnimation.
 * ```ts
 * _time: float,
 * _type: 'AssignPathAnimation',
 * _data: NECustomEventDataAssignPathAnimation
 * ```
 */
export interface IHeckCustomEventAssignPathAnimation {
    _time: number;
    _type: 'AssignPathAnimation';
    _data: IHeckCustomEventDataAssignPathAnimation;
}

export type IHeckCustomEvent =
    | IHeckCustomEventAnimateTrack
    | IHeckCustomEventAssignPathAnimation;

/** Heck Point Definition interface.
 * ```ts
 * _name: string,
 * _points: ArrayPointDefinition[];
 * ```
 */
export interface IHeckPointDefinition {
    _name: string;
    _points: ArrayPointDefinition[];
}

/** Heck Custom Data interface for difficulty custom data.
 * ```ts
 * _track: string,
 * ```
 */
export interface IHeckCustomData {
    _customEvents?: IHeckCustomEvent[];
    _pointDefinitions?: IHeckPointDefinition[];
}
