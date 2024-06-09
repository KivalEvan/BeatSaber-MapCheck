import type { Easings } from '../../../easings.ts';
import type { Vector3 } from '../../../vector.ts';
import type { Vector3PointDefinition } from '../../shared/custom/heck.ts';

/** Heck Base Custom Event interface. */
export interface IHeckBase {
   _track?: string | string[];
}

/**
 * AnimateTrack interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAnimateTrack extends Required<IHeckBase> {
   _duration?: number;
   _easing?: Easings;
   _position?: string | Vector3 | Vector3PointDefinition[];
   _rotation?: string | Vector3 | Vector3PointDefinition[];
   _localRotation?: string | Vector3 | Vector3PointDefinition[];
   _scale?: string | Vector3 | Vector3PointDefinition[];
}

/**
 * AssignPathAnimation interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAssignPathAnimation extends Required<IHeckBase> {
   _easing?: Easings;
   _position?: string | Vector3 | Vector3PointDefinition[];
   _rotation?: string | Vector3 | Vector3PointDefinition[];
   _localRotation?: string | Vector3 | Vector3PointDefinition[];
   _scale?: string | Vector3 | Vector3PointDefinition[];
}

export interface IInfoSettingsCustomData {
   _settings?: {
      [key: string]: { [key: string]: boolean | string | number | undefined } | undefined;
   };
}
/**
 * Heck interface for difficulty info custom data.
 * Honestly, just look at heck wiki for this, it's too many.
 */
export interface IHeckInfoCustomData extends IInfoSettingsCustomData {
   _settings?: {
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
         _noteJumpDurationTypeSettings?: 'Dynamic' | 'Static';
         _noteJumpFixedDuration?: number;
         _noteJumpStartBeatOffset?: number;
         _hideNoteSpawnEffect?: boolean;
         _adaptiveSfx?: number;
         _environmentEffectsFilterDefaultPreset?: 'AllEffects' | 'Strobefilter' | 'NoEffects';
         _environmentEffectsFilterExpertPlusPreset?: 'AllEffects' | 'Strobefilter' | 'NoEffects';
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
   };
}
