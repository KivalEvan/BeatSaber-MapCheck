import {
    IChromaEventLaser,
    IChromaEventLight,
    IChromaEventRotation,
    IChromaEventZoom,
} from './chroma';
import { ICustomData } from './customData';
import { INEEvent } from './noodleExtensions';
import { IBaseObject } from './object';

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
export interface IEventBase extends IBaseObject {
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
     * 16 -> Utility Event 0
     * 17 -> Utility Event 1
     * 18 -> Utility Event 2
     * 19 -> Utility Event 3
     * 40 -> Special Event 0
     * 41 -> Special Event 1
     * 42 -> Special Event 2
     * 43 -> Special Event 3
     * 100 -> BPM Change
     * ```
     */
    _type: number;
    /** Value of event. */
    _value: number;
    _floatValue: number;
    _customData?: ICustomData;
}

export interface IEventLight extends IEventBase {
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
    _customData?: IChromaEventLight;
}

export interface IEventGeneric extends IEventBase {
    _type: number;
}

export interface IEventBoost extends IEventBase {
    _type: 5;
    /** Toggle between boost event. */
    _value: 0 | 1;
}

export interface IEventRing extends IEventBase {
    _type: 8;
    _customData?: IChromaEventRotation;
}

export interface IEventZoom extends IEventBase {
    _type: 9;
    _customData?: IChromaEventRotation & IChromaEventZoom;
}

export interface IEventLaser extends IEventBase {
    _type: 12 | 13;
    /** Laser rotation speed in degree per second multiplied by 20. */
    _value: number;
    _customData?: IChromaEventLaser;
}

export interface IEventLaneRotation extends IEventBase {
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
    _customData?: INEEvent;
}

export interface IEventExtra extends IEventBase {
    _type: 16 | 17 | 18 | 19;
}

export interface IEventSpecial extends IEventBase {
    _type: 40 | 41 | 42 | 43;
}

export interface IEventBPMChange extends IEventBase {
    _type: 100;
    /** Changes the BPM to this value. */
    _floatValue: number;
}

export type IEvent =
    | IEventGeneric
    | IEventLight
    | IEventBoost
    | IEventRing
    | IEventZoom
    | IEventLaser
    | IEventLaneRotation
    | IEventExtra
    | IEventSpecial
    | IEventBPMChange;

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

interface IEventCountStats {
    total: number;
    chroma: number;
    chromaOld: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export interface IEventCount {
    [key: number]: IEventCountStats;
}