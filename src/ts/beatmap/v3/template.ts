import { DifficultyData } from './types/difficulty';

export const difficulty = (): DifficultyData => {
    return {
        version: '3.0.0',
        bpmEvents: [],
        rotationEvents: [],
        colorNotes: [],
        bombNotes: [],
        obstacles: [],
        sliders: [],
        burstSliders: [],
        waypoints: [],
        basicBeatmapEvents: [],
        colorBoostBeatmapEvents: [],
        lightColorEventBoxGroups: [],
        lightRotationEventBoxGroups: [],
        basicEventTypesWithKeywords: { d: [] },
        useNormalEventsAsCompatibleEvents: false,
    };
};
