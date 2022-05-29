import { ICustomDataBase } from '../shared/customData';
import { ColorPointDefinition, PercentPointDefinition, Vector2, Vector3, Vector3PointDefinition } from '../shared/heck';
import { IHeckCustomEventDataBase } from './heck';

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
/** Noodle Extensions Object interface for Beatmap Object. */
interface INEObject {
    _position?: Vector2;
    _rotation?: number | Vector3;
    _localRotation?: Vector3;
    _noteJumpMovementSpeed?: number;
    _noteJumpStartBeatOffset?: number;
    _fake?: boolean;
    _interactable?: boolean;
    _track?: string;
    _animation?: INEAnimation;
}

/** Noodle Extensions Note interface for Beatmap Note.
 * @extends INEObject
 */
export interface INENote extends INEObject {
    _cutDirection?: number;
    _flip?: Vector2;
    _disableNoteGravity?: boolean;
    _disableNoteLook?: boolean;
}

/** Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * @extends INEObject
 */
export interface INEObstacle extends INEObject {
    _scale?: Vector3;
}

/** Noodle Extensions Event interface for Beatmap Event.
 * @extends ICustomDataBase
 */
export interface INEEvent extends ICustomDataBase {
    _rotation?: number;
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event. */
export interface INECustomEventDataAssignTrackParent {
    _childrenTracks: string[];
    _parentTrack: string;
    _worldPositionStays?: boolean;
}

/** AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends INECustomEventDataBase
 */
export interface INECustomEventDataAssignPlayerToTrack extends IHeckCustomEventDataBase {
    _track: string;
}

/** Noodle Extensions Animation interface for Noodle Extensions Object. */
export interface INEAnimation {
    _position?: string | Vector3PointDefinition[];
    _rotation?: string | Vector3PointDefinition[];
    _localRotation?: string | Vector3PointDefinition[];
    _scale?: string | Vector3PointDefinition[];
    _dissolve?: string | PercentPointDefinition[];
    _dissolveArrow?: string | PercentPointDefinition[];
    _color?: string | ColorPointDefinition[];
    _interactable?: string | PercentPointDefinition[];
    _definitePosition?: string | Vector3PointDefinition[];
    _time?: string | PercentPointDefinition[];
}

/** Noodle Extensions Custom Event interface for AssignTrackParent. */
export interface INECustomEventAssignTrackParent {
    _time: number;
    _type: 'AssignTrackParent';
    _data: INECustomEventDataAssignTrackParent;
}

/** Noodle Extensions Custom Event interface for AssignPlayerToTrack. */
export interface INECustomEventAssignPlayerToTrack {
    _time: number;
    _type: 'AssignPlayerToTrack';
    _data: INECustomEventDataAssignPlayerToTrack;
}

export type INECustomEvent = INECustomEventAssignTrackParent | INECustomEventAssignPlayerToTrack;

/** Noodle Extensions Custom Data interface for difficulty custom data. */
export interface INECustomData {
    _customEvents?: INECustomEvent[];
}
