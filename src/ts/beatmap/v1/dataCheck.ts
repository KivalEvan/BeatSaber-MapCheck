import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import { IDifficulty } from '../../types/beatmap/v1/difficulty';
import { IEvent } from '../../types/beatmap/v1/event';
import { INote } from '../../types/beatmap/v1/note';
import { IObstacle } from '../../types/beatmap/v1/obstacle';

export const SkipCheck: { readonly [key in string]: DataCheck } = {} as const;

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
        check: SkipCheck,
    },
    _bookmarks: {
        type: 'array',
        version: '1.5.0',
        optional: true,
        check: SkipCheck,
    },
} as const;
