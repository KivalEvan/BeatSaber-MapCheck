import type { IBasicEvent } from './basicEvent.ts';
import type { IColorBoostEvent } from './colorBoostEvent.ts';
import type { ILightColorEventBoxGroup } from './lightColorEventBoxGroup.ts';
import type { ILightRotationEventBoxGroup } from './lightRotationEventBoxGroup.ts';
import type { ILightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup.ts';
import type { ICustomDataDifficulty } from './custom/difficulty.ts';
import type { IBaseItem } from './baseItem.ts';
import type { IFxEventBoxGroup } from './fxEventBoxGroup.ts';
import type { IFxEventsCollection } from './fxEventsCollection.ts';

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
