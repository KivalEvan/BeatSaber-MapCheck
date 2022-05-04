import {
    ArrayPercentPointDefinition,
    Array3DPoint,
    ArrayColorPointDefinition,
    IHeckCustomEventDataBase,
} from './heck';
import { Easings } from '../shared/easings';
import { ColorArray } from '../shared/colors';
import { ICustomDataBase } from './customData';
type LookupMethod = 'Regex' | 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith';

export const chromaName = 'Chroma';

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

/** Chroma interface for Environment Enhancement.
 * ```ts
 * _id: string,
 * _lookupMethod: LookupMethod,
 * _track?: string,
 * _duplicate?: int,
 * _active?: boolean,
 * _scale?: [float, float, float],
 * _position?: [float, float, float],
 * _localPosition?: [float, float, float],
 * _rotation?: [float, float, float],
 * _localRotation?: [float, float, float],
 * _lightID?: int
 * ```
 */
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
    _scale?: Array3DPoint;
    _position?: Array3DPoint;
    _localPosition?: Array3DPoint;
    _rotation?: Array3DPoint;
    _localRotation?: Array3DPoint;
    /** Assign light ID for duplicated object. */
    _lightID?: number;
}

/** Chroma interface for Beatmap Note Custom Data.
 * ```ts
    _color?: string | ArrayColorPointDefinition[]
 * ```
 */
export interface IChromaAnimation {
    _color?: string | ArrayColorPointDefinition[];
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

/** Chroma interface for Beatmap Event Light Custom Data.
 * ```ts
 * _color?: [float, float, float, float?],
 * _lightID?: int | int[],
 * _propID?: int,
 * _lightGradient?: {
 *     _duration: float,
 *     _startColor?: [float, float, float, float?],
 *     _endColor?: [float, float, float, float?],
 *     _easing?: Easings
 * },
 * _lerpType?: 'HSV' | 'RGB',
 * _easing?: Easings
 * ```
 */
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

/** Chroma interface for Beatmap Event Laser Rotation Custom Data.
 * ```ts
 * _lockPosition?: boolean,
 * _speed?: float,
 * _preciseSpeed?: float,
 * _direction?: int
 * ```
 */
export interface IChromaEventLaser extends ICustomDataBase {
    _lockPosition?: boolean;
    _speed?: number;
    _preciseSpeed?: number;
    _direction?: number;
}

/** Chroma interface for Beatmap Event Ring Spin Custom Data.
 * ```ts
 * _nameFilter?: string,
 * _reset?: boolean,
 * _rotation?: float,
 * _step?: float,
 * _prop?: float,
 * _speed?: float,
 * _direction?: int,
 * _counterSpin?: boolean,
 * _stepMult?: float,
 * _propMult?: float,
 * _speedMult?: float
 * ```
 */
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

/** Chroma interface for Beatmap Event Ring Zoom Custom Data.
 * ```ts
 * _step?: float,
 * _speed?: float
 * ```
 */
export interface IChromaEventZoom extends ICustomDataBase {
    _step?: number;
    _speed?: number;
}

/** AssignFogTrack interface for Noodle Extensions Custom Event.
 * ```ts
 * _attenuation: float | ArrayPercentPointDefinition[];
 * _offset: float | ArrayPercentPointDefinition[];
 * _startY: float | ArrayPercentPointDefinition[];
 * _height: float | ArrayPercentPointDefinition[];
 * ```
 */
export interface IChromaCustomEventDataAssignFogTrack extends IHeckCustomEventDataBase {
    _track: string;
    _attenuation?: number | ArrayPercentPointDefinition[];
    _offset?: number | ArrayPercentPointDefinition[];
    _startY?: number | ArrayPercentPointDefinition[];
    _height?: number | ArrayPercentPointDefinition[];
}

/** Chroma Custom Event interface for AssignFogTrack.
 * ```ts
 * _time: float,
 * _type: 'AssignFogTrack',
 * _data: NECustomEventDataAssignFogTrack
 * ```
 */
export interface IChromaCustomEventAssignFogTrack {
    _time: number;
    _type: 'AssignFogTrack';
    _data: IChromaCustomEventDataAssignFogTrack;
}
export interface IChromaCustomEventAssignFogTrackV3 {
    b: number;
    t: 'AssignFogTrack';
    d: IChromaCustomEventDataAssignFogTrack;
}

export type IChromaCustomEventV2 = IChromaCustomEventAssignFogTrack;
export type IChromaCustomEventV3 = IChromaCustomEventAssignFogTrackV3;

/** Chroma Custom Data interface for difficulty custom data.
 * ```ts
 * _customEvents?: ChromaCustomEvent[];
 * _environment?: ChromaEnvironment[];
 * ```
 */
export interface IChromaCustomData {
    _customEvents?: IChromaCustomEventV2[];
    _environment?: IChromaEnvironment[];
}

/** Chroma interface for Difficulty Info Custom Data.
 * ```ts
 * _environmentalRemoval?: string[]
 * ```
 */
export interface IChromaEnvironmentOld {
    _environmentalRemoval?: string[];
}
