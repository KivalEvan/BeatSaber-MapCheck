import {
    Array2DPoint,
    Array3DPoint,
    Array3DPointDefinition,
    ArrayColorPointDefinition,
    ArrayPercentPointDefinition,
    HeckCustomEventDataBase,
} from './heck';

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
    _worldPositionStays = 'Wps',
}
/** Noodle Extensions Object interface for Beatmap Object.
 * ```ts
 * _position?: [float, float],
 * _rotation?: [float, float, float],
 * _localRotation?: [float, float, float],
 * _noteJumpMovementSpeed?: float,
 * _noteJumpStartBeatOffset?: float,
 * _fake?: boolean,
 * _interactable?: boolean,
 * _track?: string,
 * _animation?: NEAnimation
 * ```
 */
interface NEObject {
    _position?: Array2DPoint;
    _rotation?: number | Array3DPoint;
    _localRotation?: Array3DPoint;
    _noteJumpMovementSpeed?: number;
    _noteJumpStartBeatOffset?: number;
    _fake?: boolean;
    _interactable?: boolean;
    _track?: string;
    _animation?: NEAnimation;
}

/** Noodle Extensions Note interface for Beatmap Note.
 * ```ts
 * _cutDirection?: int,
 * _flip?: [float, float],
 * _disableNoteGravity?: boolean,
 * _disableNoteLook?: boolean
 * ```
 * @extends NEObject
 */
export interface NENote extends NEObject {
    _cutDirection?: number;
    _flip?: Array2DPoint;
    _disableNoteGravity?: boolean;
    _disableNoteLook?: boolean;
}

/** Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * ```ts
 * _scale?: [float, float, float]
 * ```
 * @extends NEObject
 */
export interface NEObstacle extends NEObject {
    _scale?: Array3DPoint;
}

/** Noodle Extensions Event interface for Beatmap Event.
 * ```ts
 * _rotation?: int
 * ```
 */
export interface NEEvent {
    _rotation?: number;
}

// lmao wtf
/** AssignPathAnimation interface for Noodle Extensions Custom Event.
 * ```ts
 * _childrenTracks: string[];
 * _parentTrack: string;
 * _worldPositionStays?: boolean;
 * ```
 */
export interface NECustomEventDataAssignTrackParent {
    _childrenTracks: string[];
    _parentTrack: string;
    _worldPositionStays?: boolean;
}

/** AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends NECustomEventDataBase
 */
export interface NECustomEventDataAssignPlayerToTrack extends HeckCustomEventDataBase {
    _track: string;
}

/** Noodle Extensions Animation interface for Noodle Extensions Object.
 * ```ts
 * _position?: string | Array3DPointDefinition[],
 * _rotation?: string | Array3DPointDefinition[],
 * _localRotation?: string | Array3DPointDefinition[],
 * _scale?: string | Array3DPointDefinition[],
 * _dissolve?: string | ArrayPercentPointDefinition[],
 * _dissolveArrow?: string | ArrayPercentPointDefinition[],
 * _color?: string | ArrayColorPointDefinition[],
 * _interactable?: string | ArrayPercentPointDefinition[],
 * _definitePosition?: string | Array3DPointDefinition[],
 * _time?: string | ArrayPercentPointDefinition[]
 * ```
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

/** Noodle Extensions Custom Event interface for AssignTrackParent.
 * ```ts
 * _time: float,
 * _type: 'AssignTrackParent',
 * _data: NECustomEventDataAssignTrackParent
 * ```
 */
export interface NECustomEventAssignTrackParent {
    _time: number;
    _type: 'AssignTrackParent';
    _data: NECustomEventDataAssignTrackParent;
}

/** Noodle Extensions Custom Event interface for AssignPlayerToTrack.
 * ```ts
 * _time: float,
 * _type: 'AssignPlayerToTrack',
 * _data: NECustomEventDataAssignPlayerToTrack
 * ```
 */
export interface NECustomEventAssignPlayerToTrack {
    _time: number;
    _type: 'AssignPlayerToTrack';
    _data: NECustomEventDataAssignPlayerToTrack;
}

export type NECustomEvent =
    | NECustomEventAssignTrackParent
    | NECustomEventAssignPlayerToTrack;

/** Noodle Extensions Custom Data interface for difficulty custom data.
 * ```ts
 * _customEvents?: NECustomEvent[]
 * ```
 */
export interface NECustomData {
    _customEvents?: NECustomEvent[];
}
