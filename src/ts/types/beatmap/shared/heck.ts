import { Easings } from '../shared/easings';
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type ColorPointDefinition = [number, number, number, number, number, Easings?];
export type PercentPointDefinition = [number, number, Easings?];
export type Vector2PointDefinition =
    | [number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, 'splineCatmullRom'?];
export type Vector3PointDefinition =
    | [number, number, number, number, Easings?, 'splineCatmullRom'?]
    | [number, number, number, number, 'splineCatmullRom'?];
export type PointDefinition =
    | Vector2PointDefinition[]
    | Vector3PointDefinition[]
    | ColorPointDefinition[];

export const heckName = 'Heck';

/** Heck interface for difficulty info custom data.
 * Honestly, just look at heck wiki for this, it's too many.
 */
export interface IHeckInfoCustomData {
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
    _noteJumpDurationTypeSettings?: {
        _noteJumpFixedDuration?: number;
    };
}
