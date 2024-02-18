import { IBasicEvent } from './basicEvent';
import { IColorBoostEvent } from './colorBoostEvent';
import { ILightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { ILightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { ILightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup';
import { ICustomDataDifficulty } from './custom/difficulty';
import { IBaseItem } from './baseItem';
import { IFxEventBoxGroup } from './fxEventBoxGroup';
import { IFxEventsCollection } from './fxEventsCollection';

export interface ILightshow extends IBaseItem {
   basicBeatmapEvents?: IBasicEvent[];
   colorBoostBeatmapEvents?: IColorBoostEvent[];
   lightColorEventBoxGroups?: ILightColorEventBoxGroup[];
   lightRotationEventBoxGroups?: ILightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups?: ILightTranslationEventBoxGroup[];
   vfxEventBoxGroups?: IFxEventBoxGroup[];
   _fxEventsCollection?: IFxEventsCollection;
   customData?: ICustomDataDifficulty;
}
