import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import {
    IDifficultyData,
    INote,
    ISlider,
    IObstacle,
    IEvent,
    IWaypoint,
    ISpecialEventsKeywordFilters,
    ISpecialEventsKeywordFiltersKeywords,
} from '../../types/beatmap/v2/index';

export const NoteDataCheck: Readonly<Record<keyof INote, DataCheck>> = {
    _time: {
        type: 'number',
        version: '2.0.0',
    },
    _type: {
        type: 'number',
        version: '2.0.0',
    },
    _lineIndex: {
        type: 'number',
        version: '2.0.0',
    },
    _lineLayer: {
        type: 'number',
        version: '2.0.0',
    },
    _cutDirection: {
        type: 'number',
        version: '2.0.0',
    },
    _customData: {
        type: 'object',
        version: '2.0.0',
        check: {},
        optional: true,
    },
};

export const SliderDataCheck: Readonly<Record<keyof ISlider, DataCheck>> = {
    _colorType: {
        type: 'number',
        version: '2.0.0',
    },
    _headTime: {
        type: 'number',
        version: '2.0.0',
    },
    _headLineIndex: {
        type: 'number',
        version: '2.0.0',
    },
    _headLineLayer: {
        type: 'number',
        version: '2.0.0',
    },
    _headCutDirection: {
        type: 'number',
        version: '2.0.0',
    },
    _headControlPointlengthMultiplier: {
        type: 'number',
        version: '2.0.0',
    },
    _tailTime: {
        type: 'number',
        version: '2.0.0',
    },
    _tailLineIndex: {
        type: 'number',
        version: '2.0.0',
    },
    _tailLineLayer: {
        type: 'number',
        version: '2.0.0',
    },
    _tailCutDirection: {
        type: 'number',
        version: '2.0.0',
    },
    _tailControlPointLengthMultiplier: {
        type: 'number',
        version: '2.0.0',
    },
    _sliderMidAnchorMode: {
        type: 'number',
        version: '2.0.0',
    },
};

export const ObstacleDataCheck: Readonly<Record<keyof IObstacle, DataCheck>> = {
    _time: {
        type: 'number',
        version: '2.0.0',
    },
    _lineIndex: {
        type: 'number',
        version: '2.0.0',
    },
    _lineLayer: {
        type: 'number',
        version: '2.6.0',
    },
    _type: {
        type: 'number',
        version: '2.0.0',
    },
    _duration: {
        type: 'number',
        version: '2.0.0',
    },
    _width: {
        type: 'number',
        version: '2.0.0',
    },
    _height: {
        type: 'number',
        version: '2.6.0',
    },
    _customData: {
        type: 'object',
        version: '2.0.0',
        check: {},
        optional: true,
    },
};

export const EventDataCheck: Readonly<Record<keyof IEvent, DataCheck>> = {
    _time: {
        type: 'number',
        version: '2.0.0',
    },
    _type: {
        type: 'number',
        version: '2.0.0',
    },
    _value: {
        type: 'number',
        version: '2.0.0',
    },
    _floatValue: {
        type: 'number',
        version: '2.5.0',
    },
    _customData: {
        type: 'object',
        version: '2.0.0',
        check: {},
        optional: true,
    },
};

export const WaypointDataCheck: Readonly<Record<keyof IWaypoint, DataCheck>> = {
    _time: {
        type: 'number',
        version: '2.2.0',
    },
    _lineIndex: {
        type: 'number',
        version: '2.2.0',
    },
    _lineLayer: {
        type: 'number',
        version: '2.2.0',
    },
    _offsetDirection: {
        type: 'number',
        version: '2.2.0',
    },
};

export const SpecialEventsKeywordFiltersKeywordsDataCheck: Readonly<
    Record<keyof ISpecialEventsKeywordFiltersKeywords, DataCheck>
> = {
    _keyword: {
        type: 'string',
        version: '2.4.0',
    },
    _specialEvents: {
        type: 'number',
        version: '2.4.0',
    },
};

export const SpecialEventsKeywordFiltersDataCheck: Readonly<
    Record<keyof ISpecialEventsKeywordFilters, DataCheck>
> = {
    _keywords: {
        type: 'array',
        version: '2.4.0',
        check: SpecialEventsKeywordFiltersKeywordsDataCheck,
    },
};

export const DifficultyDataCheck: Readonly<Record<keyof IDifficultyData, DataCheck>> = {
    _version: {
        type: 'string',
        version: '2.0.0',
    },
    _notes: {
        type: 'array',
        version: '2.0.0',
        check: NoteDataCheck,
    },
    _sliders: {
        type: 'array',
        version: '2.6.0',
        check: SliderDataCheck,
    },
    _obstacles: {
        type: 'array',
        version: '2.0.0',
        check: ObstacleDataCheck,
    },
    _events: {
        type: 'array',
        version: '2.0.0',
        check: EventDataCheck,
    },
    _waypoints: {
        type: 'array',
        version: '2.2.0',
        check: WaypointDataCheck,
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
};
