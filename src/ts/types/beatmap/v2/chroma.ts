import { ColorPointDefinition, PercentPointDefinition, Vector3 } from '../shared/heck';
import { Easings } from '../shared/easings';
import { ColorArray } from '../shared/colors';
import { ICustomDataBase } from '../shared/customData';
import { LookupMethod } from '../shared/chroma';
import { IHeckCustomEventDataBase } from './heck';

export enum ChromaDataEnvAbbr {
    _id = 'Ct',
    _lookupMethod = 'Lm',
    _duplicate = 'D',
    _active = 'A',
    _scale = 'S',
    _position = 'P',
    _localPosition = 'Lp',
    _rotation = 'R',
    _localRotation = 'Lr',
    _lightID = 'Li',
    _track = 'T',
}

/** Chroma interface for Environment Enhancement. */
export interface IChromaEnvironment {
    /** Look up environment object name.
     * This grabs every environment objects that match the string.
     * ```ts
     * _id: 'Environment.[0]GlowLine' || 'Environment\.\\[\\d+\\]GlowLine$' // Regex example
     * ```
     */
    _id: string;
    /** Look-up method to grab the object name.
     * Regex is considered an advanced method and more powerful than other methods.
     */
    _lookupMethod: LookupMethod;
    /** Assign track to the object for animation use. */
    _track?: string;
    /** Duplicate the object by set amount.
     * **WARNING:** You should always duplicate only one at a time unless you know what you are doing.
     */
    _duplicate?: number;
    _active?: boolean;
    _scale?: Vector3;
    _position?: Vector3;
    _localPosition?: Vector3;
    _rotation?: Vector3;
    _localRotation?: Vector3;
    /** Assign light ID for duplicated object. */
    _lightID?: number;
}

/** Chroma interface for Beatmap Note Custom Data.
 * ```ts
    _color?: string | ArrayColorPointDefinition[]
 * ```
 */
export interface IChromaAnimation {
    _color?: string | ColorPointDefinition[];
}

/** Chroma interface for Beatmap Note Custom Data.
 * ```ts
 * _color?: [float, float, float, float?],
 * _disableSpawnEffect?: boolean
 * ```
 */
export interface IChromaNote {
    _color?: ColorArray;
    _disableSpawnEffect?: boolean;
}

/** Chroma interface for Beatmap Obstacle Custom Data.
 * ```ts
 * _color?: [float, float, float, float?]
 * ```
 */
export interface IChromaObstacle {
    _color?: ColorArray;
}

/** Chroma interface for Beatmap Event Light Custom Data. */
export interface IChromaEventLight extends ICustomDataBase {
    _color?: ColorArray;
    _lightID?: number | number[];
    _propID?: number;
    _lightGradient?: {
        _duration: number;
        _startColor: ColorArray;
        _endColor: ColorArray;
        _easing?: Easings;
    };
    _lerpType?: 'HSV' | 'RGB';
    _easing?: Easings;
}

/** Chroma interface for Beatmap Event Laser Rotation Custom Data. */
export interface IChromaEventLaser extends ICustomDataBase {
    _lockPosition?: boolean;
    _speed?: number;
    _preciseSpeed?: number;
    _direction?: number;
}

/** Chroma interface for Beatmap Event Ring Spin Custom Data. */
export interface IChromaEventRing extends ICustomDataBase {
    _nameFilter?: string;
    _reset?: boolean;
    _rotation?: number;
    _step?: number;
    _prop?: number;
    _speed?: number;
    _direction?: number;
    _counterSpin?: boolean;
    _stepMult?: number;
    _propMult?: number;
    _speedMult?: number;
}

/** Chroma interface for Beatmap Event Ring Zoom Custom Data. */
export interface IChromaEventZoom extends ICustomDataBase {
    _step?: number;
    _speed?: number;
}

/** AssignFogTrack interface for Noodle Extensions Custom Event. */
export interface IChromaCustomEventDataAssignFogTrack extends IHeckCustomEventDataBase {
    _track: string;
    _attenuation?: number | PercentPointDefinition[];
    _offset?: number | PercentPointDefinition[];
    _startY?: number | PercentPointDefinition[];
    _height?: number | PercentPointDefinition[];
}

/** Chroma Custom Event interface for AssignFogTrack. */
export interface IChromaCustomEventAssignFogTrack {
    _time: number;
    _type: 'AssignFogTrack';
    _data: IChromaCustomEventDataAssignFogTrack;
}

export type IChromaCustomEvent = IChromaCustomEventAssignFogTrack;

/** Chroma Custom Data interface for difficulty custom data. */
export interface IChromaCustomData {
    _customEvents?: IChromaCustomEvent[];
    _environment?: IChromaEnvironment[];
}
