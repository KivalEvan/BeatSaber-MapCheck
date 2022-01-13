import { Easings } from './easings';
import { HeckCustomEventDataBase, Array3DPoint, Array2DPointDefinition } from './heck';
type LookupMethod = 'Regex' | 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith';
type ArrayColor = [number, number, number] | [number, number, number, number];

export const ChromaName = 'Chroma';

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

/**
 * Chroma interface for Environment Enhancement.
 *
 *     _id: string,
 *     _lookupMethod: LookupMethod,
 *     _track?: string,
 *     _duplicate?: int,
 *     _active?: boolean,
 *     _scale?: [float, float, float],
 *     _position?: [float, float, float],
 *     _localPosition?: [float, float, float],
 *     _rotation?: [float, float, float],
 *     _localRotation?: [float, float, float],
 *     _lightID?: int
 */
export interface ChromaEnvironment {
    _id: string;
    _lookupMethod: LookupMethod;
    _track?: string;
    _duplicate?: number;
    _active?: boolean;
    _scale?: Array3DPoint;
    _position?: Array3DPoint;
    _localPosition?: Array3DPoint;
    _rotation?: Array3DPoint;
    _localRotation?: Array3DPoint;
    _lightID?: number;
}

/**
 * Chroma interface for Difficulty Info Custom Data.
 *
 *     _environmentalRemoval?: string[]
 */
export interface ChromaEnvironmentOld {
    _environmentalRemoval?: string[];
}

/**
 * Chroma interface for Beatmap Note Custom Data.
 *
 *     _color?: [float, float, float, float?],
 *     _disableSpawnEffect?: boolean
 */
export interface ChromaNote {
    _color?: ArrayColor;
    _disableSpawnEffect?: boolean;
}

/**
 * Chroma interface for Beatmap Obstacle Custom Data.
 *
 *     _color?: [float, float, float, float?]
 */
export interface ChromaObstacle {
    _color?: ArrayColor;
}

/**
 * Chroma interface for Beatmap Event Light Custom Data.
 *
 *     _color?: [float, float, float, float?],
 *     _lightID?: int | int[],
 *     _propID?: int,
 *     _lightGradient?: {
 *         _duration: float,
 *         _startColor?: [float, float, float, float?],
 *         _endColor?: [float, float, float, float?],
 *         _easing?: Easings
 *     },
 *     _lerpType?: 'HSV' | 'RGB',
 *     _easing?: Easings
 */
export interface ChromaEventLight {
    _color?: ArrayColor;
    _lightID?: number | number[];
    _propID?: number;
    _lightGradient?: {
        _duration: number;
        _startColor: ArrayColor;
        _endColor: ArrayColor;
        _easing?: Easings;
    };
    _lerpType?: 'HSV' | 'RGB';
    _easing?: Easings;
}

/**
 * Chroma interface for Beatmap Event Laser Rotation Custom Data.
 *
 *     _lockPosition?: boolean,
 *     _speed?: float,
 *     _preciseSpeed?: float,
 *     _direction?: int
 */
export interface ChromaEventLaser {
    _lockPosition?: boolean;
    _speed?: number;
    _preciseSpeed?: number;
    _direction?: number;
}

/**
 * Chroma interface for Beatmap Event Ring Spin Custom Data.
 *
 *     _nameFilter?: string,
 *     _reset?: boolean,
 *     _rotation?: float,
 *     _step?: float,
 *     _prop?: float,
 *     _speed?: float,
 *     _direction?: int,
 *     _counterSpin?: boolean,
 *     _stepMult?: float,
 *     _propMult?: float,
 *     _speedMult?: float
 */
export interface ChromaEventRotation {
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

/**
 * Chroma interface for Beatmap Event Ring Zoom Custom Data.
 *
 *     _step?: float,
 *     _speed?: float,
 */
export interface ChromaEventZoom {
    _step?: number;
    _speed?: number;
}

export type ChromaEvent = ChromaEventLaser &
    ChromaEventLight &
    ChromaEventRotation &
    ChromaEventZoom;

/**
 * AssignFogTrack interface for Noodle Extensions Custom Event.
 *
 *     _attenuation: float | Array2DPointDefinition[];
 *     _offset: float | Array2DPointDefinition[];
 *     _startY: float | Array2DPointDefinition[];
 *     _height: float | Array2DPointDefinition[];
 */
export interface ChromaCustomEventDataAssignFogTrack extends HeckCustomEventDataBase {
    _attenuation?: number | Array2DPointDefinition[];
    _offset?: number | Array2DPointDefinition[];
    _startY?: number | Array2DPointDefinition[];
    _height?: number | Array2DPointDefinition[];
}

/**
 * Chroma Custom Event interface for AssignFogTrack.
 *
 *     _time: float,
 *     _type: 'AssignFogTrack',
 *     _data: NECustomEventDataAssignFogTrack
 */
export interface ChromaCustomEventAssignFogTrack {
    _time: number;
    _type: 'AssignFogTrack';
    _data: ChromaCustomEventDataAssignFogTrack;
}

export type ChromaCustomEvent = ChromaCustomEventAssignFogTrack;

/**
 * Chroma Custom Data interface for difficulty custom data.
 *
 *     _track: string,
 */
export interface ChromaCustomData {
    _customEvents?: ChromaCustomEvent[];
    _environment?: ChromaEnvironment[];
}
