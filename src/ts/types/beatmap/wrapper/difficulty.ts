// deno-lint-ignore-file no-explicit-any
import { IWrapBPMEvent, IWrapBPMEventAttribute } from './bpmEvent';
import { IWrapRotationEvent, IWrapRotationEventAttribute } from './rotationEvent';
import { IWrapColorNote, IWrapColorNoteAttribute } from './colorNote';
import { IWrapBombNote, IWrapBombNoteAttribute } from './bombNote';
import { IWrapObstacle, IWrapObstacleAttribute } from './obstacle';
import { IWrapArc, IWrapArcAttribute } from './arc';
import { IWrapChain, IWrapChainAttribute } from './chain';
import { IWrapWaypoint, IWrapWaypointAttribute } from './waypoint';
import { IWrapEvent, IWrapEventAttribute } from './event';
import { IWrapColorBoostEvent, IWrapColorBoostEventAttribute } from './colorBoostEvent';
import {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from './lightColorEventBoxGroup';
import {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from './lightRotationEventBoxGroup';
import {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from './lightTranslationEventBoxGroup';
import {
   IWrapEventTypesWithKeywords,
   IWrapEventTypesWithKeywordsAttribute,
} from './eventTypesWithKeywords';
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { Version } from '../shared/version';
import { DeepPartial, LooseAutocomplete } from '../../utils';
import { GenericFileName } from '../shared/filename';
import { EventContainer, NoteContainer } from './container';
import { BeatPerMinute } from '../../../beatmap/shared/bpm';
import { IWrapFxEventBoxGroup, IWrapFxEventBoxGroupAttribute } from './fxEventBoxGroup';

export interface IWrapDifficultyAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItemAttribute<T> {
   readonly version: Version;
   bpmEvents: IWrapBPMEventAttribute[];
   rotationEvents: IWrapRotationEventAttribute[];
   colorNotes: IWrapColorNoteAttribute[];
   bombNotes: IWrapBombNoteAttribute[];
   obstacles: IWrapObstacleAttribute[];
   arcs: IWrapArcAttribute[];
   chains: IWrapChainAttribute[];
   waypoints: IWrapWaypointAttribute[];
   basicEvents: IWrapEventAttribute[];
   colorBoostEvents: IWrapColorBoostEventAttribute[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroupAttribute[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroupAttribute[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroupAttribute[];
   fxEventBoxGroups: IWrapFxEventBoxGroupAttribute[];
   eventTypesWithKeywords: IWrapEventTypesWithKeywordsAttribute;
   useNormalEventsAsCompatibleEvents: boolean;

   filename: string;
}

export interface IWrapDifficulty<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapDifficultyAttribute<T> {
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

   setFilename(filename: LooseAutocomplete<GenericFileName>): this;

   /** Sort beatmap object(s) accordingly. */
   sort(): this;

   /**
    * Reparse the beatmap to their respective schema class.
    *
    * Used to match the beatmap schema if wrapper mix-and-matched the class.
    * ```ts
    * if (!difficulty.isValid()) {
    *     difficulty.reparse();
    * }
    * ```
    *
    * **NOTE:** This will create a new set of array,
    * `keepRef` allows for already matched object to stay in new array instead of creating new object (this is faster and less memory but can cause reference issue)
    */
   reparse(keepRef?: boolean): this;

   /**
    * Calculate note per second.
    * ```ts
    * const nps = difficulty.nps(10);
    * ```
    *
    * **NOTE:** Duration can be either in any time type (second, beat, etc).
    */
   nps(duration: number): number;

   /**
    * Calculate the peak by rolling average.
    * ```ts
    * const peakNPS = difficulty.peak(10, BPM ?? 128);
    * ```
    */
   peak(beats: number, bpm: BeatPerMinute | number): number;

   /**
    * Get first interactible object beat time in beatmap.
    * ```ts
    * const firstInteractiveTime = difficulty.getFirstInteractiveTime(Difficulty);
    * ```
    */
   getFirstInteractiveTime(): number;

   /**
    * Get last interactible object beat time in beatmap.
    * ```ts
    * const lastInteractiveTime = difficulty.getLastInteractiveTime(Difficulty);
    * ```
    */
   getLastInteractiveTime(): number;

   /**
    * Get first interactible obstacle beat time in beatmap.
    * ```ts
    * const firstInteractiveObstacleTime = difficulty.findFirstInteractiveObstacleTime(obstacles);
    * ```
    */
   findFirstInteractiveObstacleTime(): number;

   /**
    * Get last interactible obstacle beat time in beatmap.
    * ```ts
    * const lastInteractiveObstacleTime = difficulty.findLastInteractiveObstacleTime(obstacles);
    * ```
    */
   findLastInteractiveObstacleTime(): number;

   /**
    * Get container of color notes, arcs, chains, and bombs (in order).
    * ```ts
    * const noteCountainer = getNoteContainer(Difficulty);
    * ```
    */
   getNoteContainer(): NoteContainer[];

   /**
    * Get container of basic events and boost events.
    * ```ts
    * const noteCountainer = getNoteContainer(Difficulty);
    * ```
    */
   getEventContainer(): EventContainer[];

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
