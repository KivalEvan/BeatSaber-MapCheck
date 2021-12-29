import { Easings } from './easings';
type Array2DPoint = [number, number];
type Array3DPoint = [number, number, number];
type ArrayColorPointDefinition = [number, number, number, number, number, Easings?];
type ArrayPercentPointDefinition = [number, number, Easings?];
type Array2DPointDefinition = [number, number, number, Easings?, 'splineCatmullRom'?];
type Array3DPointDefinition = [
    number,
    number,
    number,
    number,
    Easings?,
    'splineCatmullRom'?
];
type ArrayPointDefinition =
    | Array2DPointDefinition[]
    | Array3DPointDefinition[]
    | ArrayColorPointDefinition[];

export const NEName = 'Noodle Extensions';

export enum NEDataAbbr {
    _childrenTracks = 'Ct',
    _color = 'C',
    _definitePosition = 'Dp',
    _dissolve = 'D',
    _dissolveArrow = 'Da',
    _duration = 'Dur',
    _easing = 'E',
    _interactable = 'I',
    _localRotation = 'Lr',
    _parentTrack = 'Pt',
    _position = 'P',
    _rotation = 'R',
    _scale = 'S',
    _time = 'T',
    _track = 'Tr',
}

/**
 * Noodle Extensions Object interface for Beatmap Object.
 *
 *     _position?: [float, float],
 *     _rotation?: [float, float, float],
 *     _localRotation?: [float, float, float],
 *     _noteJumpMovementSpeed?: float,
 *     _noteJumpStartBeatOffset?: float,
 *     _fake?: boolean,
 *     _interactable?: boolean,
 *     _track?: string,
 *     _animation?: NEAnimation
 */
interface NEObject {
    _position?: Array2DPoint;
    _rotation?: Array3DPoint;
    _localRotation?: Array3DPoint;
    _noteJumpMovementSpeed?: number;
    _noteJumpStartBeatOffset?: number;
    _fake?: boolean;
    _interactable?: boolean;
    _track?: string;
    _animation?: NEAnimation;
}

/**
 * Noodle Extensions Note interface for Beatmap Note.
 *
 *     _cutDirection?: int,
 *     _flip?: [float, float],
 *     _disableNoteGravity?: boolean,
 *     _disableNoteLook?: boolean,
 *
 * @extends NEObject
 */
export interface NENote extends NEObject {
    _cutDirection?: number;
    _flip?: Array2DPoint;
    _disableNoteGravity?: boolean;
    _disableNoteLook?: boolean;
}

/**
 * Noodle Extensions Obstacle interface for Beatmap Obstacle.
 *
 *     _scale?: [float, float, float],
 *
 * @extends NEObject
 */
export interface NEObstacle extends NEObject {
    _scale?: Array3DPoint;
}

/**
 * Noodle Extensions Event interface for Beatmap Event.
 *
 *     _rotation?: int,
 */
export interface NEEvent {
    _rotation?: number;
}

/**
 * Noodle Extensions Custom Event interface for AnimateTrack.
 *
 *     _time: float,
 *     _type: 'AnimateTrack',
 *     _data: NECustomEventDataAnimateTrack
 */
export interface NECustomEventAnimateTrack {
    _time: number;
    _type: 'AnimateTrack';
    _data: NECustomEventDataAnimateTrack;
}

/**
 * Noodle Extensions Custom Event interface for AssignPathAnimation.
 *
 *     _time: float,
 *     _type: 'AssignPathAnimation',
 *     _data: NECustomEventDataAssignPathAnimation
 */
export interface NECustomEventAssignPathAnimation {
    _time: number;
    _type: 'AssignPathAnimation';
    _data: NECustomEventDataAssignPathAnimation;
}

/**
 * Noodle Extensions Custom Event interface for AssignTrackParent.
 *
 *     _time: float,
 *     _type: 'AssignTrackParent',
 *     _data: NECustomEventDataAssignTrackParent
 */
export interface NECustomEventAssignTrackParent {
    _time: number;
    _type: 'AssignTrackParent';
    _data: NECustomEventDataAssignTrackParent;
}

/**
 * Noodle Extensions Custom Event interface for AssignPlayerToTrack.
 *
 *     _time: float,
 *     _type: 'AssignPlayerToTrack',
 *     _data: NECustomEventDataAssignPlayerToTrack
 */
export interface NECustomEventAssignPlayerToTrack {
    _time: number;
    _type: 'AssignPlayerToTrack';
    _data: NECustomEventDataAssignPlayerToTrack;
}

/**
 * Noodle Extensions Custom Event interface for AssignFogTrack.
 *
 *     _time: float,
 *     _type: 'AssignFogTrack',
 *     _data: NECustomEventDataAssignFogTrack
 */
