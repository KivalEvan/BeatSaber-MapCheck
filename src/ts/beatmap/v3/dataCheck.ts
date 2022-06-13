import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import {
    IBasicEvent,
    IBasicEventTypesForKeywords,
    IBasicEventTypesWithKeywords,
    IBombNote,
    IBPMEvent,
    IBurstSlider,
    IColorBoostEvent,
    IColorNote,
    IDifficultyData,
    IIndexFilter,
    ILightColorBase,
    ILightColorEventBox,
    ILightColorEventBoxGroup,
    ILightRotationBase,
    ILightRotationEventBox,
    ILightRotationEventBoxGroup,
    IObstacle,
    IRotationEvent,
    ISlider,
    IWaypoint,
} from '../../types/beatmap/v3';

// FIXME: ALMOST EVERYTHING IS HERE IFUCKIN OPTIONAL REE
export const ColorNoteDataCheck: Record<keyof IColorNote, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    c: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    a: {
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

export const BombDataCheck: Record<keyof IBombNote, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
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

export const SliderDataCheck: Record<keyof ISlider, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    c: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    mu: {
        type: 'number',
        version: '3.0.0',
    },
    tb: {
        type: 'number',
        version: '3.0.0',
    },
    tx: {
        type: 'number',
        version: '3.0.0',
    },
    ty: {
        type: 'number',
        version: '3.0.0',
    },
    tc: {
        type: 'number',
        version: '3.0.0',
    },
    tmu: {
        type: 'number',
        version: '3.0.0',
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

export const BurstSliderDataCheck: Record<keyof IBurstSlider, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    c: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    tb: {
        type: 'number',
        version: '3.0.0',
    },
    tx: {
        type: 'number',
        version: '3.0.0',
    },
    ty: {
        type: 'number',
        version: '3.0.0',
    },
    sc: {
        type: 'number',
        version: '3.0.0',
    },
    s: {
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

export const ObstacleDataCheck: Record<keyof IObstacle, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    w: {
        type: 'number',
        version: '3.0.0',
    },
    h: {
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

export const BasicEventDataCheck: Record<keyof IBasicEvent, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    et: {
        type: 'number',
        version: '3.0.0',
    },
    i: {
        type: 'number',
        version: '3.0.0',
    },
    f: {
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

export const BPMChangeEventDataCheck: Record<keyof IBPMEvent, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
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

export const RotationEventDataCheck: Record<keyof IRotationEvent, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    e: {
        type: 'number',
        version: '3.0.0',
    },
    r: {
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

export const ColorBoostEventDataCheck: Record<keyof IColorBoostEvent, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    o: {
        type: 'boolean',
        version: '3.0.0',
    },
    customData: {
        type: 'object',
        version: '3.0.0',
        check: {},
        optional: true,
    },
} as const;

export const IndexFilterDataCheck: Record<keyof IIndexFilter, DataCheck> = {
    f: {
        type: 'number',
        version: '3.0.0',
    },
    p: {
        type: 'number',
        version: '3.0.0',
    },
    t: {
        type: 'number',
        version: '3.0.0',
    },
    r: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const LightColorBaseDataCheck: Record<keyof ILightColorBase, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    i: {
        type: 'number',
        version: '3.0.0',
    },
    c: {
        type: 'number',
        version: '3.0.0',
    },
    s: {
        type: 'number',
        version: '3.0.0',
    },
    f: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const LightColorEventBoxDataCheck: Record<keyof ILightColorEventBox, DataCheck> = {
    f: {
        type: 'object',
        version: '3.0.0',
        check: IndexFilterDataCheck,
    },
    w: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    r: {
        type: 'number',
        version: '3.0.0',
    },
    t: {
        type: 'number',
        version: '3.0.0',
    },
    e: {
        type: 'array',
        version: '3.0.0',
        check: LightColorBaseDataCheck,
    },
    b: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const LightColorEventBoxGroupDataCheck: Record<keyof ILightColorEventBoxGroup, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    g: {
        type: 'number',
        version: '3.0.0',
    },
    e: {
        type: 'array',
        version: '3.0.0',
        check: LightColorEventBoxDataCheck,
    },
    customData: {
        type: 'object',
        version: '3.0.0',
        check: {},
        optional: true,
    },
} as const;

export const LightRotationBaseDataCheck: Record<keyof ILightRotationBase, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    p: {
        type: 'number',
        version: '3.0.0',
    },
    e: {
        type: 'number',
        version: '3.0.0',
    },
    l: {
        type: 'number',
        version: '3.0.0',
    },
    r: {
        type: 'number',
        version: '3.0.0',
    },
    o: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const LightRotationEventBoxDataCheck: Record<keyof ILightRotationEventBox, DataCheck> = {
    f: {
        type: 'object',
        version: '3.0.0',
        check: IndexFilterDataCheck,
    },
    w: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    s: {
        type: 'number',
        version: '3.0.0',
    },
    t: {
        type: 'number',
        version: '3.0.0',
    },
    a: {
        type: 'number',
        version: '3.0.0',
    },
    l: {
        type: 'array',
        version: '3.0.0',
        check: LightRotationBaseDataCheck,
    },
    r: {
        type: 'number',
        version: '3.0.0',
    },
    b: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const LightRotationEventBoxGroupDataCheck: Record<keyof ILightRotationEventBoxGroup, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    g: {
        type: 'number',
        version: '3.0.0',
    },
    e: {
        type: 'array',
        version: '3.0.0',
        check: LightRotationEventBoxDataCheck,
    },
    customData: {
        type: 'object',
        version: '3.0.0',
        check: {},
        optional: true,
    },
} as const;

export const BasicEventTypesForKeywordsDataCheck: Record<keyof IBasicEventTypesForKeywords, DataCheck> = {
    k: {
        type: 'string',
        version: '3.0.0',
    },
    e: {
        type: 'number',
        version: '3.0.0',
    },
} as const;

export const BasicEventTypesWithKeywordsDataCheck: Record<keyof IBasicEventTypesWithKeywords, DataCheck> = {
    d: {
        type: 'array',
        version: '3.0.0',
        check: BasicEventTypesForKeywordsDataCheck,
        optional: true,
    },
} as const;

export const WaypointDataCheck: Record<keyof IWaypoint, DataCheck> = {
    b: {
        type: 'number',
        version: '3.0.0',
    },
    d: {
        type: 'number',
        version: '3.0.0',
    },
    x: {
        type: 'number',
        version: '3.0.0',
    },
    y: {
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

export const DifficultyDataCheck: Record<keyof IDifficultyData, DataCheck> = {
    version: {
        type: 'string',
        version: '3.0.0',
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
        check: SliderDataCheck,
        optional: true,
    },
    burstSliders: {
        type: 'array',
        version: '3.0.0',
        check: BurstSliderDataCheck,
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
    basicEventTypesWithKeywords: {
        type: 'object',
        version: '3.0.0',
        check: BasicEventTypesWithKeywordsDataCheck,
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