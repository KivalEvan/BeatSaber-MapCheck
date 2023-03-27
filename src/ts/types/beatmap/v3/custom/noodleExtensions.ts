import { Vector2, Vector3 } from '../../../vector';
import { PercentPointDefinition, Vector3PointDefinition } from '../../shared/custom/heck';
import { PlayerObject } from '../../shared/custom/noodleExtensions';
import { IHeckCustomEventDataBase } from './heck';

/** Noodle Extensions Object interface for Beatmap Object. */
interface INEObject {
    coordinates?: Vector2;
    worldRotation?: number | Vector3;
    localRotation?: Vector3;
    noteJumpMovementSpeed?: number;
    noteJumpStartBeatOffset?: number;
    uninteractable?: boolean;
    track?: string | string[];
}

/** Noodle Extensions Note interface for Beatmap Note.
 * @extends INEObject
 */
export interface INENote extends INEObject {
    flip?: Vector2;
    disableNoteGravity?: boolean;
    disableNoteLook?: boolean;
    disableBadCutDirection?: boolean;
    disableBadCutSpeed?: boolean;
    disableBadCutSaberType?: boolean;
}

/** Noodle Extensions Slider interface for Beatmap Slider.
 * @extends INENote
 */
export interface INESlider extends INENote {
    tailCoordinates?: Vector2;
}

/** Noodle Extensions Obstacle interface for Beatmap Obstacle.
 * @extends INEObject
 */
export interface INEObstacle extends INEObject {
    size?: Vector3;
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface INECustomEventDataAnimateTrack extends IHeckCustomEventDataBase {
    dissolve?: string | number | PercentPointDefinition[];
    dissolveArrow?: string | number | PercentPointDefinition[];
    interactable?: string | number | PercentPointDefinition[];
    time?: string | number | PercentPointDefinition[];
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event.
 * @extends IHeckCustomEventDataBase
 */
export interface INECustomEventDataAssignPathAnimation extends IHeckCustomEventDataBase {
    dissolve?: string | number | PercentPointDefinition[];
    dissolveArrow?: string | number | PercentPointDefinition[];
    interactable?: string | number | PercentPointDefinition[];
    definitePosition?: string | Vector3 | Vector3PointDefinition[];
}

/** AssignPathAnimation interface for Noodle Extensions Custom Event. */
export interface INECustomEventDataAssignTrackParent {
    childrenTracks: string | string[];
    parentTrack: string;
    worldPositionStays?: boolean;
}

/** AssignPlayerToTrack interface for Noodle Extensions Custom Event.
 * @extends INECustomEventDataBase
 */
export interface INECustomEventDataAssignPlayerToTrack extends IHeckCustomEventDataBase {
    track: string;
    target?: PlayerObject;
}

/** Noodle Extensions Animation interface for Noodle Extensions Object. */
export interface INEAnimation {
    offsetPosition?: string | Vector3 | Vector3PointDefinition[];
    offsetRotation?: string | Vector3 | Vector3PointDefinition[];
    localRotation?: string | Vector3 | Vector3PointDefinition[];
    scale?: string | Vector3 | Vector3PointDefinition[];
    dissolve?: string | number | PercentPointDefinition[];
    dissolveArrow?: string | number | PercentPointDefinition[];
    interactable?: string | number | PercentPointDefinition[];
    definitePosition?: string | Vector3 | Vector3PointDefinition[];
    time?: string | number | PercentPointDefinition[];
}
