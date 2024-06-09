import type { IWrapEvent, IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import type { IWrapEventTypesWithKeywords } from '../../types/beatmap/wrapper/eventTypesWithKeywords.ts';
import type {
   IWrapBombNote,
   IWrapBombNoteAttribute,
} from '../../types/beatmap/wrapper/bombNote.ts';
import type {
   IWrapBPMEvent,
   IWrapBPMEventAttribute,
} from '../../types/beatmap/wrapper/bpmEvent.ts';
import type { IWrapChain, IWrapChainAttribute } from '../../types/beatmap/wrapper/chain.ts';
import type {
   IWrapColorBoostEvent,
   IWrapColorBoostEventAttribute,
} from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type {
   IWrapColorNote,
   IWrapColorNoteAttribute,
} from '../../types/beatmap/wrapper/colorNote.ts';
import type {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type {
   IWrapObstacle,
   IWrapObstacleAttribute,
} from '../../types/beatmap/wrapper/obstacle.ts';
import type {
   IWrapRotationEvent,
   IWrapRotationEventAttribute,
} from '../../types/beatmap/wrapper/rotationEvent.ts';
import type { IWrapArc, IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import type {
   IWrapWaypoint,
   IWrapWaypointAttribute,
} from '../../types/beatmap/wrapper/waypoint.ts';
import type { DeepPartialIgnore, LooseAutocomplete } from '../../types/utils.ts';
import { BaseItem } from './abstract/baseItem.ts';
import type { IWrapBeatmap, IWrapBeatmapAttribute } from '../../types/beatmap/wrapper/beatmap.ts';
import type {
   IWrapFxEventBoxGroup,
   IWrapFxEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import type { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty.ts';
import type { IWrapLightshow } from '../../types/beatmap/wrapper/lightshow.ts';
import { Difficulty } from './difficulty.ts';
import { Lightshow } from './lightshow.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';

export class Beatmap extends BaseItem implements IWrapBeatmap {
   static defaultValue: IWrapBeatmapAttribute = {
      version: -1,
      filename: 'Unnamed.beatmap.dat',
      lightshowFilename: 'Unnamed.lightshow.dat',
      customData: {},

      difficulty: {
         bpmEvents: [],
         rotationEvents: [],
         colorNotes: [],
         bombNotes: [],
         obstacles: [],
         arcs: [],
         chains: [],
         customData: {},
      },
      lightshow: {
         waypoints: [],
         basicEvents: [],
         colorBoostEvents: [],
         lightColorEventBoxGroups: [],
         lightRotationEventBoxGroups: [],
         lightTranslationEventBoxGroups: [],
         fxEventBoxGroups: [],
         eventTypesWithKeywords: { list: [] },
         useNormalEventsAsCompatibleEvents: false,
         customData: {},
      },
   };

   static create(...data: DeepPartialIgnore<IWrapBeatmapAttribute, 'customData'>[]): Beatmap[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapBeatmapAttribute, 'customData'> = {}) {
      super();
      this.version = data.version ?? Beatmap.defaultValue.version;
      this.filename = data.filename ?? Beatmap.defaultValue.filename;
      this.lightshowFilename = data.lightshowFilename ?? Beatmap.defaultValue.lightshowFilename;
      this.difficulty = new Difficulty(data.difficulty ?? Beatmap.defaultValue.difficulty);
      this.lightshow = new Lightshow(data.lightshow ?? Beatmap.defaultValue.lightshow);
   }

   isValid(fn?: (object: this) => boolean, _override?: boolean): boolean {
      return super.isValid(fn);
   }

   version: number;
   difficulty: IWrapDifficulty;
   lightshow: IWrapLightshow;

   filename: LooseAutocomplete<GenericFilename>;
   lightshowFilename: LooseAutocomplete<GenericFilename>;

   get bpmEvents(): IWrapBPMEvent[] {
      return this.difficulty.bpmEvents;
   }
   set bpmEvents(value: this['bpmEvents']) {
      this.difficulty.bpmEvents = value;
   }
   get rotationEvents(): IWrapRotationEvent[] {
      return this.difficulty.rotationEvents;
   }
   set rotationEvents(value: this['rotationEvents']) {
      this.difficulty.rotationEvents = value;
   }
   get colorNotes(): IWrapColorNote[] {
      return this.difficulty.colorNotes;
   }
   set colorNotes(value: this['colorNotes']) {
      this.difficulty.colorNotes = value;
   }
   get bombNotes(): IWrapBombNote[] {
      return this.difficulty.bombNotes;
   }
   set bombNotes(value: this['bombNotes']) {
      this.difficulty.bombNotes = value;
   }
   get obstacles(): IWrapObstacle[] {
      return this.difficulty.obstacles;
   }
   set obstacles(value: this['obstacles']) {
      this.difficulty.obstacles = value;
   }
   get arcs(): IWrapArc[] {
      return this.difficulty.arcs;
   }
   set arcs(value: this['arcs']) {
      this.difficulty.arcs = value;
   }
   get chains(): IWrapChain[] {
      return this.difficulty.chains;
   }
   set chains(value: this['chains']) {
      this.difficulty.chains = value;
   }
   get waypoints(): IWrapWaypoint[] {
      return this.lightshow.waypoints;
   }
   set waypoints(value: this['waypoints']) {
      this.lightshow.waypoints = value;
   }
   get basicEvents(): IWrapEvent[] {
      return this.lightshow.basicEvents;
   }
   set basicEvents(value: this['basicEvents']) {
      this.lightshow.basicEvents = value;
   }
   get colorBoostEvents(): IWrapColorBoostEvent[] {
      return this.lightshow.colorBoostEvents;
   }
   set colorBoostEvents(value: this['colorBoostEvents']) {
      this.lightshow.colorBoostEvents = value;
   }
   get lightColorEventBoxGroups(): IWrapLightColorEventBoxGroup[] {
      return this.lightshow.lightColorEventBoxGroups;
   }
   set lightColorEventBoxGroups(value: this['lightColorEventBoxGroups']) {
      this.lightshow.lightColorEventBoxGroups = value;
   }
   get lightRotationEventBoxGroups(): IWrapLightRotationEventBoxGroup[] {
      return this.lightshow.lightRotationEventBoxGroups;
   }
   set lightRotationEventBoxGroups(value: this['lightRotationEventBoxGroups']) {
      this.lightshow.lightRotationEventBoxGroups = value;
   }
   get lightTranslationEventBoxGroups(): IWrapLightTranslationEventBoxGroup[] {
      return this.lightshow.lightTranslationEventBoxGroups;
   }
   set lightTranslationEventBoxGroups(value: this['lightTranslationEventBoxGroups']) {
      this.lightshow.lightTranslationEventBoxGroups = value;
   }
   get fxEventBoxGroups(): IWrapFxEventBoxGroup[] {
      return this.lightshow.fxEventBoxGroups;
   }
   set fxEventBoxGroups(value: this['fxEventBoxGroups']) {
      this.lightshow.fxEventBoxGroups = value;
   }
   get eventTypesWithKeywords(): IWrapEventTypesWithKeywords {
      return this.lightshow.eventTypesWithKeywords;
   }
   set eventTypesWithKeywords(value: this['eventTypesWithKeywords']) {
      this.lightshow.eventTypesWithKeywords = value;
   }
   get useNormalEventsAsCompatibleEvents(): boolean {
      return this.lightshow.useNormalEventsAsCompatibleEvents;
   }
   set useNormalEventsAsCompatibleEvents(value: this['useNormalEventsAsCompatibleEvents']) {
      this.lightshow.useNormalEventsAsCompatibleEvents = value;
   }

   setLightshowFilename(filename: LooseAutocomplete<GenericFilename>): this {
      this.lightshowFilename = filename;
      return this;
   }
   setFilename(filename: LooseAutocomplete<GenericFilename>): this {
      this.filename = filename;
      return this;
   }

   sort(fn?: (object: this) => void): this {
      this.difficulty.sort();
      this.lightshow.sort();
      return super.sort(fn);
   }

   addBpmEvents(...data: DeepPartialIgnore<IWrapBPMEventAttribute, 'customData'>[]): this {
      this.difficulty.addBpmEvents(...data);
      return this;
   }
   addRotationEvents(
      ...data: DeepPartialIgnore<IWrapRotationEventAttribute, 'customData'>[]
   ): this {
      this.difficulty.addRotationEvents(...data);
      return this;
   }
   addColorNotes(...data: DeepPartialIgnore<IWrapColorNoteAttribute, 'customData'>[]): this {
      this.difficulty.addColorNotes(...data);
      return this;
   }
   addBombNotes(...data: DeepPartialIgnore<IWrapBombNoteAttribute, 'customData'>[]): this {
      this.difficulty.addBombNotes(...data);
      return this;
   }
   addObstacles(...data: DeepPartialIgnore<IWrapObstacleAttribute, 'customData'>[]): this {
      this.difficulty.addObstacles(...data);
      return this;
   }
   addArcs(...data: DeepPartialIgnore<IWrapArcAttribute, 'customData'>[]): this {
      this.difficulty.addArcs(...data);
      return this;
   }
   addChains(...data: DeepPartialIgnore<IWrapChainAttribute, 'customData'>[]): this {
      this.difficulty.addChains(...data);
      return this;
   }
   addWaypoints(...data: DeepPartialIgnore<IWrapWaypointAttribute, 'customData'>[]): this {
      this.lightshow.addWaypoints(...data);
      return this;
   }
   addBasicEvents(...data: DeepPartialIgnore<IWrapEventAttribute, 'customData'>[]): this {
      this.lightshow.addBasicEvents(...data);
      return this;
   }
   addColorBoostEvents(
      ...data: DeepPartialIgnore<IWrapColorBoostEventAttribute, 'customData'>[]
   ): this {
      this.lightshow.addColorBoostEvents(...data);
      return this;
   }
   addLightColorEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightColorEventBoxGroupAttribute, 'customData'>[]
   ): this {
      this.lightshow.addLightColorEventBoxGroups(...data);
      return this;
   }
   addLightRotationEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightRotationEventBoxGroupAttribute, 'customData'>[]
   ): this {
      this.lightshow.addLightRotationEventBoxGroups(...data);
      return this;
   }
   addLightTranslationEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightTranslationEventBoxGroupAttribute, 'customData'>[]
   ): this {
      this.lightshow.addLightTranslationEventBoxGroups(...data);
      return this;
   }
   addFxEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapFxEventBoxGroupAttribute, 'customData'>[]
   ): this {
      this.lightshow.addFxEventBoxGroups(...data);
      return this;
   }
}
