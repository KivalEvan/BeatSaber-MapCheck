import { ICustomDataBase } from './customData';
import {
    Array2DPoint,
    Array3DPoint,
    Array3DPointDefinition,
    ArrayColorPointDefinition,
    ArrayPercentPointDefinition,
    IHeckCustomEventDataBase,
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
interface INEObject {
    _position?: Array2DPoint;
    _rotation?: number | Array3DPoint;
    _localRotation?: Array3DPoint;
    _noteJumpMovementSpeed?: number;
    _noteJumpStartBeatOffset?: number;
    _fake?: boolean;
    _interactable?: boolean;
    _track?: string;
    _animation?: INEAnimation;
}

/** Noodle Extensions Note interface for Beatmap Note.
 * ```ts
 * _cutDirection?: int,
 * _flip?: [float, float],
 * _disableNoteGravity?: boolean,
 * _disableNoteLook?: boolean
 * ```
 * @extends INEObject
 */
export interface INENote extends INEObject {
    _cutDirection?: number;
    _flip?: Array2DPoint;
    _disableNoteGravity?: boolean;
    _disableNoteLook?: boolean;
}

/** Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * ```ts
 * _scale?: [float, float, float]
 * ```
 * @extends INEObject
 */
export interface INEObstacle extends INEObject {
    _scale?: Array3DPoint;
}

/** Noodle Extensions Event interface for Beatmap Event.
 * ```ts
 * _rotation?: int
 * ```
 */
export interface INEEvent extends ICustomDataBase {
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
export interface INECustomEventDataAssignTrackParent {
    _childrenTracks: string[];
    _parentTrack: string;
    _worldPositionStays?: boolean;
}

/** AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends INECustomEventDataBase
 */
export interface INECustomEventDataAssignPlayerToTrack
    extends IHeckCustomEventDataBase {
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
export interface INEAnimation {
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
export interface INECustomEventAssignTrackParent {
    _time: number;
    _type: 'AssignTrackParent';
    _data: INECustomEventDataAssignTrackParent;
}
export interface INECustomEventAssignTrackParentV3 {
    b: number;
    t: 'AssignTrackParent';
    d: INECustomEventDataAssignTrackParent;
}

/** Noodle Extensions Custom Event interface for AssignPlayerToTrack.
 * ```ts
 * _time: float,
 * _type: 'AssignPlayerToTrack',
 * _data: NECustomEventDataAssignPlayerToTrack
 * ```
 */
export interface INECustomEventAssignPlayerToTrack {
    _time: number;
    _type: 'AssignPlayerToTrack';
    _data: INECustomEventDataAssignPlayerToTrack;
}
export interface INECustomEventAssignPlayerToTrackV3 {
    b: number;
    t: 'AssignPlayerToTrack';
    d: INECustomEventDataAssignPlayerToTrack;
}

export type INECustomEventV2 =
    | INECustomEventAssignTrackParent
    | INECustomEventAssignPlayerToTrack;
export type INECustomEventV3 =
    | INECustomEventAssignTrackParentV3
    | INECustomEventAssignPlayerToTrackV3;

/** Noodle Extensions Custom Data interface for difficulty custom data.
 * ```ts
 * _customEvents?: NECustomEvent[]
 * ```
 */
export interface INECustomData {
    _customEvents?: INECustomEventV2[];
}
