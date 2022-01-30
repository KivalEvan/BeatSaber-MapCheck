import { Easings } from './easings';
export type Array2DPoint = [number, number];
export type Array3DPoint = [number, number, number];
export type ArrayColorPointDefinition = [
    number,
    number,
    number,
    number,
    number,
    Easings?
];
export type ArrayPercentPointDefinition = [number, number, Easings?];
export type Array2DPointDefinition =
    | [number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, 'splineCatmullRom'?];
export type Array3DPointDefinition =
    | [number, number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, number, 'splineCatmullRom'?];
export type ArrayPointDefinition =
    | Array2DPointDefinition[]
    | Array3DPointDefinition[]
    | ArrayColorPointDefinition[];

export const HeckName = 'Heck';

/**
 * Heck interface for difficulty info custom data.
 *
 * Honestly just look at heck wiki for this, it's too many.
 */
export interface HeckInfoCustomData {
    _playerOptions?: {
        _leftHanded?: boolean;
        _playerHeight?: number;
        _automaticPlayerHeight?: boolean;
        _sfxVolume?: number;
        _reduceDebris?: boolean;
        _noTextsAndHuds?: boolean;
        _noFailEffects?: boolean;
        _advancedHud?: boolean;
        _autoRestart?: boolean;
        _saberTrailIntensity?: number;
        _noteJumpStartBeatOffset?: number;
        _hideNoteSpawnEffect?: boolean;
        _adaptiveSfx?: number;
        _environmentEffectsFilterDefaultPreset?:
            | 'AllEffects'
            | 'Strobefilter'
            | 'NoEffects';
        _environmentEffectsFilterExpertPlusPreset?:
            | 'AllEffects'
            | 'Strobefilter'
            | 'NoEffects';
    };
    _modifiers?: {
        _energyType?: 'Bar' | 'Battery';
        _noFailOn0Energy?: boolean;
        _instaFail?: boolean;
        _failOnSaberClash?: boolean;
        _enabledObstacleType?: 'All' | 'FullHeightOnly' | 'NoObstacles';
        _fastNotes?: boolean;
        _strictAngles?: boolean;
        _disappearingArrows?: boolean;
        _ghostNotes?: boolean;
        _noBombs?: boolean;
        _songSpeed?: 'Normal' | 'Faster' | 'Slower' | 'SuperFast';
        _noArrows?: boolean;
        _proMode?: boolean;
        _zenMode?: boolean;
        _smallCubes?: boolean;
    };

    _environments?: {
        _overrideEnvironments?: boolean;
    };
    _colors?: {
        _overrideDefaultColors?: boolean;
    };
    _graphics?: {
        _mirrorGraphicsSettings?: 0 | 1 | 2 | 3;
        _mainEffectGraphicsSettings?: 0 | 1;
        _smokeGraphicsSettings?: 0 | 1;
        _burnMarkTrailsEnabled?: boolean;
        _screenDisplacementEffectsEnabled?: boolean;
        _maxShockwaveParticles?: 0 | 1 | 2;
    };
    _chroma?: {
        _disableChromaEvents?: boolean;
        _disableEnvironmentEnhancements?: boolean;
        _forceZenModeWall?: boolean;
    };
}

/**
 * Heck Base Custom Event interface.
 *
 *     _track: string,
 */
export interface HeckCustomEventDataBase {
    _track: string;
}

/**
 * AnimateTrack interface for Heck Custom Event.
 *
 *     _duration: float,
 *     _easing?: Easings,
 *     _position?: string | Array3DPointDefinition[],
 *     _rotation?: string | Array3DPointDefinition[],
 *     _localRotation?: string | Array3DPointDefinition[],
 *     _scale?: string | Array3DPointDefinition[],
 *     _dissolve?: string | ArrayPercentPointDefinition[],
 *     _dissolveArrow?: string | ArrayPercentPointDefinition[],
 *     _color?: string | ArrayColorPointDefinition[],
 *     _interactable?: string | ArrayPercentPointDefinition[],
 *     _time?: string | ArrayPercentPointDefinition[]
 *
 * @extends HeckCustomEventDataBase
 */
export interface HeckCustomEventDataAnimateTrack extends HeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _time?: string | ArrayPercentPointDefinition[];
}

/**
 * AssignPathAnimation interface for Heck Custom Event.
 *
 *     _duration: float,
 *     _easing?: Easings,
 *     _position?: string | Array3DPointDefinition[],
 *     _rotation?: string | Array3DPointDefinition[],
 *     _localRotation?: string | Array3DPointDefinition[],
 *     _scale?: string | Array3DPointDefinition[],
 *     _dissolve?: string | ArrayPercentPointDefinition[],
 *     _dissolveArrow?: string | ArrayPercentPointDefinition[],
 *     _color?: string | ArrayColorPointDefinition[],
 *     _interactable?: string | ArrayPercentPointDefinition[],
 *     _definitePosition?: string | Array3DPointDefinition[]
 *
 * @extends HeckCustomEventDataBase
 */
export interface HeckCustomEventDataAssignPathAnimation
    extends HeckCustomEventDataBase {
    _duration: number;
    _easing?: Easings;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _definitePosition?: string | Array3DPointDefinition[];
}

/**
 * Heck Custom Event interface for AnimateTrack.
 *
 *     _time: float,
 *     _type: 'AnimateTrack',
 *     _data: NECustomEventDataAnimateTrack
 */
export interface HeckCustomEventAnimateTrack {
    _time: number;
    _type: 'AnimateTrack';
    _data: HeckCustomEventDataAnimateTrack;
}

/**
 * Heck Custom Event interface for AssignPathAnimation.
 *
 *     _time: float,
 *     _type: 'AssignPathAnimation',
 *     _data: NECustomEventDataAssignPathAnimation
 */
export interface HeckCustomEventAssignPathAnimation {
    _time: number;
    _type: 'AssignPathAnimation';
    _data: HeckCustomEventDataAssignPathAnimation;
}

export type HeckCustomEvent =
    | HeckCustomEventAnimateTrack
    | HeckCustomEventAssignPathAnimation;

/**
 * Heck Point Definition interface.
 *
 *     _name: string,
 *     _points: ArrayPointDefinition[];
 */
export interface HeckPointDefinition {
    _name: string;
    _points: ArrayPointDefinition[];
}

/**
 * Heck Custom Data interface for difficulty custom data.
 *
 *     _track: string,
 */
export interface HeckCustomData {
    _customEvents?: HeckCustomEvent[];
    _pointDefinitions?: HeckPointDefinition[];
}
