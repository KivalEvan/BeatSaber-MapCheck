import {
    ChromaEventLaser,
    ChromaEventLight,
    ChromaEventRotation,
    ChromaEventZoom,
} from './chroma';
import { NEEvent } from './noodleExtensions';

export enum Type {
    BACK_LASERS,
    RING_LIGHTS,
    LEFT_LASERS,
    RIGHT_LASERS,
    CENTER_LIGHTS,
    LIGHT_BOOST,
    EXTRA_LEFT_LIGHTS,
    EXTRA_RIGHT_LIGHTS,
    RING_ROTATION,
    RING_ZOOM,
    EXTRA_LEFT_LASERS,
    EXTRA_RIGHT_LASERS,
    LEFT_LASER_ROTATION,
    RIGHT_LASER_ROTATION,
    EARLY_LANE_ROTATION,
    LATE_LANE_ROTATION,
    UTILITY_EVENT_1,
    UTILITY_EVENT_2,
    UTILITY_EVENT_3,
    UTILITY_EVENT_4,
    BPM_CHANGE = 100,
}

export enum Value {
    OFF,
    BLUE_ON,
    BLUE_FLASH,
    BLUE_FADE,
    BLUE_TRANSITION,
    RED_ON,
    RED_FLASH,
    RED_FADE,
    RED_TRANSITION,
}

/** Beatmap object interface for Event.
 * ```ts
 * _time: float,
 * _type: int,
 * _value: int,
 * _floatValue: float,
 * _customData?: JSON
 * ```
 */
// it took me long enough to realise Event is a built in JS class/interface, but it has no effect here anyway
export interface EventBase {
    _time: number;
    /** Type of event.
     * ```ts
     * 0 -> Back Lasers
     * 1 -> Ring Lights
     * 2 -> Left Lasers
     * 3 -> Right Lasers
     * 4 -> Center Lights
     * 5 -> Light Boost
     * 6 -> Extra Left Lights
     * 7 -> Extra Right Lights
     * 8 -> Ring Rotation
     * 9 -> Ring Zoom
     * 10 -> Extra Left Lasers
     * 11 -> Extra Right Lasers
     * 12 -> Left Laser Rotation
     * 13 -> Right Laser Rotation
     * 14 -> Early Lane Rotation
     * 15 -> Late Lane Rotation
     * 16 -> Lower Hydraulic
     * 17 -> Raise Hydraulic
     * 18 -> Utility Event
     * 19 -> Utility Event
     * 100 -> BPM Change
     * ```
     */
    _type: number;
    /** Value of event. */
    _value: number;
    _floatValue: number;
    _customData?: Record<never, never>;
}

export interface EventLight extends EventBase {
    _type: 0 | 1 | 2 | 3 | 4 | 6 | 7 | 10 | 11;
    /** State of light event. ( Blue | Red )
     * ```ts
     * 0 -> Off
     * 1 | 5 -> On
     * 2 | 6 -> Flash
     * 3 | 7 -> Fade
     * 4 | 8 -> Transition
     * ```
     */
    _value: number;
    /** Controls the brightness of the light.
     * ```ts
     * Range: 0-1 // (0% to 100%), can be more than 1.
     * ```
     */
    _floatValue: number;
    _customData?: ChromaEventLight;
}

export interface EventBoost extends EventBase {
    _type: 5;
    /** Toggle between boost event. */
    _value: 0 | 1;
}

export interface EventRing extends EventBase {
    _type: 8;
    _customData?: ChromaEventRotation;
}

export interface EventZoom extends EventBase {
    _type: 9;
    _customData?: ChromaEventRotation & ChromaEventZoom;
}

export interface EventLaser extends EventBase {
    _type: 12 | 13;
    /** Laser rotation speed in degree per second multiplied by 20. */
    _value: number;
    _customData?: ChromaEventLaser;
}

export interface EventLaneRotation extends EventBase {
    _type: 14 | 15;
    /** Amount of angle changed clockwise.
     * ```ts
     * 0 -> -60 Degree
     * 1 -> -45 Degree
     * 2 -> -30 Degree
     * 3 -> -15 Degree
     * 4 -> 15 Degree
     * 5 -> 30 Degree
     * 6 -> 45 Degree
     * 7 -> 60 Degree
     * ```
     */
    _value: number;
    _customData?: NEEvent;
}

export interface EventExtra extends EventBase {
    _type: 16 | 17 | 18 | 19;
}

export interface EventBPMChange extends EventBase {
    _type: 100;
    /** Changes the BPM to this value. */
    _floatValue: number;
}

export type Event =
    | EventLight
    | EventBoost
    | EventRing
    | EventZoom
    | EventLaser
    | EventLaneRotation
    | EventExtra
    | EventBPMChange;

/** Enum for beatmap event type name.
 * @enum {number} Event type name
 */
export enum EventRename {
    'Back Lasers',
    'Ring Lights',
    'Left Lasers',
    'Right Lasers',
    'Center Lights',
    'Light Boost',
    'Extra Left Lights',
    'Extra Right Lights',
    'Ring Rotation',
    'Ring Zoom',
    'Extra Left Lasers',
    'Extra Right Lasers',
    'Left Laser Rotation',
    'Right Laser Rotation',
    'Early Lane Rotation',
    'Late Lane Rotation',
    'Utility Event 1',
    'Utility Event 2',
    'Utility Event 3',
    'Utility Event 4',
    'BPM Change' = 100,
}

interface EventCountStats {
    total: number;
    chroma: number;
    chromaOld: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export interface EventCount {
    [key: number]: EventCountStats;
}
