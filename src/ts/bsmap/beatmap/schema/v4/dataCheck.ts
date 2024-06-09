import type { IDataCheck } from '../../../types/beatmap/shared/dataCheck.ts';
import type { IArc } from '../../../types/beatmap/v4/arc.ts';
import type { IAudio, IAudioBPM, IAudioLUFS } from '../../../types/beatmap/v4/audioData.ts';
import type { IBasicEvent } from '../../../types/beatmap/v4/basicEvent.ts';
import type { IBombNote } from '../../../types/beatmap/v4/bombNote.ts';
import type { IChain } from '../../../types/beatmap/v4/chain.ts';
import type { IColorBoostEvent } from '../../../types/beatmap/v4/colorBoostEvent.ts';
import type { IColorNote } from '../../../types/beatmap/v4/colorNote.ts';
import type { IDifficulty } from '../../../types/beatmap/v4/difficulty.ts';
import type { IEventBox } from '../../../types/beatmap/v4/eventBox.ts';
import type { IEventBoxGroup } from '../../../types/beatmap/v4/eventBoxGroup.ts';
import type { IFxEventBox } from '../../../types/beatmap/v4/fxEventBox.ts';
import type { IFxEventFloat } from '../../../types/beatmap/v4/fxEventFloat.ts';
import type { IIndexFilter } from '../../../types/beatmap/v4/indexFilter.ts';
import type {
   IInfo,
   IInfoAudio,
   IInfoBeatmapAuthors,
   IInfoColorScheme,
   IInfoDifficulty,
   IInfoSong,
} from '../../../types/beatmap/v4/info.ts';
import type { ILightColorEvent } from '../../../types/beatmap/v4/lightColorEvent.ts';
import type { ILightColorEventBox } from '../../../types/beatmap/v4/lightColorEventBox.ts';
import type { ILightRotationEvent } from '../../../types/beatmap/v4/lightRotationEvent.ts';
import type { ILightRotationEventBox } from '../../../types/beatmap/v4/lightRotationEventBox.ts';
import type { ILightTranslationEvent } from '../../../types/beatmap/v4/lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from '../../../types/beatmap/v4/lightTranslationEventBox.ts';
import type { ILightshow } from '../../../types/beatmap/v4/lightshow.ts';
import type {
   IObject,
   IObjectArc,
   IObjectChain,
   IObjectLane,
} from '../../../types/beatmap/v4/object.ts';
import type { IObstacle } from '../../../types/beatmap/v4/obstacle.ts';
import type { ISpawnRotation } from '../../../types/beatmap/v4/spawnRotation.ts';
import type { IWaypoint } from '../../../types/beatmap/v4/waypoint.ts';
import { BasicEventTypesWithKeywordsDataCheck } from '../v3/dataCheck.ts';

