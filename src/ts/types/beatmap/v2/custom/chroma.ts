import type { FloatPointDefinition, Vector4PointDefinition } from '../../shared/custom/heck.ts';
import type { Easings } from '../../../easings.ts';
import type { ColorArray } from '../../../colors.ts';
import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type {
   EnvironmentMaterial,
   GeometryType,
   LookupMethod,
   ShaderKeywords,
   ShaderType,
} from '../../shared/custom/chroma.ts';
import type { IHeckBase, IInfoSettingsCustomData } from './heck.ts';
import type { LooseAutocomplete } from '../../../utils.ts';
import type { Vector2, Vector3 } from '../../../vector.ts';

/** Chroma Material interface for Environment Enhancement. */
export interface IChromaMaterial {
   _shader: LooseAutocomplete<ShaderType | EnvironmentMaterial>;
   /** Overrides default shader keywords. */
   _shaderKeywords?: LooseAutocomplete<ShaderKeywords>[];
   _collision?: boolean;
   _track?: string;
   _color?: ColorArray;
}

/** Chroma Geometry interface for Environment Enhancement. */
export interface IChromaGeometryBase {
   _type: GeometryType;
   _material: IChromaMaterial | string;
   _collision?: boolean;
}

/** Chroma Geometry Custom interface for Environment Enhancement. */
export interface IChromaGeometryCustom {
   _type: 'CUSTOM';
   _mesh: {
      _vertices: Vector3[];
      _uv?: Vector2[];
      _triangles?: number[];
   };
   _material: IChromaMaterial | string;
   _collision?: boolean;
}

export type IChromaGeometry = IChromaGeometryBase | IChromaGeometryCustom;

/** Chroma interface for Environment Enhancement Base. */
export interface IChromaEnvironmentBase {
   /**
    * Look up environment object name.
    *
    * This grabs every environment objects that match the string.
    * ```ts
    * **id:** 'Environment.[0]GlowLine' // Non-regex
    * **id:** 'Environment\.\\[\\d+\\]GlowLine$' // Regex
    * ```
    */
   _id?: unknown;
   /**
    * Look-up method to grab the object name.
    *
    * Regex is considered an advanced method and more powerful than other methods.
    */
   _lookupMethod?: unknown;
   _geometry?: unknown;
   /** Assign track to the object for animation use. */
   _track?: string;
   /**
    * Duplicate the object by set amount.
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

/**
 * Chroma interface for Environment Enhancement ID.
 *
 * @extends IChromaEnvironmentBase
 */
export interface IChromaEnvironmentID extends IChromaEnvironmentBase {
   _id: string;
   _lookupMethod: LookupMethod;
   _geometry?: never;
}

/**
 * Chroma interface for Environment Enhancement Geometry.
 *
 * @extends IChromaEnvironmentBase
 */
export interface IChromaEnvironmentGeometry extends IChromaEnvironmentBase {
   _id?: never;
   _lookupMethod?: never;
   _geometry: IChromaGeometry;
}

/** Chroma interface for Environment Enhancement. */
export type IChromaEnvironment = IChromaEnvironmentID | IChromaEnvironmentGeometry;

/** Chroma interface for Beatmap Object Animation Custom Data. */
export interface IChromaAnimation {
   _color?: string | ColorArray | Vector4PointDefinition[];
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

export interface IChromaLightGradient {
   _duration: number;
   _startColor: ColorArray;
   _endColor: ColorArray;
   _easing?: Easings;
}

/** Chroma interface for Beatmap Event Light Custom Data. */
export interface IChromaEventLight extends ICustomDataBase {
   _color?: ColorArray;
   _lightID?: number | number[];
   _propID?: number;
   _lightGradient?: IChromaLightGradient;
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

/** AnimateComponent interface for Chroma Custom Event. */
export interface IChromaCustomEventDataAnimateTrack extends Required<IHeckBase> {
   _color?: string | ColorArray | Vector4PointDefinition[];
}

/** AnimateComponent interface for Chroma Custom Event. */
export interface IChromaCustomEventDataAssignPathAnimation extends Required<IHeckBase> {
   _color?: string | ColorArray | Vector4PointDefinition[];
}

/** AssignFogTrack interface for Chroma Custom Event. */
export interface IChromaCustomEventDataAssignFogTrack extends Required<IHeckBase> {
   _duration: number;
   _attenuation?: string | [number] | FloatPointDefinition[];
   _offset?: string | [number] | FloatPointDefinition[];
   _startY?: string | [number] | FloatPointDefinition[];
   _height?: string | [number] | FloatPointDefinition[];
}

/** Chroma Custom Data interface for difficulty custom data. */
export interface IChromaCustomData {
   _environment?: IChromaEnvironment[];
   _materials?: Record<string, IChromaMaterial>;
}

/** Chroma interface for Difficulty Info Custom Data. */
export interface IChromaInfoCustomData extends IInfoSettingsCustomData {
   _settings?: {
      _chroma?: {
         _disableChromaEvents?: boolean;
         _disableEnvironmentEnhancements?: boolean;
         _disableNoteColoring?: boolean;
         _forceZenModeWall?: boolean;
      };
   };
   _environmentalRemoval?: string[];
}
