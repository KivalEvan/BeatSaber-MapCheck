import { IBPMEvent } from './bpmEvent';
import { IRotationEvent } from './rotationEvent';
import { IColorNote } from './colorNote';
import { IBombNote } from './bombNote';
import { IObstacle } from './obstacle';
import { ISlider } from './slider';
import { IBurstSlider } from './burstSlider';
import { IWaypoint } from './waypoint';
import { IBasicEvent } from './basicEvent';
import { IColorBoostEvent } from './colorBoostEvent';
import { ILightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { ILightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { IBasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';
import { ICustomDataDifficultyV3 } from '../shared/customData';

export interface IDifficultyData {
    version: '3.0.0';
    bpmEvents: IBPMEvent[];
    rotationEvents: IRotationEvent[];
    colorNotes: IColorNote[];
    bombNotes: IBombNote[];
    obstacles: IObstacle[];
    sliders: ISlider[];
    burstSliders: IBurstSlider[];
    waypoints: IWaypoint[];
    basicBeatmapEvents: IBasicEvent[];
    colorBoostBeatmapEvents: IColorBoostEvent[];
    lightColorEventBoxGroups: ILightColorEventBoxGroup[];
    lightRotationEventBoxGroups: ILightRotationEventBoxGroup[];
    basicEventTypesWithKeywords: IBasicEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents: boolean;
    customData?: ICustomDataDifficultyV3;
}
