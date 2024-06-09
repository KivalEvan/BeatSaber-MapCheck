import type { IDataCheck } from '../../../types/beatmap/shared/dataCheck.ts';
import type { IBasicEvent } from '../../../types/beatmap/v3/basicEvent.ts';
import type { IBasicEventTypesForKeywords } from '../../../types/beatmap/v3/basicEventTypesForKeywords.ts';
import type { IBasicEventTypesWithKeywords } from '../../../types/beatmap/v3/basicEventTypesWithKeywords.ts';
import type { IBombNote } from '../../../types/beatmap/v3/bombNote.ts';
import type { IBPMEvent } from '../../../types/beatmap/v3/bpmEvent.ts';
import type { IChain } from '../../../types/beatmap/v3/chain.ts';
import type { IColorBoostEvent } from '../../../types/beatmap/v3/colorBoostEvent.ts';
import type { IColorNote } from '../../../types/beatmap/v3/colorNote.ts';
import type { IDifficulty } from '../../../types/beatmap/v3/difficulty.ts';
import type { IIndexFilter } from '../../../types/beatmap/v3/indexFilter.ts';
import type { ILightColorEvent } from '../../../types/beatmap/v3/lightColorEvent.ts';
import type { ILightColorEventBox } from '../../../types/beatmap/v3/lightColorEventBox.ts';
import type { ILightColorEventBoxGroup } from '../../../types/beatmap/v3/lightColorEventBoxGroup.ts';
import type { ILightRotationEvent } from '../../../types/beatmap/v3/lightRotationEvent.ts';
import type { ILightRotationEventBox } from '../../../types/beatmap/v3/lightRotationEventBox.ts';
import type { ILightRotationEventBoxGroup } from '../../../types/beatmap/v3/lightRotationEventBoxGroup.ts';
import type { ILightshow } from '../../../types/beatmap/v3/lightshow.ts';
import type { ILightTranslationEvent } from '../../../types/beatmap/v3/lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from '../../../types/beatmap/v3/lightTranslationEventBox.ts';
import type { ILightTranslationEventBoxGroup } from '../../../types/beatmap/v3/lightTranslationEventBoxGroup.ts';
import type { IObstacle } from '../../../types/beatmap/v3/obstacle.ts';
import type { IRotationEvent } from '../../../types/beatmap/v3/rotationEvent.ts';
import type { IArc } from '../../../types/beatmap/v3/arc.ts';
import type { IWaypoint } from '../../../types/beatmap/v3/waypoint.ts';
import type { IFxEventBox } from '../../../types/beatmap/v3/fxEventBox.ts';
import type { IFxEventBoxGroup } from '../../../types/beatmap/v3/fxEventBoxGroup.ts';
import type { IFxEventsCollection } from '../../../types/beatmap/v3/fxEventsCollection.ts';
import type { IFxEventFloat } from '../../../types/beatmap/v3/fxEventFloat.ts';
import type { IFxEventInt } from '../../../types/beatmap/v3/fxEventInt.ts';

export const ColorNoteDataCheck: {
   readonly [key in keyof IColorNote]: IDataCheck;
} = {
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

export const BombDataCheck: { readonly [key in keyof IBombNote]: IDataCheck } = {
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

export const ArcDataCheck: { readonly [key in keyof IArc]: IDataCheck } = {
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

export const ChainDataCheck: { readonly [key in keyof IChain]: IDataCheck } = {
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

export const ObstacleDataCheck: {
   readonly [key in keyof IObstacle]: IDataCheck;
} = {
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

export const BasicEventDataCheck: {
   readonly [key in keyof IBasicEvent]: IDataCheck;
} = {
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

export const BPMChangeEventDataCheck: {
   readonly [key in keyof IBPMEvent]: IDataCheck;
} = {
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
   readonly [key in keyof IRotationEvent]: IDataCheck;
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
   readonly [key in keyof IColorBoostEvent]: IDataCheck;
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

export const IndexFilterDataCheck: {
   readonly [key in keyof IIndexFilter]: IDataCheck;
} = {
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
   readonly [key in keyof ILightColorEvent]: IDataCheck;
} = {
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
   f: {
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
   s: {
      type: 'number',
      version: '3.0.0',
      optional: true,
   },
   sb: {
      type: 'number',
      version: '3.3.0',
      optional: true,
   },
   sf: {
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

export const LightColorEventBoxDataCheck: {
   readonly [key in keyof ILightColorEventBox]: IDataCheck;
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
   readonly [key in keyof ILightColorEventBoxGroup]: IDataCheck;
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
   readonly [key in keyof ILightRotationEvent]: IDataCheck;
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
   readonly [key in keyof ILightRotationEventBox]: IDataCheck;
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
   readonly [key in keyof ILightRotationEventBoxGroup]: IDataCheck;
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
   readonly [key in keyof ILightTranslationEvent]: IDataCheck;
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
   readonly [key in keyof ILightTranslationEventBox]: IDataCheck;
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
   readonly [key in keyof ILightTranslationEventBoxGroup]: IDataCheck;
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
   readonly [key in keyof IFxEventBox]: IDataCheck;
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
   readonly [key in keyof IFxEventBoxGroup]: IDataCheck;
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
   readonly [key in keyof IBasicEventTypesForKeywords]: IDataCheck;
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
   readonly [key in keyof IBasicEventTypesWithKeywords]: IDataCheck;
} = {
   d: {
      type: 'array',
      version: '3.0.0',
      check: BasicEventTypesForKeywordsDataCheck,
      optional: true,
   },
} as const;

export const FxEventFloatDataCheck: {
   readonly [key in keyof IFxEventFloat]: IDataCheck;
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
   readonly [key in keyof IFxEventInt]: IDataCheck;
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
   readonly [key in keyof IFxEventsCollection]: IDataCheck;
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

export const WaypointDataCheck: {
   readonly [key in keyof IWaypoint]: IDataCheck;
} = {
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

export const DifficultyDataCheck: {
   readonly [key in keyof IDifficulty]: IDataCheck;
} = {
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

export const LightshowDataCheck: {
   readonly [key in keyof ILightshow]: IDataCheck;
} = {
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
   _fxEventsCollection: {
      type: 'object',
      version: '3.3.0',
      check: FxEventsCollectionDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '3.0.0',
      check: {},
      optional: true,
   },
} as const;
