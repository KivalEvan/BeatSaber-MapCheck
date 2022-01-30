import {
    ChromaEventLight,
    ChromaEventLaser,
    ChromaEventRotation,
    ChromaEventZoom,
} from './chroma';
import { NEEvent } from './noodleExtensions';

/**
 * Beatmap object interface for Event.
 *
 *     _time: float,
 *     _type: int,
 *     _value: int,
 *     _floatValue: int,
 *     _customData?: JSON
 */
// it took me long enough to realise Event is a built in JS class/interface, but it has no effect here anyway
export interface EventBase {
    _time: number;
    _type: number;
    _value: number;
    _floatValue: number;
    _customData?: Record<never, never>;
}

export interface EventLight extends EventBase {
    _type: 0 | 1 | 2 | 3 | 4 | 6 | 7 | 10 | 11;
    _customData?: ChromaEventLight;
}

export interface EventBoost extends EventBase {
    _type: 5;
    _value: 0 | 1;
}

export interface EventRing extends EventBase {
    _type: 8;
    _customData?: ChromaEventRotation;
}

export interface EventZoom extends EventBase {
    _type: 9;
    _customData?: ChromaEventRotation | ChromaEventZoom;
}

export interface EventLaser extends EventBase {
    _type: 12 | 13;
    _customData?: ChromaEventLaser;
}

export interface EventLaneRotation extends EventBase {
    _type: 14 | 15;
    _customData?: NEEvent;
}

export interface EventExtra extends EventBase {
    _type: 16 | 17;
}

export interface EventBPMChange extends EventBase {
    _type: 100;
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
    LOWER_HYDRAULIC,
    RAISE_HYDRAULIC,
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

/**
 * Enum for beatmap event type name.
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
    'Lower Hydraulic',
    'Raise Hydraulic',
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
