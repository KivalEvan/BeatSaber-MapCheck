import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { IEvent } from '../../types/beatmap/v2/event';
import { INote } from '../../types/beatmap/v2/note';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import { IArc } from '../../types/beatmap/v2/arc';
import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters';
import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import {
   IInfo,
   IInfoColorScheme,
   IInfoColorSchemeData,
   IInfoDifficulty,
   IInfoSet,
} from '../../types/beatmap/v2/info';
import { IColor } from '../../types/colors';

export const NoteDataCheck: { readonly [key in keyof INote]: DataCheck } = {
   _time: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _type: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '2.0.0',
      optional: true,
   },
   _lineIndex: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _lineLayer: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _cutDirection: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '2.0.0',
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ArcDataCheck: { readonly [key in keyof IArc]: DataCheck } = {
   _colorType: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _headTime: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _headLineIndex: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _headLineLayer: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _headCutDirection: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '2.0.0',
      optional: true,
   },
   _headControlPointLengthMultiplier: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _tailTime: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _tailLineIndex: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _tailLineLayer: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _tailCutDirection: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '2.0.0',
      optional: true,
   },
   _tailControlPointLengthMultiplier: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _sliderMidAnchorMode: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const ObstacleDataCheck: { readonly [key in keyof IObstacle]: DataCheck } = {
   _time: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _lineIndex: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _type: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '2.0.0',
      optional: true,
   },
   _duration: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _width: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const EventDataCheck: { readonly [key in keyof IEvent]: DataCheck } = {
   _time: {
      type: 'number',
      version: '2.0.0',
      optional: true,
   },
   _type: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _value: {
      type: 'number',
      int: true,
      version: '2.0.0',
      optional: true,
   },
   _floatValue: {
      type: 'number',
      version: '2.5.0',
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const WaypointDataCheck: { readonly [key in keyof IWaypoint]: DataCheck } = {
   _time: {
      type: 'number',
      version: '2.2.0',
      optional: true,
   },
   _lineIndex: {
      type: 'number',
      int: true,
      version: '2.2.0',
      optional: true,
   },
   _lineLayer: {
      type: 'number',
      int: true,
      version: '2.2.0',
      optional: true,
   },
   _offsetDirection: {
      type: 'number',
      int: true,
      version: '2.2.0',
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const SpecialEventsKeywordFiltersKeywordsDataCheck: {
   readonly [key in keyof ISpecialEventsKeywordFiltersKeywords]: DataCheck;
} = {
   _keyword: {
      type: 'string',
      version: '2.4.0',
      optional: true,
   },
   _specialEvents: {
      type: 'number',
      int: true,
      array: true,
      version: '2.4.0',
      optional: true,
   },
} as const;

export const SpecialEventsKeywordFiltersDataCheck: {
   readonly [key in keyof ISpecialEventsKeywordFilters]: DataCheck;
} = {
   _keywords: {
      type: 'array',
      version: '2.4.0',
      check: SpecialEventsKeywordFiltersKeywordsDataCheck,
      optional: true,
   },
} as const;

export const DifficultyCheck: { readonly [key in keyof IDifficulty]: DataCheck } = {
   _version: {
      type: 'string',
      version: '2.0.0',
      optional: true,
   },
   _notes: {
      type: 'array',
      version: '2.0.0',
      check: NoteDataCheck,
      optional: true,
   },
   _sliders: {
      type: 'array',
      version: '2.6.0',
      check: ArcDataCheck,
      optional: true,
   },
   _obstacles: {
      type: 'array',
      version: '2.0.0',
      check: ObstacleDataCheck,
      optional: true,
   },
   _events: {
      type: 'array',
      version: '2.0.0',
      check: EventDataCheck,
      optional: true,
   },
   _waypoints: {
      type: 'array',
      version: '2.2.0',
      check: WaypointDataCheck,
      optional: true,
   },
   _specialEventsKeywordFilters: {
      type: 'object',
      version: '2.4.0',
      check: SpecialEventsKeywordFiltersDataCheck,
      optional: true,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
} as const;

export const InfoSetDifficultyCheck: { readonly [key in keyof IInfoDifficulty]: DataCheck } = {
   _difficulty: {
      type: 'string',
      version: '2.0.0',
   },
   _difficultyRank: {
      type: 'number',
      version: '2.0.0',
   },
   _beatmapFilename: {
      type: 'string',
      version: '2.0.0',
   },
   _noteJumpMovementSpeed: {
      type: 'number',
      version: '2.0.0',
   },
   _noteJumpStartBeatOffset: {
      type: 'number',
      version: '2.0.0',
   },
   _beatmapColorSchemeIdx: {
      type: 'number',
      version: '2.1.0',
   },
   _environmentNameIdx: {
      type: 'number',
      version: '2.1.0',
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
};

export const InfoSetCheck: { readonly [key in keyof IInfoSet]: DataCheck } = {
   _beatmapCharacteristicName: {
      type: 'string',
      version: '2.0.0',
   },
   _difficultyBeatmaps: {
      type: 'array',
      version: '2.0.0',
      check: InfoSetDifficultyCheck,
   },
};

export const ColorObjectCheck: { readonly [key in keyof IColor]: DataCheck } = {
   r: {
      type: 'number',
      version: '2.1.0',
   },
   g: {
      type: 'number',
      version: '2.1.0',
   },
   b: {
      type: 'number',
      version: '2.1.0',
   },
   a: {
      type: 'number',
      version: '2.1.0',
   },
};

export const InfoColorSchemeDataCheck: { readonly [key in keyof IInfoColorSchemeData]: DataCheck } =
   {
      colorSchemeId: {
         type: 'string',
         version: '2.1.0',
      },
      saberAColor: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      saberBColor: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      environmentColor0: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      environmentColor1: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      obstaclesColor: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      environmentColor0Boost: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
      environmentColor1Boost: {
         type: 'object',
         version: '2.1.0',
         check: ColorObjectCheck,
      },
   };

export const InfoColorSchemeCheck: { readonly [key in keyof IInfoColorScheme]: DataCheck } = {
   useOverride: {
      type: 'boolean',
      version: '2.1.0',
   },
   colorScheme: {
      type: 'object',
      version: '2.1.0',
      check: InfoColorSchemeDataCheck,
   },
};

export const InfoCheck: { readonly [key in keyof IInfo]: DataCheck } = {
   _version: {
      type: 'string',
      version: '2.0.0',
      optional: true,
   },
   _songName: {
      type: 'string',
      version: '2.0.0',
   },
   _songSubName: {
      type: 'string',
      version: '2.0.0',
   },
   _songAuthorName: {
      type: 'string',
      version: '2.0.0',
   },
   _levelAuthorName: {
      type: 'string',
      version: '2.0.0',
   },
   _beatsPerMinute: {
      type: 'number',
      version: '2.0.0',
   },
   _songTimeOffset: {
      type: 'number',
      version: '2.0.0',
   },
   _shuffle: {
      type: 'number',
      version: '2.0.0',
   },
   _shufflePeriod: {
      type: 'number',
      version: '2.0.0',
   },
   _previewStartTime: {
      type: 'number',
      version: '2.0.0',
   },
   _previewDuration: {
      type: 'number',
      version: '2.0.0',
   },
   _songFilename: {
      type: 'string',
      version: '2.0.0',
   },
   _coverImageFilename: {
      type: 'string',
      version: '2.0.0',
   },
   _environmentName: {
      type: 'string',
      version: '2.0.0',
   },
   _allDirectionsEnvironmentName: {
      type: 'string',
      version: '2.0.0',
      optional: true,
   },
   _environmentNames: {
      type: 'string',
      version: '2.1.0',
      array: true,
   },
   _colorSchemes: {
      type: 'array',
      version: '2.1.0',
      check: InfoColorSchemeCheck,
   },
   _customData: {
      type: 'object',
      version: '2.0.0',
      check: {},
      optional: true,
   },
   _difficultyBeatmapSets: {
      type: 'array',
      version: '2.0.0',
      check: InfoSetCheck,
   },
};
