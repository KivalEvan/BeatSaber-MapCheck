import { PercentPointDefinition, Vector3 } from '../shared/heck';
import { Easings } from '../../easings';
import { ColorArray } from '../../colors';
import { ICustomDataBase } from '../shared/customData';
import {
    ColorPointDefinition,
    GeometryType,
    LookupMethod,
    ShaderKeywordsOpaque,
    ShaderKeywordsStandard,
    ShaderKeywordsTransparent,
    ShaderType,
} from '../shared/chroma';
import { IHeckCustomEventDataBase } from './heck';

export enum ChromaDataEnvAbbr {
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

/** Chroma Material Base interface for Environment Enhancement. */
export interface IChromaMaterialBase {
    _shaderPreset: ShaderType;
    _shaderKeywords?: string[];
    _track?: string[];
    _color?: ColorArray;
}

/** Chroma Material Standard interface for Environment Enhancement.
 * @extends IChromaMaterialBase
 */
export interface IChromaMaterialStandard extends IChromaMaterialBase {
    _shaderPreset: 'STANDARD';
    _shaderKeywords?: ShaderKeywordsStandard[];
}

/** Chroma Material Opaque interface for Environment Enhancement.
 * @extends IChromaMaterialBase
 */
export interface IChromaMaterialOpaque extends IChromaMaterialBase {
    _shaderPreset: 'NO_SHADE';
    _shaderKeywords?: ShaderKeywordsOpaque[];
}

/** Chroma Material Transparent interface for Environment Enhancement.
 * @extends IChromaMaterialBase
 */
export interface IChromaMaterialTransparent extends IChromaMaterialBase {
    _shaderPreset: 'LIGHT_BOX';
    _shaderKeywords?: ShaderKeywordsTransparent[];
}

/** Chroma Material interface for Environment Enhancement. */
export type IChromaMaterial = IChromaMaterialStandard | IChromaMaterialOpaque | IChromaMaterialTransparent;

/** Chroma Geometry interface for Environment Enhancement. */
export interface IChromaGeometry {
    _type: GeometryType;
    _material: IChromaMaterial | string;
    _spawnCount: number;
    _track?: string[];
    _collision?: boolean;
    _color?: ColorArray;
}

/** Chroma interface for Environment Enhancement Base. */
export interface IChromaEnvironmentBase {
    /** Look up environment object name.
     *
     * This grabs every environment objects that match the string.
     * ```ts
     * id: 'Environment.[0]GlowLine' || 'Environment\.\\[\\d+\\]GlowLine$' // Regex example
     * ```
     */
    _id?: unknown;
    /** Look-up method to grab the object name.
     *
     * Regex is considered an advanced method and more powerful than other methods.
     */
    _lookupMethod?: unknown;
    _geometry?: unknown;
    /** Assign track to the object for animation use. */
    _track?: string;
    /** Duplicate the object by set amount.
     *
     * **WARNING:** You should always duplicate only one at a time unless you know what you are doing.
     */
    _duplicate?: number;
    _active?: boolean;
    _scale?: Vector3;
    _position?: Vector3;
    _rotation?: Vector3;
    _localPosition?: Vector3;
    _localRotation?: Vector3;
    /** Assign light ID for duplicated object. */
    _lightID?: number;
}

/** Chroma interface for Environment Enhancement ID.
 *
 * @extends IChromaEnvironmentBase
 */
export interface IChromaEnvironmentID extends IChromaEnvironmentBase {
    _id: string;
    _lookupMethod: LookupMethod;
    _geometry?: never;
}

/** Chroma interface for Environment Enhancement Geometry.
 *
 * @extends IChromaEnvironmentBase
 */
export interface IChromaEnvironmentGeometry extends IChromaEnvironmentBase {
    _id?: never;
    _lookupMethod?: never;
    _geometry: IChromaGeometry[];
}

/** Chroma interface for Environment Enhancement. */
export type IChromaEnvironment = IChromaEnvironmentID | IChromaEnvironmentGeometry;

/** Chroma interface for Beatmap Note Custom Data. */
export interface IChromaAnimation {
    _color?: string | ColorPointDefinition[];
}

/** Chroma interface for Beatmap Note Custom Data. */
export interface IChromaNote {
    _color?: ColorArray;
    _disableSpawnEffect?: boolean;
}

/** Chroma interface for Beatmap Obstacle Custom Data. */
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
    _materials?: { [key: string]: IChromaMaterial };
}
