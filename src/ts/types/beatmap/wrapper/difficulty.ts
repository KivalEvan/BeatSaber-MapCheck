import { IWrapBPMEvent } from './bpmEvent';
import { IWrapRotationEvent } from './rotationEvent';
import { IWrapColorNote } from './colorNote';
import { IWrapBombNote } from './bombNote';
import { IWrapObstacle } from './obstacle';
import { IWrapSlider } from './slider';
import { IWrapBurstSlider } from './burstSlider';
import { IWrapWaypoint } from './waypoint';
import { IWrapEvent } from './event';
import { IWrapColorBoostEvent } from './colorBoostEvent';
import { IWrapLightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { IWrapLightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { IWrapEventTypesWithKeywords } from './eventTypesWithKeywords';
import { IWrapBaseItem } from './baseItem';

export interface IDifficulty extends IWrapBaseItem {
    version: `3.${0 | 1}.0`;
    bpmEvents: IWrapBPMEvent[];
    rotationEvents: IWrapRotationEvent[];
    colorNotes: IWrapColorNote[];
    bombNotes: IWrapBombNote[];
    obstacles: IWrapObstacle[];
    sliders: IWrapSlider[];
    burstSliders: IWrapBurstSlider[];
    waypoints: IWrapWaypoint[];
    basicBeatmapEvents: IWrapEvent[];
    colorBoostBeatmapEvents: IWrapColorBoostEvent[];
    lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
    lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
    basicEventTypesWithKeywords: IWrapEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents: boolean;
}