export const ObjectDataCheck: { readonly [key in keyof IObject]: IDataCheck } = {
   b: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ObjectLaneDataCheck: {
   readonly [key in keyof IObjectLane]: IDataCheck;
} = {
   b: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ObjectChainDataCheck: {
   readonly [key in keyof IObjectChain]: IDataCheck;
} = {
   hb: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   hr: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   tb: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   tr: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   ci: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const ObjectArcDataCheck: {
   readonly [key in keyof IObjectArc]: IDataCheck;
} = {
   hb: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   hi: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   hr: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   tb: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   ti: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   tr: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   ai: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const ColorNoteDataCheck: {
   readonly [key in keyof IColorNote]: IDataCheck;
} = {
   x: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const BombNoteDataCheck: {
   readonly [key in keyof IBombNote]: IDataCheck;
} = {
   x: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const ObstacleDataCheck: {
   readonly [key in keyof IObstacle]: IDataCheck;
} = {
   x: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   w: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   h: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const ChainDataCheck: {
   readonly [key in keyof IChain]: IDataCheck;
} = {
   tx: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   ty: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const ArcDataCheck: {
   readonly [key in keyof IArc]: IDataCheck;
} = {
   m: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   tm: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
};

export const SpawnRotationDataCheck: {
   readonly [key in keyof ISpawnRotation]: IDataCheck;
} = {
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const DifficultyDataCheck: {
   readonly [key in keyof IDifficulty]: IDataCheck;
} = {
   version: {
      type: 'string',
      version: '4.0.0',
   },
   colorNotes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectLaneDataCheck,
      optional: true,
   },
   bombNotes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectLaneDataCheck,
      optional: true,
   },
   obstacles: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectLaneDataCheck,
      optional: true,
   },
   chains: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectChainDataCheck,
      optional: true,
   },
   arcs: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectArcDataCheck,
      optional: true,
   },
   spawnRotations: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectArcDataCheck,
      optional: true,
   },
   colorNotesData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ColorNoteDataCheck,
      optional: true,
   },
   bombNotesData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: BombNoteDataCheck,
      optional: true,
   },
   obstaclesData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObstacleDataCheck,
      optional: true,
   },
   chainsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ChainDataCheck,
      optional: true,
   },
   arcsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ArcDataCheck,
      optional: true,
   },
   spawnRotationsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: SpawnRotationDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const WaypointDataCheck: {
   readonly [key in keyof IWaypoint]: IDataCheck;
} = {
   x: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   y: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const BasicEventDataCheck: {
   readonly [key in keyof IBasicEvent]: IDataCheck;
} = {
   t: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   i: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ColorBoostEventDataCheck: {
   readonly [key in keyof IColorBoostEvent]: IDataCheck;
} = {
   b: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const EventBoxDataCheck: {
   readonly [key in keyof IEventBox]: IDataCheck;
} = {
   e: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   l: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const EventBoxGroupDataCheck: {
   readonly [key in keyof IEventBoxGroup]: IDataCheck;
} = {
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   g: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: EventBoxDataCheck,
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
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
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   p: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   n: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   l: {
      type: 'number',
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightColorEventBoxDataCheck: {
   readonly [key in keyof ILightColorEventBox]: IDataCheck;
} = {
   w: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightColorEventDataCheck: {
   readonly [key in keyof ILightColorEvent]: IDataCheck;
} = {
   p: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   c: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   sb: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   sf: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightRotationEventBoxDataCheck: {
   readonly [key in keyof ILightRotationEventBox]: IDataCheck;
} = {
   w: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightRotationEventDataCheck: {
   readonly [key in keyof ILightRotationEvent]: IDataCheck;
} = {
   p: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   l: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   r: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightTranslationEventBoxDataCheck: {
   readonly [key in keyof ILightTranslationEventBox]: IDataCheck;
} = {
   w: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   a: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   f: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightTranslationEventDataCheck: {
   readonly [key in keyof ILightTranslationEvent]: IDataCheck;
} = {
   p: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const FXEventBoxDataCheck: {
   readonly [key in keyof IFxEventBox]: IDataCheck;
} = {
   w: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   d: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   s: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   t: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   b: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const FXEventFloatDataCheck: {
   readonly [key in keyof IFxEventFloat]: IDataCheck;
} = {
   p: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   e: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   v: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const LightshowDataCheck: {
   readonly [key in keyof ILightshow]: IDataCheck;
} = {
   version: {
      type: 'string',
      version: '4.0.0',
   },
   waypoints: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectLaneDataCheck,
      optional: true,
   },
   waypointsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: WaypointDataCheck,
      optional: true,
   },
   basicEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectDataCheck,
      optional: true,
   },
   basicEventsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: BasicEventDataCheck,
      optional: true,
   },
   colorBoostEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ObjectDataCheck,
      optional: true,
   },
   colorBoostEventsData: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: ColorBoostEventDataCheck,
      optional: true,
   },
   eventBoxGroups: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: EventBoxGroupDataCheck,
      optional: true,
   },
   indexFilters: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: IndexFilterDataCheck,
      optional: true,
   },
   lightColorEventBoxes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightColorEventBoxDataCheck,
      optional: true,
   },
   lightColorEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightColorEventDataCheck,
      optional: true,
   },
   lightRotationEventBoxes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightRotationEventBoxDataCheck,
      optional: true,
   },
   lightRotationEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightRotationEventDataCheck,
      optional: true,
   },
   lightTranslationEventBoxes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightTranslationEventBoxDataCheck,
      optional: true,
   },
   lightTranslationEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: LightTranslationEventDataCheck,
      optional: true,
   },
   fxEventBoxes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: FXEventBoxDataCheck,
      optional: true,
   },
   floatFxEvents: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: FXEventFloatDataCheck,
      optional: true,
   },
   basicEventTypesWithKeywords: {
      type: 'object',
      version: '4.0.0',
      check: BasicEventTypesWithKeywordsDataCheck,
   },
   useNormalEventsAsCompatibleEvents: {
      type: 'boolean',
      version: '4.0.0',
      optional: true,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const InfoSongDataCheck: {
   readonly [key in keyof IInfoSong]: IDataCheck;
} = {
   title: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   subTitle: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   author: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
} as const;

export const InfoAudioDataCheck: {
   readonly [key in keyof IInfoAudio]: IDataCheck;
} = {
   songFilename: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   songDuration: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   audioDataFilename: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   bpm: {
      type: 'number',
      version: '4.0.0',
   },
   lufs: {
      type: 'number',
      version: '4.0.0',
   },
   previewStartTime: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   previewDuration: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
} as const;

export const InfoColorSchemeDataCheck: {
   readonly [key in keyof IInfoColorScheme]: IDataCheck;
} = {
   colorSchemeName: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   saberAColor: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   saberBColor: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   obstaclesColor: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColor0: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColor1: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColorW: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColor0Boost: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColor1Boost: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentColorWBoost: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
} as const;

export const InfoBeatmapAuthorsDataCheck: {
   readonly [key in keyof IInfoBeatmapAuthors]: IDataCheck;
} = {
   mappers: {
      type: 'string',
      array: true,
      version: '4.0.0',
   },
   lighters: {
      type: 'string',
      array: true,
      version: '4.0.0',
   },
} as const;

export const InfoDifficultyDataCheck: {
   readonly [key in keyof IInfoDifficulty]: IDataCheck;
} = {
   characteristic: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   difficulty: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   beatmapAuthors: {
      type: 'object',
      version: '4.0.0',
      check: InfoBeatmapAuthorsDataCheck,
   },
   environmentNameIdx: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '4.0.0',
      optional: true,
   },
   beatmapColorSchemeIdx: {
      type: 'number',
      int: true,
      version: '4.0.0',
      optional: true,
   },
   noteJumpMovementSpeed: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   noteJumpStartBeatOffset: {
      type: 'number',
      version: '4.0.0',
      optional: true,
   },
   lightshowDataFilename: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   beatmapDataFilename: {
      type: 'string',
      version: '4.0.0',
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const InfoDataCheck: { readonly [key in keyof IInfo]: IDataCheck } = {
   version: {
      type: 'string',
      version: '4.0.0',
   },
   song: {
      type: 'object',
      version: '4.0.0',
      check: InfoSongDataCheck,
   },
   audio: {
      type: 'object',
      version: '4.0.0',
      check: InfoAudioDataCheck,
   },
   songPreviewFilename: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   coverImageFilename: {
      type: 'string',
      version: '4.0.0',
      optional: true,
   },
   environmentNames: {
      type: 'string',
      array: true,
      version: '4.0.0',
   },
   colorSchemes: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: InfoColorSchemeDataCheck,
   },
   difficultyBeatmaps: {
      type: 'object',
      array: true,
      version: '4.0.0',
      check: InfoDifficultyDataCheck,
   },
   customData: {
      type: 'object',
      version: '4.0.0',
      check: {},
      optional: true,
   },
} as const;

export const AudioDataBPMDataCheck: {
   readonly [key in keyof IAudioBPM]: IDataCheck;
} = {
   si: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   ei: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   sb: {
      type: 'number',
      version: '4.0.0',
   },
   eb: {
      type: 'number',
      version: '4.0.0',
   },
};

export const AudioDataLUFSDataCheck: {
   readonly [key in keyof IAudioLUFS]: IDataCheck;
} = {
   si: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   ei: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   l: {
      type: 'number',
      version: '4.0.0',
   },
};

export const AudioDataCheck: { readonly [key in keyof IAudio]: IDataCheck } = {
   version: {
      type: 'string',
      version: '4.0.0',
   },
   songChecksum: {
      type: 'string',
      version: '4.0.0',
   },
   songSampleCount: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   songFrequency: {
      type: 'number',
      version: '4.0.0',
      int: true,
      unsigned: true,
   },
   bpmData: {
      type: 'object',
      version: '4.0.0',
      check: AudioDataBPMDataCheck,
      array: true,
   },
   lufsData: {
      type: 'object',
      version: '4.0.0',
      check: AudioDataLUFSDataCheck,
      array: true,
   },
};
