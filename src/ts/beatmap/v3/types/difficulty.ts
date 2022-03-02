import { BPMChangeEvent } from './bpmChange';
import { RotationEvent } from './rotationEvent';
import { ColorNote } from './colorNote';
import { BombNote } from './bombNote';
import { Obstacle } from './obstacle';
import { Slider } from './slider';
import { BurstSlider } from './burstSlider';
import { Waypoint } from './waypoint';
import { BasicEvent } from './basicEvent';
import { BoostEvent } from './boostEvent';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { BasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';

export interface DifficultyData {
    version: '3.0.0';
    bpmEvents: BPMChangeEvent[];
    rotationEvents: RotationEvent[];
    colorNotes: ColorNote[];
    bombNotes: BombNote[];
    obstacles: Obstacle[];
    sliders: Slider[];
    burstSliders: BurstSlider[];
    waypoints: Waypoint[];
    basicBeatmapEvents: BasicEvent[];
    colorBoostBeatmapEvents: BoostEvent[];
    lightColorEventBoxGroups: LightColorEventBoxGroup[];
    lightRotationEventBoxGroups: LightRotationEventBoxGroup[];
    basicEventTypesWithKeywords: BasicEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents: boolean;
}
