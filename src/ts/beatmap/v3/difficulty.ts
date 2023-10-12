import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { BasicEvent } from './basicEvent';
import { BasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';
import { BombNote } from './bombNote';
import { BPMEvent } from './bpmEvent';
import { Chain } from './chain';
import { ColorBoostEvent } from './colorBoostEvent';
import { ColorNote } from './colorNote';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { LightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup';
import { Obstacle } from './obstacle';
import { RotationEvent } from './rotationEvent';
import { Arc } from './arc';
import { Waypoint } from './waypoint';
import { DeepPartial } from '../../types/utils';
import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent';
import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { IObstacle } from '../../types/beatmap/v3/obstacle';
import { IArc } from '../../types/beatmap/v3/arc';
import { IChain } from '../../types/beatmap/v3/chain';
import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { WrapDifficulty } from '../wrapper/difficulty';
import { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent';
import { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';
import { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote';
import { IWrapChainAttribute } from '../../types/beatmap/wrapper/chain';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent';
import { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { FxEventBoxGroup } from './fxEventBoxGroup';
import { FxEventsCollection } from './fxEventsCollection';

/** Difficulty beatmap v3 class object. */
export class Difficulty extends WrapDifficulty<IDifficulty> {
   version: Required<IDifficulty>['version'];
   bpmEvents: BPMEvent[];
   rotationEvents: RotationEvent[];
   colorNotes: ColorNote[];
   bombNotes: BombNote[];
   obstacles: Obstacle[];
   arcs: Arc[];
   chains: Chain[];
   waypoints: Waypoint[];
   basicEvents: BasicEvent[];
   colorBoostEvents: ColorBoostEvent[];
   lightColorEventBoxGroups: LightColorEventBoxGroup[];
   lightRotationEventBoxGroups: LightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: LightTranslationEventBoxGroup[];
   fxEventBoxGroups: FxEventBoxGroup[];
   eventTypesWithKeywords: BasicEventTypesWithKeywords;
   fxEventsCollection: FxEventsCollection;
   useNormalEventsAsCompatibleEvents;

   constructor(data: Partial<IDifficulty> = {}) {
      super();

      this.version = '3.3.0';
      this.bpmEvents = (data.bpmEvents ?? []).map((obj) => new BPMEvent(obj));
      this.rotationEvents = (data.rotationEvents ?? []).map((obj) => new RotationEvent(obj));
      this.colorNotes = (data.colorNotes ?? []).map((obj) => new ColorNote(obj));
      this.bombNotes = (data.bombNotes ?? []).map((obj) => new BombNote(obj));
      this.obstacles = (data.obstacles ?? []).map((obj) => new Obstacle(obj));
      this.arcs = (data.sliders ?? []).map((obj) => new Arc(obj));
      this.chains = (data.burstSliders ?? []).map((obj) => new Chain(obj));
      this.waypoints = (data.waypoints ?? []).map((obj) => new Waypoint(obj));
      this.basicEvents = (data.basicBeatmapEvents ?? []).map((obj) => new BasicEvent(obj));
      this.colorBoostEvents = (data.colorBoostBeatmapEvents ?? []).map(
         (obj) => new ColorBoostEvent(obj),
      );
      this.lightColorEventBoxGroups = (data.lightColorEventBoxGroups ?? []).map(
         (obj) => new LightColorEventBoxGroup(obj),
      );
      this.lightRotationEventBoxGroups = (data.lightRotationEventBoxGroups ?? []).map(
         (obj) => new LightRotationEventBoxGroup(obj),
      );
      this.lightTranslationEventBoxGroups = (data.lightTranslationEventBoxGroups ?? []).map(
         (obj) => new LightTranslationEventBoxGroup(obj),
      );
      this.fxEventBoxGroups = (data.vfxEventBoxGroups ?? []).map((obj) => new FxEventBoxGroup(obj));
      this.eventTypesWithKeywords = new BasicEventTypesWithKeywords(
         data.basicEventTypesWithKeywords ?? {
            d: [],
         },
      );
      this.fxEventsCollection = new FxEventsCollection(
         data._fxEventsCollection ?? {
            _fl: [],
            _il: [],
         },
      );
      this.useNormalEventsAsCompatibleEvents = data.useNormalEventsAsCompatibleEvents ?? false;
      this.customData = deepCopy(data.customData ?? {});
   }

   static create(data: Partial<IDifficulty> = {}): Difficulty {
      return new this(data);
   }

   toJSON(): Required<IDifficulty> {
      return {
         version: '3.3.0',
         bpmEvents: this.bpmEvents.map((obj) => obj.toJSON()),
         rotationEvents: this.rotationEvents.map((obj) => obj.toJSON()),
         colorNotes: this.colorNotes.map((obj) => obj.toJSON()),
         bombNotes: this.bombNotes.map((obj) => obj.toJSON()),
         obstacles: this.obstacles.map((obj) => obj.toJSON()),
         sliders: this.arcs.map((obj) => obj.toJSON()),
         burstSliders: this.chains.map((obj) => obj.toJSON()),
         waypoints: this.waypoints.map((obj) => obj.toJSON()),
         basicBeatmapEvents: this.basicEvents.map((obj) => obj.toJSON()),
         colorBoostBeatmapEvents: this.colorBoostEvents.map((obj) => obj.toJSON()),
         lightColorEventBoxGroups: this.lightColorEventBoxGroups.map((obj) => obj.toJSON()),
         lightRotationEventBoxGroups: this.lightRotationEventBoxGroups.map((obj) => obj.toJSON()),
         lightTranslationEventBoxGroups: this.lightTranslationEventBoxGroups.map((obj) =>
            obj.toJSON(),
         ),
         vfxEventBoxGroups: this.fxEventBoxGroups.map((obj) => obj.toJSON()),
         basicEventTypesWithKeywords: this.eventTypesWithKeywords.toJSON(),
         _fxEventsCollection: this.fxEventsCollection.toJSON(),
         useNormalEventsAsCompatibleEvents: this.useNormalEventsAsCompatibleEvents,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IDifficulty['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IDifficulty['customData']>) {
      this._customData = value;
   }

   reparse(keepRef?: boolean): this {
      this.colorNotes = this.colorNotes.map((obj) => this.createOrKeep(ColorNote, obj, keepRef));
      this.bombNotes = this.bombNotes.map((obj) => this.createOrKeep(BombNote, obj, keepRef));
      this.arcs = this.arcs.map((obj) => this.createOrKeep(Arc, obj, keepRef));
      this.chains = this.chains.map((obj) => this.createOrKeep(Chain, obj, keepRef));
      this.obstacles = this.obstacles.map((obj) => this.createOrKeep(Obstacle, obj, keepRef));
      this.basicEvents = this.basicEvents.map((obj) => this.createOrKeep(BasicEvent, obj, keepRef));
      this.colorBoostEvents = this.colorBoostEvents.map((obj) =>
         this.createOrKeep(ColorBoostEvent, obj, keepRef),
      );
      this.rotationEvents = this.rotationEvents.map((obj) =>
         this.createOrKeep(RotationEvent, obj, keepRef),
      );
      this.bpmEvents = this.bpmEvents.map((obj) => this.createOrKeep(BPMEvent, obj, keepRef));
      this.waypoints = this.waypoints.map((obj) => this.createOrKeep(Waypoint, obj, keepRef));
      this.eventTypesWithKeywords = new BasicEventTypesWithKeywords(this.eventTypesWithKeywords);
      this.fxEventsCollection = new FxEventsCollection(this.fxEventsCollection);

      return this;
   }

   addBpmEvents(...data: Partial<IWrapBPMEventAttribute<IBPMEvent>>[]): void;
   addBpmEvents(...data: Partial<IBPMEvent>[]): void;
   addBpmEvents(...data: (Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>>)[]): void;
   addBpmEvents(
      ...data: (Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>>)[]
   ): void {
      for (const obj of data) this.bpmEvents.push(new BPMEvent(obj));
   }

   addRotationEvents(...data: Partial<IWrapRotationEventAttribute<IRotationEvent>>[]): void;
   addRotationEvents(...data: Partial<IRotationEvent>[]): void;
   addRotationEvents(
      ...data: (Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>>)[]
   ): void;
   addRotationEvents(
      ...data: (Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>>)[]
   ): void {
      for (const obj of data) this.rotationEvents.push(new RotationEvent(obj));
   }

   addColorNotes(...data: Partial<IWrapColorNoteAttribute<IColorNote>>[]): void;
   addColorNotes(...data: Partial<IColorNote>[]): void;
   addColorNotes(
      ...data: (Partial<IColorNote> & Partial<IWrapColorNoteAttribute<IColorNote>>)[]
   ): void;
   addColorNotes(
      ...data: (Partial<IColorNote> & Partial<IWrapColorNoteAttribute<IColorNote>>)[]
   ): void {
      for (const obj of data) this.colorNotes.push(new ColorNote(obj));
   }

   addBombNotes(...data: Partial<IWrapBombNoteAttribute<IBombNote>>[]): void;
   addBombNotes(...data: Partial<IBombNote>[]): void;
   addBombNotes(
      ...data: (Partial<IBombNote>[] & Partial<IWrapBombNoteAttribute<IBombNote>>)[]
   ): void;
   addBombNotes(
      ...data: (Partial<IBombNote>[] & Partial<IWrapBombNoteAttribute<IBombNote>>)[]
   ): void {
      for (const obj of data) this.bombNotes.push(new BombNote(obj));
   }

   addObstacles(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): void;
   addObstacles(...data: Partial<IObstacle>[]): void;
   addObstacles(...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]): void;
   addObstacles(
      ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]
   ): void {
      for (const obj of data) this.obstacles.push(new Obstacle(obj));
   }

   addArcs(...data: Partial<IWrapArcAttribute<IArc>>[]): void;
   addArcs(...data: Partial<IArc>[]): void;
   addArcs(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): void;
   addArcs(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): void {
      for (const obj of data) this.arcs.push(new Arc(obj));
   }

   addChains(...data: Partial<IWrapChainAttribute<IChain>>[]): void;
   addChains(...data: Partial<IChain>[]): void;
   addChains(...data: (Partial<IChain> & Partial<IWrapChainAttribute<IChain>>)[]): void;
   addChains(...data: (Partial<IChain> & Partial<IWrapChainAttribute<IChain>>)[]): void {
      for (const obj of data) this.chains.push(new Chain(obj));
   }

   addWaypoints(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): void;
   addWaypoints(...data: Partial<IWaypoint>[]): void;
   addWaypoints(...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]): void;
   addWaypoints(
      ...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]
   ): void {
      for (const obj of data) this.waypoints.push(new Waypoint(obj));
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IBasicEvent>>[]): void;
   addBasicEvents(...data: Partial<IBasicEvent>[]): void;
   addBasicEvents(
      ...data: (Partial<IBasicEvent>[] & Partial<IWrapEventAttribute<IBasicEvent>>)[]
   ): void;
   addBasicEvents(
      ...data: (Partial<IBasicEvent>[] & Partial<IWrapEventAttribute<IBasicEvent>>)[]
   ): void {
      for (const obj of data) this.basicEvents.push(new BasicEvent(obj));
   }

   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]): void;
   addColorBoostEvents(...data: Partial<IColorBoostEvent>[]): void;
   addColorBoostEvents(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): void;
   addColorBoostEvents(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): void {
      for (const obj of data) this.colorBoostEvents.push(new ColorBoostEvent(obj));
   }

   addLightColorEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorBase,
            IIndexFilter
         >
      >[]
   ): void;
   addLightColorEventBoxGroups(...data: DeepPartial<ILightColorEventBoxGroup>[]): void;
   addLightColorEventBoxGroups(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         >)[]
   ): void;
   addLightColorEventBoxGroups(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         >)[]
   ): void {
      for (const obj of data) this.lightColorEventBoxGroups.push(new LightColorEventBoxGroup(obj));
   }

   addLightRotationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationBase,
            IIndexFilter
         >
      >[]
   ): void;
   addLightRotationEventBoxGroups(...data: DeepPartial<ILightRotationEventBoxGroup>[]): void;
   addLightRotationEventBoxGroups(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         >)[]
   ): void;
   addLightRotationEventBoxGroups(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         >)[]
   ): void {
      for (const obj of data) {
         this.lightRotationEventBoxGroups.push(new LightRotationEventBoxGroup(obj));
      }
   }

   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            ILightTranslationEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationBase,
            IIndexFilter
         >
      >[]
   ): void;
   addLightTranslationEventBoxGroups(...data: DeepPartial<ILightTranslationEventBoxGroup>[]): void;
   addLightTranslationEventBoxGroups(
      ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
         DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
               ILightTranslationEventBoxGroup,
               ILightTranslationEventBox,
               ILightTranslationBase,
               IIndexFilter
            >
         >)[]
   ): void;
   addLightTranslationEventBoxGroups(
      ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
         DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
               ILightTranslationEventBoxGroup,
               ILightTranslationEventBox,
               ILightTranslationBase,
               IIndexFilter
            >
         >)[]
   ): void {
      for (const obj of data) {
         this.lightTranslationEventBoxGroups.push(new LightTranslationEventBoxGroup(obj));
      }
   }

   addFxEventBoxGroups(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>
      >[]
   ): void;
   addFxEventBoxGroups(...data: DeepPartial<IFxEventBoxGroup>[]): void;
   addFxEventBoxGroups(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>)[]
   ): void;
   addFxEventBoxGroups(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>)[]
   ): void {
      for (const obj of data) {
         this.fxEventBoxGroups.push(new FxEventBoxGroup(obj));
      }
   }

   isValid(): boolean {
      return (
         this.colorNotes.every((obj) => this.checkClass(ColorNote, obj)) ||
            this.bombNotes.every((obj) => this.checkClass(BombNote, obj)) ||
            this.arcs.every((obj) => this.checkClass(Arc, obj)) ||
            this.chains.every((obj) => this.checkClass(Chain, obj)) ||
            this.obstacles.every((obj) => this.checkClass(Obstacle, obj)) ||
            this.basicEvents.every((obj) => this.checkClass(BasicEvent, obj)) ||
            this.colorBoostEvents.every((obj) => this.checkClass(ColorBoostEvent, obj)) ||
            this.rotationEvents.every((obj) => this.checkClass(RotationEvent, obj)) ||
            this.bpmEvents.every((obj) => this.checkClass(BPMEvent, obj)) ||
            this.waypoints.every((obj) => this.checkClass(Waypoint, obj)) ||
            this.lightColorEventBoxGroups.every((obj) =>
               this.checkClass(LightColorEventBoxGroup, obj),
            ) ||
            this.lightRotationEventBoxGroups.every((obj) =>
               this.checkClass(LightRotationEventBoxGroup, obj),
            ) ||
            this.lightTranslationEventBoxGroups.every((obj) =>
               this.checkClass(LightTranslationEventBoxGroup, obj),
            ) ||
            this.fxEventBoxGroups.every((obj) => this.checkClass(FxEventBoxGroup, obj)) ||
            this.eventTypesWithKeywords instanceof BasicEventTypesWithKeywords,
         this.fxEventsCollection instanceof FxEventsCollection
      );
   }
}
