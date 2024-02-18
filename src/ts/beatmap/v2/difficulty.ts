import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Note } from './note';
import { Arc } from './arc';
import { Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';
import { SpecialEventsKeywordFilters } from './specialEventsKeywordFilters';
import { deepCopy } from '../../utils/misc';
import { INote } from '../../types/beatmap/v2/note';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import {
   IEvent,
   IEventBoost,
   IEventBPMChange,
   IEventLaneRotation,
} from '../../types/beatmap/v2/event';
import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { IArc } from '../../types/beatmap/v2/arc';
import { WrapDifficulty } from '../wrapper/difficulty';
import logger from '../../logger';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote';
import { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent';
import { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { mod } from '../../utils/math';
import { EventValueLaneRotation } from '../shared/constants';
import { IWrapDifficultyAttribute } from '../../types/beatmap/wrapper/difficulty';
import { DeepPartial } from '../../types/utils';

function tag(name: string): string[] {
   return ['beatmap', 'v2', 'difficulty', name];
}

/** Difficulty beatmap v2 class object. */
export class Difficulty extends WrapDifficulty<IDifficulty> {
   static default: Required<IDifficulty> = {
      _version: '2.6.0',
      _notes: [],
      _sliders: [],
      _obstacles: [],
      _events: [],
      _waypoints: [],
      _specialEventsKeywordFilters: {},
      _customData: {},
   };

   readonly version = '2.6.0';
   bpmEvents: never[] = [];
   rotationEvents: never[] = [];
   colorNotes: Note[];
   bombNotes: never[] = [];
   obstacles: Obstacle[];
   arcs: Arc[];
   chains: never[] = [];
   waypoints: Waypoint[];
   basicEvents: Event[];
   colorBoostEvents: never[] = [];
   lightColorEventBoxGroups: never[] = [];
   lightRotationEventBoxGroups: never[] = [];
   lightTranslationEventBoxGroups: never[] = [];
   fxEventBoxGroups: never[] = [];
   eventTypesWithKeywords: SpecialEventsKeywordFilters;
   useNormalEventsAsCompatibleEvents = true;

   static create(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}): Difficulty {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data.colorNotes) {
         this.colorNotes = data.colorNotes.map((obj) => new Note(obj));
      } else {
         this.colorNotes = Difficulty.default._notes.map((json) => Note.fromJSON(json));
      }
      if (data.arcs) this.arcs = data.arcs.map((obj) => new Arc(obj));
      else {
         this.arcs = Difficulty.default._sliders.map((json) => Arc.fromJSON(json));
      }
      if (data.obstacles) {
         this.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
      } else {
         this.obstacles = Difficulty.default._obstacles.map((json) => Obstacle.fromJSON(json));
      }
      if (data.basicEvents) {
         this.basicEvents = data.basicEvents.map((obj) => new Event(obj));
      } else {
         this.basicEvents = Difficulty.default._events.map((json) => Event.fromJSON(json));
      }
      if (data.waypoints) {
         this.waypoints = data.waypoints.map((obj) => new Waypoint(obj));
      } else {
         this.waypoints = Difficulty.default._waypoints.map((json) => Waypoint.fromJSON(json));
      }
      if (data.eventTypesWithKeywords) {
         this.eventTypesWithKeywords = new SpecialEventsKeywordFilters(data.eventTypesWithKeywords);
      } else {
         this.eventTypesWithKeywords = SpecialEventsKeywordFilters.fromJSON(
            Difficulty.default._specialEventsKeywordFilters,
         );
      }
      this.customData = deepCopy(data.customData ?? Difficulty.default._customData ?? {});
   }

   static fromJSON(data: DeepPartial<IDifficulty> = {}): Difficulty {
      const d = new this();
      d.colorNotes = (data._notes ?? Difficulty.default._notes).map((json) => Note.fromJSON(json));
      d.arcs = (data._sliders ?? Difficulty.default._sliders).map((json) => Arc.fromJSON(json));
      d.obstacles = (data._obstacles ?? Difficulty.default._obstacles).map((json) =>
         Obstacle.fromJSON(json),
      );
      d.basicEvents = (data._events ?? Difficulty.default._events).map((json) =>
         Event.fromJSON(json),
      );
      d.waypoints = (data._waypoints ?? Difficulty.default._waypoints).map((json) =>
         Waypoint.fromJSON(json),
      );
      d.eventTypesWithKeywords = SpecialEventsKeywordFilters.fromJSON(
         data._specialEventsKeywordFilters ?? Difficulty.default._specialEventsKeywordFilters,
      );
      d.customData = deepCopy(data._customData ?? Difficulty.default._customData);
      return d;
   }

   toJSON(): Required<IDifficulty> {
      return {
         _version: this.version,
         _notes: this.colorNotes.map((obj) => obj.toJSON()),
         _sliders: this.arcs.map((obj) => obj.toJSON()),
         _obstacles: this.obstacles.map((obj) => obj.toJSON()),
         _events: this.basicEvents.map((obj) => obj.toJSON()),
         _waypoints: this.waypoints.map((obj) => obj.toJSON()),
         _specialEventsKeywordFilters: this.eventTypesWithKeywords.toJSON(),
         _customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IDifficulty['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IDifficulty['_customData']>) {
      this._customData = value;
   }

   reparse(keepRef?: boolean): this {
      this.colorNotes = this.colorNotes.map((obj) => this.createOrKeep(Note, obj, keepRef));
      this.obstacles = this.obstacles.map((obj) => this.createOrKeep(Obstacle, obj, keepRef));
      this.basicEvents = this.basicEvents.map((obj) => this.createOrKeep(Event, obj, keepRef));
      this.waypoints = this.waypoints.map((obj) => this.createOrKeep(Waypoint, obj, keepRef));
      this.arcs = this.arcs.map((obj) => this.createOrKeep(Arc, obj, keepRef));
      this.eventTypesWithKeywords = new SpecialEventsKeywordFilters(this.eventTypesWithKeywords);

      return this;
   }

   addBpmEvents(
      ...data: (Partial<IEventBPMChange> & Partial<IWrapBPMEventAttribute<IEventBPMChange>>)[]
   ): this {
      for (const obj of data) {
         this.basicEvents.push(new Event({ ...obj, type: 100, value: obj.bpm }));
      }
      return this;
   }

   addRotationEvents(...data: Partial<IWrapRotationEventAttribute<IEventLaneRotation>>[]): this {
      for (const obj of data) {
         this.basicEvents.push(
            new Event({
               ...obj,
               type: obj.executionTime === 0 ? 14 : 15,
               value:
                  EventValueLaneRotation[(obj.rotation || 0) % 360] ??
                  mod(obj.rotation || 0, 360) + 1000,
            }),
         );
      }
      logger.tWarn(tag('addRotationEvents'), 'This may not work correctly');
      return this;
   }

   addColorNotes(...data: Partial<IWrapColorNoteAttribute<INote>>[]): this {
      for (const obj of data) this.colorNotes.push(new Note(obj));
      return this;
   }

   addBombNotes(...data: Partial<IWrapBombNoteAttribute<INote>>[]): this {
      for (const obj of data) {
         this.colorNotes.push(new Note({ ...obj, type: 3 }));
      }
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

   addChains(..._: never[]): this {
      logger.tWarn(tag('addChains'), 'Chain does not exist in beatmap V2');
      return this;
   }

   addWaypoints(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): this {
      for (const obj of data) this.waypoints.push(new Waypoint(obj));
      return this;
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IEvent>>[]): this {
      for (const obj of data) this.basicEvents.push(new Event(obj));
      return this;
   }

   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute<IEventBoost>>[]): this {
      for (const obj of data) {
         this.basicEvents.push(new Event({ ...obj, value: obj.toggle ? 1 : 0 }));
      }
      return this;
   }

   addLightColorEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightColorEventBoxGroups'),
         'Light Color Event Box Group does not exist in beatmap V2',
      );
      return this;
   }

   addLightRotationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightRotationEventBoxGroups'),
         'Light Rotation Event Box Group does not exist in beatmap V2',
      );
      return this;
   }

   addLightTranslationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightTranslationEventBoxGroups'),
         'Light Translation Event Box Group does not exist in beatmap V2',
      );
      return this;
   }

   addFxEventBoxGroups(..._: never[]): this {
      logger.tWarn(tag('addFxEventBoxGroups'), 'FX Event Box Group does not exist in beatmap V2');
      return this;
   }

   isValid(): boolean {
      return (
         this.colorNotes.every((obj) => this.checkClass(Note, obj)) &&
         this.obstacles.every((obj) => this.checkClass(Obstacle, obj)) &&
         this.basicEvents.every((obj) => this.checkClass(Event, obj)) &&
         this.waypoints.every((obj) => this.checkClass(Waypoint, obj)) &&
         this.arcs.every((obj) => this.checkClass(Arc, obj)) &&
         this.eventTypesWithKeywords instanceof SpecialEventsKeywordFilters
      );
   }
}
