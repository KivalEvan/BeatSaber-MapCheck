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
import { ILightColorEvent } from '../../types/beatmap/v3/lightColorEvent';
import { ILightRotationEvent } from '../../types/beatmap/v3/lightRotationEvent';
import { ILightTranslationEvent } from '../../types/beatmap/v3/lightTranslationEvent';
import { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { FxEventBoxGroup } from './fxEventBoxGroup';
import { IWrapDifficultyAttribute } from '../../types/beatmap/wrapper/difficulty';
import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';

/** Difficulty beatmap v3 class object. */
export class Difficulty extends WrapDifficulty<IDifficulty> {
   static default: Required<IDifficulty> = {
      version: '3.3.0',
      bpmEvents: [],
      rotationEvents: [],
      colorNotes: [],
      bombNotes: [],
      obstacles: [],
      sliders: [],
      burstSliders: [],
      waypoints: [],
      basicBeatmapEvents: [],
      colorBoostBeatmapEvents: [],
      lightColorEventBoxGroups: [],
      lightRotationEventBoxGroups: [],
      lightTranslationEventBoxGroups: [],
      vfxEventBoxGroups: [],
      _fxEventsCollection: { _fl: [], _il: [] },
      basicEventTypesWithKeywords: { ...BasicEventTypesWithKeywords.default },
      useNormalEventsAsCompatibleEvents: false,
      customData: {},
   };

   readonly version = '3.3.0';
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
   useNormalEventsAsCompatibleEvents;

   static create(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}): Difficulty {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data.bpmEvents) {
         this.bpmEvents = data.bpmEvents.map((obj) => new BPMEvent(obj));
      } else {
         this.bpmEvents = Difficulty.default.bpmEvents.map((json) => BPMEvent.fromJSON(json));
      }
      if (data.rotationEvents) {
         this.rotationEvents = data.rotationEvents.map((obj) => new RotationEvent(obj));
      } else {
         this.rotationEvents = Difficulty.default.rotationEvents.map((json) =>
            RotationEvent.fromJSON(json),
         );
      }
      if (data.colorNotes) {
         this.colorNotes = data.colorNotes.map((obj) => new ColorNote(obj));
      } else {
         this.colorNotes = Difficulty.default.colorNotes.map((json) => ColorNote.fromJSON(json));
      }
      if (data.bombNotes) {
         this.bombNotes = data.bombNotes.map((obj) => new BombNote(obj));
      } else {
         this.bombNotes = Difficulty.default.bombNotes.map((json) => BombNote.fromJSON(json));
      }
      if (data.obstacles) {
         this.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
      } else {
         this.obstacles = Difficulty.default.obstacles.map((json) => Obstacle.fromJSON(json));
      }
      if (data.arcs) this.arcs = data.arcs.map((obj) => new Arc(obj));
      else {
         this.arcs = Difficulty.default.sliders.map((json) => Arc.fromJSON(json));
      }
      if (data.chains) this.chains = data.chains.map((obj) => new Chain(obj));
      else {
         this.chains = Difficulty.default.burstSliders.map((json) => Chain.fromJSON(json));
      }
      if (data.waypoints) {
         this.waypoints = data.waypoints.map((obj) => new Waypoint(obj));
      } else {
         this.waypoints = Difficulty.default.waypoints.map((json) => Waypoint.fromJSON(json));
      }
      if (data.basicEvents) {
         this.basicEvents = data.basicEvents.map((obj) => new BasicEvent(obj));
      } else {
         this.basicEvents = Difficulty.default.basicBeatmapEvents.map((json) =>
            BasicEvent.fromJSON(json),
         );
      }
      if (data.colorBoostEvents) {
         this.colorBoostEvents = data.colorBoostEvents.map((obj) => new ColorBoostEvent(obj));
      } else {
         this.colorBoostEvents = Difficulty.default.colorBoostBeatmapEvents.map((json) =>
            ColorBoostEvent.fromJSON(json),
         );
      }
      if (data.lightColorEventBoxGroups) {
         this.lightColorEventBoxGroups = data.lightColorEventBoxGroups.map(
            (obj) => new LightColorEventBoxGroup(obj),
         );
      } else {
         this.lightColorEventBoxGroups = Difficulty.default.lightColorEventBoxGroups.map((json) =>
            LightColorEventBoxGroup.fromJSON(json),
         );
      }
      if (data.lightRotationEventBoxGroups) {
         this.lightRotationEventBoxGroups = data.lightRotationEventBoxGroups.map(
            (obj) => new LightRotationEventBoxGroup(obj),
         );
      } else {
         this.lightRotationEventBoxGroups = Difficulty.default.lightRotationEventBoxGroups.map(
            (json) => LightRotationEventBoxGroup.fromJSON(json),
         );
      }
      if (data.lightTranslationEventBoxGroups) {
         this.lightTranslationEventBoxGroups = data.lightTranslationEventBoxGroups.map(
            (obj) => new LightTranslationEventBoxGroup(obj),
         );
      } else {
         this.lightTranslationEventBoxGroups =
            Difficulty.default.lightTranslationEventBoxGroups.map((json) =>
               LightTranslationEventBoxGroup.fromJSON(json),
            );
      }
      if (data.fxEventBoxGroups) {
         this.fxEventBoxGroups = data.fxEventBoxGroups.map((obj) => new FxEventBoxGroup(obj));
      } else {
         this.fxEventBoxGroups = Difficulty.default.vfxEventBoxGroups.map((json) =>
            FxEventBoxGroup.fromJSON(json),
         );
      }
      if (data.eventTypesWithKeywords) {
         this.eventTypesWithKeywords = new BasicEventTypesWithKeywords(data.eventTypesWithKeywords);
      } else {
         this.eventTypesWithKeywords = BasicEventTypesWithKeywords.fromJSON(
            Difficulty.default.basicEventTypesWithKeywords,
         );
      }
      this.useNormalEventsAsCompatibleEvents =
         data.useNormalEventsAsCompatibleEvents ??
         Difficulty.default.useNormalEventsAsCompatibleEvents;
      this.customData = deepCopy(data.customData ?? Difficulty.default.customData);
   }

   static fromJSON(data: DeepPartial<IDifficulty> = {}): Difficulty {
      const d = new this();
      d.bpmEvents = (data.bpmEvents ?? Difficulty.default.bpmEvents).map((obj) =>
         BPMEvent.fromJSON(obj),
      );
      d.rotationEvents = (data.rotationEvents ?? Difficulty.default.rotationEvents).map((obj) =>
         RotationEvent.fromJSON(obj),
      );
      d.colorNotes = (data.colorNotes ?? Difficulty.default.colorNotes).map((obj) =>
         ColorNote.fromJSON(obj),
      );
      d.bombNotes = (data.bombNotes ?? Difficulty.default.bombNotes).map((obj) =>
         BombNote.fromJSON(obj),
      );
      d.obstacles = (data.obstacles ?? Difficulty.default.obstacles).map((obj) =>
         Obstacle.fromJSON(obj),
      );
      d.arcs = (data.sliders ?? Difficulty.default.sliders).map((obj) => Arc.fromJSON(obj));
      d.chains = (data.burstSliders ?? Difficulty.default.burstSliders).map((obj) =>
         Chain.fromJSON(obj),
      );
      d.waypoints = (data.waypoints ?? Difficulty.default.waypoints).map((obj) =>
         Waypoint.fromJSON(obj),
      );
      d.basicEvents = (data.basicBeatmapEvents ?? Difficulty.default.basicBeatmapEvents).map(
         (obj) => BasicEvent.fromJSON(obj),
      );
      d.colorBoostEvents = (
         data.colorBoostBeatmapEvents ?? Difficulty.default.colorBoostBeatmapEvents
      ).map((obj) => ColorBoostEvent.fromJSON(obj));
      d.lightColorEventBoxGroups = (
         data.lightColorEventBoxGroups ?? Difficulty.default.lightColorEventBoxGroups
      ).map((obj) => LightColorEventBoxGroup.fromJSON(obj));
      d.lightRotationEventBoxGroups = (
         data.lightRotationEventBoxGroups ?? Difficulty.default.lightRotationEventBoxGroups
      ).map((obj) => LightRotationEventBoxGroup.fromJSON(obj));
      d.lightTranslationEventBoxGroups = (
         data.lightTranslationEventBoxGroups ?? Difficulty.default.lightTranslationEventBoxGroups
      ).map((obj) => LightTranslationEventBoxGroup.fromJSON(obj));
      d.fxEventBoxGroups = (data.vfxEventBoxGroups ?? Difficulty.default.vfxEventBoxGroups).map(
         (obj) =>
            FxEventBoxGroup.fromJSON(
               obj,
               data._fxEventsCollection?._fl ?? Difficulty.default._fxEventsCollection._fl,
            ),
      );
      d.eventTypesWithKeywords = BasicEventTypesWithKeywords.fromJSON(
         data.basicEventTypesWithKeywords ?? Difficulty.default.basicEventTypesWithKeywords,
      );
      d.useNormalEventsAsCompatibleEvents =
         data.useNormalEventsAsCompatibleEvents ??
         Difficulty.default.useNormalEventsAsCompatibleEvents;
      d.customData = deepCopy(data.customData ?? Difficulty.default.customData);
      return d;
   }

   toJSON(): Required<IDifficulty> {
      const json: Required<IDifficulty> = {
         version: this.version,
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
         vfxEventBoxGroups: [],
         basicEventTypesWithKeywords: this.eventTypesWithKeywords.toJSON(),
         _fxEventsCollection: {
            _fl: [],
            _il: [],
         },
         useNormalEventsAsCompatibleEvents: this.useNormalEventsAsCompatibleEvents,
         customData: deepCopy(this.customData),
      };
      for (const obj of this.fxEventBoxGroups.map((obj) => obj.toJSON())) {
         json.vfxEventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            obj.object.e!.push(box.data);
            for (const evt of box.eventData) {
               box.data.l!.push(json._fxEventsCollection._fl!.length);
               json._fxEventsCollection._fl!.push(evt);
            }
         }
      }

      return json;
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

      return this;
   }

   addBpmEvents(...data: Partial<IWrapBPMEventAttribute<IBPMEvent>>[]): this {
      for (const obj of data) this.bpmEvents.push(new BPMEvent(obj));
      return this;
   }

   addRotationEvents(...data: Partial<IWrapRotationEventAttribute<IRotationEvent>>[]): this {
      for (const obj of data) this.rotationEvents.push(new RotationEvent(obj));
      return this;
   }

   addColorNotes(...data: Partial<IWrapColorNoteAttribute<IColorNote>>[]): this {
      for (const obj of data) this.colorNotes.push(new ColorNote(obj));
      return this;
   }

   addBombNotes(...data: Partial<IWrapBombNoteAttribute<IBombNote>>[]): this {
      for (const obj of data) this.bombNotes.push(new BombNote(obj));
      return this;
   }

   addObstacles(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): this {
      for (const obj of data) this.obstacles.push(new Obstacle(obj));
      return this;
   }

   addArcs(...data: Partial<IWrapArcAttribute<IArc>>[]): this {
      for (const obj of data) this.arcs.push(new Arc(obj));
      return this;
   }

   addChains(...data: Partial<IWrapChainAttribute<IChain>>[]): this {
      for (const obj of data) this.chains.push(new Chain(obj));
      return this;
   }

   addWaypoints(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): this {
      for (const obj of data) this.waypoints.push(new Waypoint(obj));
      return this;
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IBasicEvent>>[]): this {
      for (const obj of data) this.basicEvents.push(new BasicEvent(obj));
      return this;
   }

   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]): this {
      for (const obj of data) {
         this.colorBoostEvents.push(new ColorBoostEvent(obj));
      }
      return this;
   }

   addLightColorEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightColorEventBoxGroups.push(new LightColorEventBoxGroup(obj));
      }
      return this;
   }

   addLightRotationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightRotationEventBoxGroups.push(new LightRotationEventBoxGroup(obj));
      }
      return this;
   }

   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            ILightTranslationEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightTranslationEventBoxGroups.push(new LightTranslationEventBoxGroup(obj));
      }
      return this;
   }

   addFxEventBoxGroups(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IFxEventFloat, IIndexFilter>
      >[]
   ): this {
      for (const obj of data) {
         this.fxEventBoxGroups.push(new FxEventBoxGroup(obj));
      }
      return this;
   }

   isValid(): boolean {
      return (
         this.colorNotes.every((obj) => this.checkClass(ColorNote, obj)) &&
         this.bombNotes.every((obj) => this.checkClass(BombNote, obj)) &&
         this.arcs.every((obj) => this.checkClass(Arc, obj)) &&
         this.chains.every((obj) => this.checkClass(Chain, obj)) &&
         this.obstacles.every((obj) => this.checkClass(Obstacle, obj)) &&
         this.basicEvents.every((obj) => this.checkClass(BasicEvent, obj)) &&
         this.colorBoostEvents.every((obj) => this.checkClass(ColorBoostEvent, obj)) &&
         this.rotationEvents.every((obj) => this.checkClass(RotationEvent, obj)) &&
         this.bpmEvents.every((obj) => this.checkClass(BPMEvent, obj)) &&
         this.waypoints.every((obj) => this.checkClass(Waypoint, obj)) &&
         this.lightColorEventBoxGroups.every((obj) =>
            this.checkClass(LightColorEventBoxGroup, obj),
         ) &&
         this.lightRotationEventBoxGroups.every((obj) =>
            this.checkClass(LightRotationEventBoxGroup, obj),
         ) &&
         this.lightTranslationEventBoxGroups.every((obj) =>
            this.checkClass(LightTranslationEventBoxGroup, obj),
         ) &&
         this.fxEventBoxGroups.every((obj) => this.checkClass(FxEventBoxGroup, obj)) &&
         this.eventTypesWithKeywords instanceof BasicEventTypesWithKeywords
      );
   }
}
