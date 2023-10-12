import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords';
import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { IChain } from '../../types/beatmap/v3/chain';
import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { IObstacle } from '../../types/beatmap/v3/obstacle';
import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent';
import { IArc } from '../../types/beatmap/v3/arc';
import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { IFxEventsCollection } from '../../types/beatmap/v3/fxEventsCollection';
import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';
import { IFxEventInt } from '../../types/beatmap/v3/fxEventInt';

// FIXME: ALMOST EVERYTHING HERE IS IFUCKIN OPTIONAL REE
export const ColorNoteDataCheck: { readonly [key in keyof IColorNote]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const BombDataCheck: { readonly [key in keyof IBombNote]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ArcDataCheck: { readonly [key in keyof IArc]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   mu: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   tb: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   tx: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   ty: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   tc: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   tmu: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   m: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ChainDataCheck: { readonly [key in keyof IChain]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   tb: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   tx: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   ty: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   sc: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ObstacleDataCheck: { readonly [key in keyof IObstacle]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   w: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   h: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const BasicEventDataCheck: { readonly [key in keyof IBasicEvent]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   et: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const BPMChangeEventDataCheck: { readonly [key in keyof IBPMEvent]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   m: {
      type: 'number',
      version: '3.0.0',
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const RotationEventDataCheck: {
   readonly [key in keyof IRotationEvent]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ColorBoostEventDataCheck: {
   readonly [key in keyof IColorBoostEvent]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   o: {
      type: 'boolean',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const IndexFilterDataCheck: { readonly [key in keyof IIndexFilter]: DataCheck } = {
   f: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   p: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '3.1.0',
      optional: true,
   },
   l: {
      type: 'number',
      version: '3.1.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.1.0',
      optional: true,
   },
   n: {
      type: 'number',
      int: true,
      version: '3.1.0',
      optional: true,
   },
   s: {
      type: 'number',
      int: true,
      version: '3.1.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightColorBaseDataCheck: {
   readonly [key in keyof ILightColorBase]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightColorEventBoxDataCheck: {
   readonly [key in keyof ILightColorEventBox]: DataCheck;
} = {
   f: {
      type: 'object',
      version: '3.0.0',
      check: IndexFilterDataCheck,
      optional: true,
   },
   w: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'array',
      version: '3.0.0',
      check: LightColorBaseDataCheck,
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightColorEventBoxGroupDataCheck: {
   readonly [key in keyof ILightColorEventBoxGroup]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   g: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'array',
      version: '3.0.0',
      check: LightColorEventBoxDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightRotationBaseDataCheck: {
   readonly [key in keyof ILightRotationBase]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   p: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   l: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   o: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightRotationEventBoxDataCheck: {
   readonly [key in keyof ILightRotationEventBox]: DataCheck;
} = {
   f: {
      type: 'object',
      version: '3.0.0',
      check: IndexFilterDataCheck,
      optional: true,
   },
   w: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   l: {
      type: 'array',
      version: '3.0.0',
      check: LightRotationBaseDataCheck,
      optional: true,
   },
   r: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightRotationEventBoxGroupDataCheck: {
   readonly [key in keyof ILightRotationEventBoxGroup]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   g: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'array',
      version: '3.0.0',
      check: LightRotationEventBoxDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightTranslationBaseDataCheck: {
   readonly [key in keyof ILightTranslationBase]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.2.0',
      optional: true,
   },
   p: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   t: {
      type: 'number',
      version: '3.2.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightTranslationEventBoxDataCheck: {
   readonly [key in keyof ILightTranslationEventBox]: DataCheck;
} = {
   f: {
      type: 'object',
      version: '3.2.0',
      check: IndexFilterDataCheck,
      optional: true,
   },
   w: {
      type: 'number',
      version: '3.2.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '3.2.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   l: {
      type: 'array',
      version: '3.2.0',
      check: LightTranslationBaseDataCheck,
      optional: true,
   },
   r: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightTranslationEventBoxGroupDataCheck: {
   readonly [key in keyof ILightTranslationEventBoxGroup]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.2.0',
      optional: true,
   },
   g: {
      type: 'number',
      int: true,
      version: '3.2.0',
      optional: true,
   },
   e: {
      type: 'array',
      version: '3.2.0',
      check: LightTranslationEventBoxDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.2.0',
      check: {},
      optional: true,
   },
} as const;

export const VfxEventBoxDataCheck: {
   readonly [key in keyof IFxEventBox]: DataCheck;
} = {
   f: {
      type: 'object',
      version: '3.3.0',
      check: IndexFilterDataCheck,
      optional: true,
   },
   w: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   l: {
      type: 'number',
      int: true,
      array: true,
      version: '3.3.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const VfxEventBoxGroupDataCheck: {
   readonly [key in keyof IFxEventBoxGroup]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   g: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   e: {
      type: 'array',
      version: '3.3.0',
      check: VfxEventBoxDataCheck,
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.3.0',
      check: {},
      optional: true,
   },
} as const;

export const BasicEventTypesForKeywordsDataCheck: {
   readonly [key in keyof IBasicEventTypesForKeywords]: DataCheck;
} = {
   k: {
      type: 'string',
      version: '3.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      array: true,
      version: '3.0.0',
      optional: true,
   },
} as const;

export const BasicEventTypesWithKeywordsDataCheck: {
   readonly [key in keyof IBasicEventTypesWithKeywords]: DataCheck;
} = {
   d: {
      type: 'array',
      version: '3.0.0',
      check: BasicEventTypesForKeywordsDataCheck,
      optional: true,
   },
} as const;

export const FxEventFloatDataCheck: {
   readonly [key in keyof IFxEventFloat]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   p: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   v: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.3.0',
      check: {},
      optional: true,
   },
} as const;

export const FxEventIntDataCheck: {
   readonly [key in keyof IFxEventInt]: DataCheck;
} = {
   b: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   p: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   v: {
      type: 'number',
      int: true,
      version: '3.3.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.3.0',
      check: {},
      optional: true,
   },
} as const;

export const FxEventsCollectionDataCheck: {
   readonly [key in keyof IFxEventsCollection]: DataCheck;
} = {
   _fl: {
      type: 'array',
      version: '3.3.0',
      check: FxEventFloatDataCheck,
      optional: true,
   },
   _il: {
      type: 'array',
      version: '3.3.0',
      check: FxEventIntDataCheck,
      optional: true,
   },
} as const;

export const WaypointDataCheck: { readonly [key in keyof IWaypoint]: DataCheck } = {
   b: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   x: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;

export const DifficultyCheck: { readonly [key in keyof IDifficulty]: DataCheck } = {
   version: {
      type: 'string',
      version: '3.0.0',
      optional: true,
   },
   bpmEvents: {
      type: 'array',
      version: '3.0.0',
      check: BPMChangeEventDataCheck,
      optional: true,
   },
   rotationEvents: {
      type: 'array',
      version: '3.0.0',
      check: RotationEventDataCheck,
      optional: true,
   },
   colorNotes: {
      type: 'array',
      version: '3.0.0',
      check: ColorNoteDataCheck,
      optional: true,
   },
   bombNotes: {
      type: 'array',
      version: '3.0.0',
      check: BombDataCheck,
      optional: true,
   },
   obstacles: {
      type: 'array',
      version: '3.0.0',
      check: ObstacleDataCheck,
      optional: true,
   },
   sliders: {
      type: 'array',
      version: '3.0.0',
      check: ArcDataCheck,
      optional: true,
   },
   burstSliders: {
      type: 'array',
      version: '3.0.0',
      check: ChainDataCheck,
      optional: true,
   },
   waypoints: {
      type: 'array',
      version: '3.0.0',
      check: WaypointDataCheck,
      optional: true,
   },
   basicBeatmapEvents: {
      type: 'array',
      version: '3.0.0',
      check: BasicEventDataCheck,
      optional: true,
   },
   colorBoostBeatmapEvents: {
      type: 'array',
      version: '3.0.0',
      check: ColorBoostEventDataCheck,
      optional: true,
   },
   lightColorEventBoxGroups: {
      type: 'array',
      version: '3.0.0',
      check: LightColorEventBoxGroupDataCheck,
      optional: true,
   },
   lightRotationEventBoxGroups: {
      type: 'array',
      version: '3.0.0',
      check: LightRotationEventBoxGroupDataCheck,
      optional: true,
   },
   lightTranslationEventBoxGroups: {
      type: 'array',
      version: '3.2.0',
      check: LightTranslationEventBoxGroupDataCheck,
      optional: true,
   },
   vfxEventBoxGroups: {
      type: 'array',
      version: '3.3.0',
      check: VfxEventBoxGroupDataCheck,
      optional: true,
   },
   basicEventTypesWithKeywords: {
      type: 'object',
      version: '3.0.0',
      check: BasicEventTypesWithKeywordsDataCheck,
      optional: true,
   },
   _fxEventsCollection: {
      type: 'object',
      version: '3.3.0',
      check: FxEventsCollectionDataCheck,
      optional: true,
   },
   useNormalEventsAsCompatibleEvents: {
      type: 'boolean',
      version: '3.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;
