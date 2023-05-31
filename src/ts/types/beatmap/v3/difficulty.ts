import { IBPMEvent } from './bpmEvent';
import { IRotationEvent } from './rotationEvent';
import { IColorNote } from './colorNote';
import { IBombNote } from './bombNote';
import { IObstacle } from './obstacle';
import { IArc } from './arc';
import { IChain } from './chain';
import { IWaypoint } from './waypoint';
import { IBasicEvent } from './basicEvent';
import { IColorBoostEvent } from './colorBoostEvent';
import { ILightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { ILightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { IBasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';
import { ILightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup';
import { ICustomDataDifficulty } from './custom/difficulty';
import { IBaseItem } from './baseItem';

export interface IDifficulty extends IBaseItem {
    version: `3.${0 | 1 | 2}.0`;
    bpmEvents: IBPMEvent[];
    rotationEvents: IRotationEvent[];
    colorNotes: IColorNote[];
    bombNotes: IBombNote[];
    obstacles: IObstacle[];
    sliders: IArc[];
    burstSliders: IChain[];
    waypoints: IWaypoint[];
    basicBeatmapEvents: IBasicEvent[];
    colorBoostBeatmapEvents: IColorBoostEvent[];
    lightColorEventBoxGroups: ILightColorEventBoxGroup[];
    lightRotationEventBoxGroups: ILightRotationEventBoxGroup[];
    lightTranslationEventBoxGroups: ILightTranslationEventBoxGroup[];
    basicEventTypesWithKeywords: IBasicEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents: boolean;
    customData?: ICustomDataDifficulty;
}
