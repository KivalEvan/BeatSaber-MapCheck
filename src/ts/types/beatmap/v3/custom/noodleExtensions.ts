import type { Nullable } from '../../../utils.ts';
import type { Vector2, Vector3 } from '../../../vector.ts';
import type { FloatPointDefinition, Vector3PointDefinition } from '../../shared/custom/heck.ts';
import type { PlayerObject } from '../../shared/custom/noodleExtensions.ts';
import type { IHeckBase } from './heck.ts';

/** Noodle Extensions Object interface for Beatmap Object. */
interface INEObject {
   coordinates?: Vector2;
   worldRotation?: number | Vector3;
   localRotation?: Vector3;
   noteJumpMovementSpeed?: number;
   noteJumpStartBeatOffset?: number;
   uninteractable?: boolean;
}

/**
 * Noodle Extensions Note interface for Beatmap Note.
 * @extends INEObject
 */
export interface INENote extends INEObject {
   flip?: Vector2;
   disableNoteGravity?: boolean;
   disableNoteLook?: boolean;
   disableBadCutDirection?: boolean;
   disableBadCutSpeed?: boolean;
   disableBadCutSaberType?: boolean;
   link?: string;
}

/**
 * Noodle Extensions Slider interface for Beatmap Arc.
 * @extends INENote
 */
export interface INESlider extends INENote {
   tailCoordinates?: Vector2;
}

/**
 * Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * @extends INEObject
 */
export interface INEObstacle extends INEObject {
   size?: Nullable<Vector3>;
}

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAnimateTrack extends Required<IHeckBase> {
   offsetPosition?: string | Vector3 | Vector3PointDefinition[];
   offsetWorldRotation?: string | Vector3 | Vector3PointDefinition[];
   dissolve?: string | [number] | FloatPointDefinition[];
   dissolveArrow?: string | [number] | FloatPointDefinition[];
   interactable?: string | [number] | FloatPointDefinition[];
   time?: string | [number] | FloatPointDefinition[];
}

/**
 * AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAssignPathAnimation extends Required<IHeckBase> {
   offsetPosition?: string | Vector3 | Vector3PointDefinition[];
   offsetWorldRotation?: string | Vector3 | Vector3PointDefinition[];
   dissolve?: string | [number] | FloatPointDefinition[];
   dissolveArrow?: string | [number] | FloatPointDefinition[];
   interactable?: string | [number] | FloatPointDefinition[];
   definitePosition?: string | Vector3 | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event. */
export interface INECustomEventDataAssignTrackParent {
   childrenTracks: string | string[];
   parentTrack: string;
   worldPositionStays?: boolean;
}

/**
 * AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends Required<IHeckBase>
 */
export interface INECustomEventDataAssignPlayerToTrack extends Required<IHeckBase> {
   target?: PlayerObject;
}

/** Noodle Extensions Animation interface for Noodle Extensions Object. */
export interface INEAnimation {
   offsetPosition?: string | Vector3 | Vector3PointDefinition[];
   offsetRotation?: string | Vector3 | Vector3PointDefinition[];
   localRotation?: string | Vector3 | Vector3PointDefinition[];
   scale?: string | Vector3 | Vector3PointDefinition[];
   dissolve?: string | [number] | FloatPointDefinition[];
   dissolveArrow?: string | [number] | FloatPointDefinition[];
   interactable?: string | [number] | FloatPointDefinition[];
   definitePosition?: string | Vector3 | Vector3PointDefinition[];
   time?: string | [number] | FloatPointDefinition[];
}
