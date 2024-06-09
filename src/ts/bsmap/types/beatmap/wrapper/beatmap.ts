import type { IWrapBPMEvent, IWrapBPMEventAttribute } from './bpmEvent.ts';
import type { IWrapRotationEvent, IWrapRotationEventAttribute } from './rotationEvent.ts';
import type { IWrapColorNote, IWrapColorNoteAttribute } from './colorNote.ts';
import type { IWrapBombNote, IWrapBombNoteAttribute } from './bombNote.ts';
import type { IWrapObstacle, IWrapObstacleAttribute } from './obstacle.ts';
import type { IWrapArc, IWrapArcAttribute } from './arc.ts';
import type { IWrapChain, IWrapChainAttribute } from './chain.ts';
import type { IWrapWaypoint, IWrapWaypointAttribute } from './waypoint.ts';
import type { IWrapEvent, IWrapEventAttribute } from './event.ts';
import type { IWrapColorBoostEvent, IWrapColorBoostEventAttribute } from './colorBoostEvent.ts';
import type {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from './lightColorEventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from './lightRotationEventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from './lightTranslationEventBoxGroup.ts';
import type { IWrapEventTypesWithKeywords } from './eventTypesWithKeywords.ts';
import type { DeepPartial, LooseAutocomplete } from '../../utils.ts';
import type { IWrapFxEventBoxGroup, IWrapFxEventBoxGroupAttribute } from './fxEventBoxGroup.ts';
import type { IWrapDifficulty, IWrapDifficultyAttribute } from './difficulty.ts';
import type { IWrapLightshow, IWrapLightshowAttribute } from './lightshow.ts';
import type { IWrapBaseFileAttribute, IWrapBeatmapFile } from './baseFile.ts';
import type { GenericFilename } from '../shared/filename.ts';
import type { IWrapBaseItemAttribute } from './baseItem.ts';
import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface IWrapBeatmapAttribute extends IWrapBaseItemAttribute, IWrapBaseFileAttribute {
   difficulty: IWrapDifficultyAttribute;
   lightshow: IWrapLightshowAttribute;

   // this honestly feels like hack but i need to figure out best way to handle this
   lightshowFilename: LooseAutocomplete<GenericFilename>;

   /**
    * This custom data does not contain the actual custom data from difficulty file, rather an arbitrary placement.
    *
    * If you need to handle custom data from actual beatmap, use `customData` inside `data` instead.
    *
    * @deprecated this is used as a warning, unless you know what you are doing.
    */
   customData: ICustomDataBase;
}

export interface IWrapBeatmap extends IWrapBeatmapFile, IWrapBeatmapAttribute {
   difficulty: IWrapDifficulty;
   lightshow: IWrapLightshow;

   bpmEvents: IWrapBPMEvent[];
   rotationEvents: IWrapRotationEvent[];
   colorNotes: IWrapColorNote[];
   bombNotes: IWrapBombNote[];
   obstacles: IWrapObstacle[];
   arcs: IWrapArc[];
   chains: IWrapChain[];
   waypoints: IWrapWaypoint[];
   basicEvents: IWrapEvent[];
   colorBoostEvents: IWrapColorBoostEvent[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
   fxEventBoxGroups: IWrapFxEventBoxGroup[];
   eventTypesWithKeywords: IWrapEventTypesWithKeywords;
   useNormalEventsAsCompatibleEvents: boolean;

   setLightshowFilename(filename: LooseAutocomplete<GenericFilename>): this;

   addBpmEvents(...data: Partial<IWrapBPMEventAttribute>[]): this;
   addRotationEvents(...data: Partial<IWrapRotationEventAttribute>[]): this;
   addColorNotes(...data: Partial<IWrapColorNoteAttribute>[]): this;
   addBombNotes(...data: Partial<IWrapBombNoteAttribute>[]): this;
   addObstacles(...data: Partial<IWrapObstacleAttribute>[]): this;
   addArcs(...data: Partial<IWrapArcAttribute>[]): this;
   addChains(...data: Partial<IWrapChainAttribute>[]): this;
   addWaypoints(...data: Partial<IWrapWaypointAttribute>[]): this;
   addBasicEvents(...data: Partial<IWrapEventAttribute>[]): this;
   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute>[]): this;
   addLightColorEventBoxGroups(...data: DeepPartial<IWrapLightColorEventBoxGroupAttribute>[]): this;
   addLightRotationEventBoxGroups(
      ...data: DeepPartial<IWrapLightRotationEventBoxGroupAttribute>[]
   ): this;
   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<IWrapLightTranslationEventBoxGroupAttribute>[]
   ): this;
   addFxEventBoxGroups(...data: DeepPartial<IWrapFxEventBoxGroupAttribute>[]): this;
}
