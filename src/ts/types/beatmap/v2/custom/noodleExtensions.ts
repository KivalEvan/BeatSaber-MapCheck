import type { Nullable } from '../../../utils.ts';
import type { Vector2, Vector3 } from '../../../vector.ts';
import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type { FloatPointDefinition, Vector3PointDefinition } from '../../shared/custom/heck.ts';
import type { PlayerObject } from '../../shared/custom/noodleExtensions.ts';
import type { IHeckBase } from './heck.ts';

/** Noodle Extensions Object interface for Beatmap Object. */
interface INEObject {
   _position?: Vector2;
   _rotation?: number | Vector3;
   _localRotation?: Vector3;
   _noteJumpMovementSpeed?: number;
   _noteJumpStartBeatOffset?: number;
   _fake?: boolean;
   _interactable?: boolean;
}

/**
 * Noodle Extensions Note interface for Beatmap Note.
 * @extends INEObject
 */
export interface INENote extends INEObject {
   _cutDirection?: number;
   _flip?: Vector2;
   _disableNoteGravity?: boolean;
   _disableNoteLook?: boolean;
}

/**
 * Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * @extends INEObject
 */
export interface INEObstacle extends INEObject {
   _scale?: Nullable<Vector3>;
}

/**
 * Noodle Extensions Event interface for Beatmap Event.
 * @extends ICustomDataBase
 */
export interface INEEvent extends ICustomDataBase {
   _rotation?: number;
}

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAnimateTrack extends Required<IHeckBase> {
   _dissolve?: string | [number] | FloatPointDefinition[];
   _dissolveArrow?: string | [number] | FloatPointDefinition[];
   _interactable?: string | [number] | FloatPointDefinition[];
   _time?: string | [number] | FloatPointDefinition[];
}

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAssignPathAnimation extends Required<IHeckBase> {
   _dissolve?: string | [number] | FloatPointDefinition[];
   _dissolveArrow?: string | [number] | FloatPointDefinition[];
   _interactable?: string | [number] | FloatPointDefinition[];
   _definitePosition?: string | Vector3 | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event. */
export interface INECustomEventDataAssignTrackParent {
   _childrenTracks: string | string[];
   _parentTrack: string;
   _worldPositionStays?: boolean;
}

/**
 * AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAssignPlayerToTrack extends Required<IHeckBase> {
   _target?: PlayerObject;
}

/** Noodle Extensions Animation interface for Noodle Extensions Object. */
export interface INEAnimation {
   _position?: string | Vector3 | Vector3PointDefinition[];
   _rotation?: string | Vector3 | Vector3PointDefinition[];
   _localRotation?: string | Vector3 | Vector3PointDefinition[];
   _scale?: string | Vector3 | Vector3PointDefinition[];
   _dissolve?: string | [number] | FloatPointDefinition[];
   _dissolveArrow?: string | [number] | FloatPointDefinition[];
   _interactable?: string | [number] | FloatPointDefinition[];
   _definitePosition?: string | Vector3 | Vector3PointDefinition[];
   _time?: string | [number] | FloatPointDefinition[];
}
