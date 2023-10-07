import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import { IDifficulty } from '../../types/beatmap/v1/difficulty';
import { IEvent } from '../../types/beatmap/v1/event';
import { IInfo, IInfoDifficulty } from '../../types/beatmap/v1/info';
import { INote } from '../../types/beatmap/v1/note';
import { IObstacle } from '../../types/beatmap/v1/obstacle';

export const NoteDataCheck: { readonly [key in keyof INote]: DataCheck } = {
   _time: {
      type: 'number',
      version: '1.5.0',
   },
   _type: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '1.5.0',
   },
   _lineIndex: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
   _lineLayer: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
   _cutDirection: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '1.5.0',
   },
} as const;

export const ObstacleDataCheck: { readonly [key in keyof IObstacle]: DataCheck } = {
   _time: {
      type: 'number',
      version: '1.5.0',
   },
   _lineIndex: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
   _type: {
      type: 'number',
      int: true,
      unsigned: true,
      version: '1.5.0',
   },
   _duration: {
      type: 'number',
      version: '1.5.0',
   },
   _width: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
} as const;

export const EventDataCheck: { readonly [key in keyof IEvent]: DataCheck } = {
   _time: {
      type: 'number',
      version: '1.5.0',
   },
   _type: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
   _value: {
      type: 'number',
      int: true,
      version: '1.5.0',
   },
} as const;

export const DifficultyCheck: { readonly [key in keyof IDifficulty]: DataCheck } = {
   _version: {
      type: 'string',
      version: '1.5.0',
   },
   _beatsPerMinute: {
      type: 'number',
      version: '1.5.0',
   },
   _beatsPerBar: {
      type: 'number',
      version: '1.5.0',
   },
   _shuffle: {
      type: 'number',
      version: '1.5.0',
   },
   _shufflePeriod: {
      type: 'number',
      version: '1.5.0',
   },
   _noteJumpSpeed: {
      type: 'number',
      version: '1.5.0',
      optional: true,
   },
   _noteJumpStartBeatOffset: {
      type: 'number',
      version: '1.5.0',
      optional: true,
   },
   _notes: {
      type: 'array',
      version: '1.5.0',
      check: NoteDataCheck,
   },
   _obstacles: {
      type: 'array',
      version: '1.5.0',
      check: ObstacleDataCheck,
   },
   _events: {
      type: 'array',
      version: '1.5.0',
      check: EventDataCheck,
   },
   _time: {
      type: 'number',
      version: '1.5.0',
      optional: true,
   },
   _BPMChanges: {
      type: 'array',
      version: '1.5.0',
      optional: true,
      check: {},
   },
   _bookmarks: {
      type: 'array',
      version: '1.5.0',
      optional: true,
      check: {},
   },
} as const;

export const InfoDifficultyCheck: { readonly [key in keyof IInfoDifficulty]: DataCheck } = {
   difficulty: {
      type: 'string',
      version: '1.0.0',
   },
   difficultyRank: {
      type: 'number',
      version: '1.0.0',
   },
   audioPath: {
      type: 'string',
      version: '1.0.0',
   },
   jsonPath: {
      type: 'string',
      version: '1.0.0',
   },
   characteristic: {
      type: 'string',
      version: '1.0.0',
   },
   offset: {
      type: 'number',
      version: '1.0.0',
      optional: true,
   },
   oldOffset: {
      type: 'number',
      version: '1.0.0',
      optional: true,
   },
   chromaToggle: {
      type: 'string',
      version: '1.0.0',
      optional: true,
   },
   customColors: {
      type: 'number',
      version: '1.0.0',
      optional: true,
   },
   difficultyLabel: {
      type: 'string',
      version: '1.0.0',
      optional: true,
   },
   colorLeft: {
      type: 'object',
      version: '1.0.0',
      check: {},
      optional: true,
   },
   colorRight: {
      type: 'object',
      version: '1.0.0',
      check: {},
      optional: true,
   },
   envColorLeft: {
      type: 'object',
      version: '1.0.0',
      check: {},
      optional: true,
   },
   envColorRight: {
      type: 'object',
      version: '1.0.0',
      check: {},
      optional: true,
   },
   obstacleColor: {
      type: 'object',
      version: '1.0.0',
      check: {},
      optional: true,
   },
};

export const InfoCheck: { readonly [key in keyof IInfo]: DataCheck } = {
   songName: {
      type: 'string',
      version: '1.0.0',
   },
   songSubName: {
      type: 'string',
      version: '1.0.0',
   },
   authorName: {
      type: 'string',
      version: '1.0.0',
   },
   beatsPerMinute: {
      type: 'number',
      version: '1.0.0',
   },
   previewStartTime: {
      type: 'number',
      version: '1.0.0',
   },
   previewDuration: {
      type: 'number',
      version: '1.0.0',
   },
   coverImagePath: {
      type: 'string',
      version: '1.0.0',
   },
   environmentName: {
      type: 'string',
      version: '1.0.0',
   },
   difficultyLevels: {
      type: 'array',
      version: '1.0.0',
      check: InfoDifficultyCheck,
   },
   oneSaber: {
      type: 'boolean',
      version: '1.0.0',
      optional: true,
   },
   contributors: {
      type: 'array',
      version: '1.0.0',
      optional: true,
      check: {},
   },
   customEnvironment: {
      type: 'string',
      version: '1.0.0',
      optional: true,
   },
   customEnvironmentHash: {
      type: 'string',
      version: '1.0.0',
      optional: true,
   },
};