export interface NECustomEventAssignFogTrack {
    _time: number;
    _type: 'AssignFogTrack';
    _data: NECustomEventDataAssignFogTrack;
}

export type NECustomEvent =
    | NECustomEventAnimateTrack
    | NECustomEventAssignPathAnimation
    | NECustomEventAssignTrackParent
    | NECustomEventAssignPlayerToTrack
    | NECustomEventAssignFogTrack;

/**
 * Noodle Extensions Point Definition interface.
 *
 *     _name: string,
 *     _points: ArrayPointDefinition[];
 */
export interface NEPointDefinition {
    _name: string;
    _points: ArrayPointDefinition[];
}

/**
 * Noodle Extensions Base Custom Event interface.
 *
 *     _track: string,
 */
export interface NECustomEventDataBase {
    _track: string;
}

/**
 * Noodle Extensions Custom Data interface for difficulty custom data.
 *
 *     _track: string,
 */
export interface NECustomData {
    _customEvents?: NECustomEvent[];
    _pointDefinitions?: NEPointDefinition[];
}

// lmao wtf
/**
 * AnimateTrack interface for Noodle Extensions Custom Event.
 *
 *     _duration: float,
 *     _easing?: Easings,
 *     _position?: string | Array3DPointDefinition[],
 *     _rotation?: string | Array3DPointDefinition[],
 *     _localRotation?: string | Array3DPointDefinition[],
 *     _scale?: string | Array3DPointDefinition[],
 *     _dissolve?: string | ArrayPercentPointDefinition[],
 *     _dissolveArrow?: string | ArrayPercentPointDefinition[],
 *     _color?: string | ArrayColorPointDefinition[],
 *     _interactable?: string | ArrayPercentPointDefinition[],
 *     _time?: string | ArrayPercentPointDefinition[]
 *
 * @extends NECustomEventDataBase
 */
export interface NECustomEventDataAnimateTrack extends NECustomEventDataBase {
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

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 *
 *     _duration: float,
 *     _easing?: Easings,
 *     _position?: string | Array3DPointDefinition[],
 *     _rotation?: string | Array3DPointDefinition[],
 *     _localRotation?: string | Array3DPointDefinition[],
 *     _scale?: string | Array3DPointDefinition[],
 *     _dissolve?: string | ArrayPercentPointDefinition[],
 *     _dissolveArrow?: string | ArrayPercentPointDefinition[],
 *     _color?: string | ArrayColorPointDefinition[],
 *     _interactable?: string | ArrayPercentPointDefinition[],
 *     _definitePosition?: string | Array3DPointDefinition[]
 *
 * @extends NECustomEventDataBase
 */
export interface NECustomEventDataAssignPathAnimation extends NECustomEventDataBase {
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

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 *
 *     _childrenTracks: string[];
 *     _parentTrack: string;
 */
export interface NECustomEventDataAssignTrackParent {
    _childrenTracks: string[];
    _parentTrack: string;
}

/**
 * AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends NECustomEventDataBase
 */
export interface NECustomEventDataAssignPlayerToTrack extends NECustomEventDataBase {}

/**
 * AssignFogTrack interface for Noodle Extensions Custom Event.
 *
 *     _attenuation: float | Array2DPointDefinition[];
 *     _offset: float | Array2DPointDefinition[];
 *     _startY: float | Array2DPointDefinition[];
 *     _height: float | Array2DPointDefinition[];
 */
export interface NECustomEventDataAssignFogTrack extends NECustomEventDataBase {
    _attenuation: number | Array2DPointDefinition[];
    _offset: number | Array2DPointDefinition[];
    _startY: number | Array2DPointDefinition[];
    _height: number | Array2DPointDefinition[];
}

/**
 * Noodle Extensions Animation interface for Noodle Extensions Object.
 *
 *     _position?: string | Array3DPointDefinition[],
 *     _rotation?: string | Array3DPointDefinition[],
 *     _localRotation?: string | Array3DPointDefinition[],
 *     _scale?: string | Array3DPointDefinition[],
 *     _dissolve?: string | ArrayPercentPointDefinition[],
 *     _dissolveArrow?: string | ArrayPercentPointDefinition[],
 *     _color?: string | ArrayColorPointDefinition[],
 *     _interactable?: string | ArrayPercentPointDefinition[],
 *     _definitePosition?: string | Array3DPointDefinition[],
 *     _time?: string | ArrayPercentPointDefinition[]
 */
export interface NEAnimation {
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _definitePosition?: string | Array3DPointDefinition[];
    _time?: string | ArrayPercentPointDefinition[];
}

export type NECustomEventData =
    | NECustomEventDataAnimateTrack
    | NECustomEventDataAssignPathAnimation
    | NECustomEventDataAssignTrackParent
    | NECustomEventDataAssignPlayerToTrack
    | NECustomEventDataAssignFogTrack;
