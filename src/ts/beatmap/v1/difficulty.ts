import type { IDifficulty } from '../../types/beatmap/v1/difficulty.ts';
import { Note } from './note.ts';
import { Obstacle } from './obstacle.ts';
import { Event } from './event.ts';
import type { INote } from '../../types/beatmap/v1/note.ts';
import type { IObstacle } from '../../types/beatmap/v1/obstacle.ts';
import type { IEvent } from '../../types/beatmap/v1/event.ts';
import { WrapDifficulty } from '../wrapper/difficulty.ts';
import logger from '../../logger.ts';
import type { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import type { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import type { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent.ts';
import { SpecialEventsKeywordFilters } from './_specialEventsKeywordFilters.ts';
import type { IWrapDifficultyAttribute } from '../../types/beatmap/wrapper/difficulty.ts';
import type { IBookmark } from '../../types/beatmap/v2/custom/bookmark.ts';
import type { IBPMChangeOld } from '../../types/beatmap/v2/custom/bpmChange.ts';
import { mod } from '../../utils/math.ts';
import { EventValueLaneRotation } from '../shared/constants.ts';
import type { DeepPartial } from '../../types/utils.ts';

function tag(name: string): string[] {
   return ['beatmap', 'v1', 'difficulty', name];
}

/** Difficulty beatmap v1 class object. */
export class Difficulty extends WrapDifficulty<IDifficulty> {
   static default: Required<IDifficulty> = {
      _version: '1.5.0',
      _beatsPerMinute: 120,
      _beatsPerBar: 4,
      _shuffle: 0,
      _shufflePeriod: 0,
      _noteJumpSpeed: 0,
      _noteJumpStartBeatOffset: 0,
      _notes: [],
      _obstacles: [],
      _events: [],
      _time: 0,
      _BPMChanges: [],
      _bookmarks: [],
   };

   readonly version = '1.5.0';
   bpmEvents: never[] = [];
   rotationEvents: never[] = [];
   colorNotes: Note[] = [];
   bombNotes: never[] = [];
   obstacles: Obstacle[] = [];
   arcs: never[] = [];
   chains: never[] = [];
   waypoints: never[] = [];
   basicEvents: Event[] = [];
   colorBoostEvents: never[] = [];
   lightColorEventBoxGroups: never[] = [];
   lightRotationEventBoxGroups: never[] = [];
   lightTranslationEventBoxGroups: never[] = [];
   fxEventBoxGroups: never[] = [];
   eventTypesWithKeywords: SpecialEventsKeywordFilters = new SpecialEventsKeywordFilters();
   useNormalEventsAsCompatibleEvents = true;

   beatsPerMinute = Difficulty.default._beatsPerMinute;
   beatsPerBar = Difficulty.default._beatsPerBar;
   shuffle = Difficulty.default._shuffle;
   shufflePeriod = Difficulty.default._shufflePeriod;
   noteJumpSpeed = Difficulty.default._noteJumpSpeed;
   noteJumpStartBeatOffset = Difficulty.default._noteJumpStartBeatOffset;
   time = Difficulty.default._time;
   BPMChanges: Omit<IBPMChangeOld, '_BPM'>[] = Difficulty.default._BPMChanges;
   bookmarks: IBookmark[] = Difficulty.default._bookmarks;

   static create(data?: DeepPartial<IWrapDifficultyAttribute<IDifficulty>>): Difficulty {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data instanceof Difficulty) {
         this.beatsPerMinute = data.beatsPerMinute;
         this.beatsPerBar = data.beatsPerBar;
         this.shuffle = data.shuffle;
         this.shufflePeriod = data.shufflePeriod;
         this.noteJumpSpeed = data.noteJumpSpeed;
         this.noteJumpStartBeatOffset = data.noteJumpStartBeatOffset;
         this.time = data.time;
         this.BPMChanges = data.BPMChanges;
         this.bookmarks = data.bookmarks;
      }
      if (data.colorNotes) {
         this.colorNotes = data.colorNotes.map((obj) => new Note(obj));
      } else {
         this.colorNotes = Difficulty.default._notes.map((json) => Note.fromJSON(json));
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
   }

   static fromJSON(data: DeepPartial<IDifficulty> = {}): Difficulty {
      const d = new this();
      d.beatsPerMinute = data._beatsPerMinute ?? Difficulty.default._beatsPerMinute;
      d.beatsPerBar = data._beatsPerBar ?? Difficulty.default._beatsPerBar;
      d.shuffle = data._shuffle ?? Difficulty.default._shuffle;
      d.shufflePeriod = data._shufflePeriod ?? Difficulty.default._shufflePeriod;
      d.noteJumpSpeed = data._noteJumpSpeed ?? Difficulty.default._noteJumpSpeed;
      d.noteJumpStartBeatOffset = data._noteJumpStartBeatOffset ?? 0;
      d.colorNotes = (data._notes ?? []).map((json) => Note.fromJSON(json));
      d.obstacles = (data._obstacles ?? []).map((json) => Obstacle.fromJSON(json));
      d.basicEvents = (data._events ?? []).map((json) => Event.fromJSON(json));
      d.time = data._time ?? Difficulty.default._time;
      d.BPMChanges = data._BPMChanges ?? Difficulty.default._BPMChanges;
      d.bookmarks = data._bookmarks ?? Difficulty.default._bookmarks;
      return d;
   }

   toJSON(): Required<IDifficulty> {
      return {
         _version: this.version,
         _beatsPerMinute: this.beatsPerMinute,
         _beatsPerBar: this.beatsPerBar,
         _shuffle: this.shuffle,
         _shufflePeriod: this.shufflePeriod,
         _noteJumpSpeed: this.noteJumpSpeed,
         _noteJumpStartBeatOffset: this.noteJumpStartBeatOffset,
         _notes: this.colorNotes.map((obj) => obj.toJSON()),
         _obstacles: this.obstacles.map((obj) => obj.toJSON()),
         _events: this.basicEvents.map((obj) => obj.toJSON()),
         _time: this.time,
         _BPMChanges: this.BPMChanges,
         _bookmarks: this.bookmarks,
      };
   }

   get customData(): Record<string, never> {
      return {};
   }
   set customData(_: Record<string, never>) {
      logger.tWarn(tag('customData'), 'Custom data does not exist in beatmap V1');
   }

   reparse(keepRef?: boolean): this {
      this.colorNotes = this.colorNotes.map((obj) => this.createOrKeep(Note, obj, keepRef));
      this.obstacles = this.obstacles.map((obj) => this.createOrKeep(Obstacle, obj, keepRef));
      this.basicEvents = this.basicEvents.map((obj) => this.createOrKeep(Event, obj, keepRef));

      return this;
   }

   addBpmEvents(..._: never[]): this {
      logger.tWarn(tag('addBpmEvents'), 'BPM Event does not exist in beatmap V1');
      return this;
   }

   addRotationEvents(...data: Partial<IWrapRotationEventAttribute<IEvent>>[]): this {
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

   addArcs(..._: never[]): this {
      logger.tWarn(tag('addArcs'), 'Arc does not exist in beatmap V1');
      return this;
   }

   addChains(..._: never[]): this {
      logger.tWarn(tag('addChains'), 'Chain does not exist in beatmap V1');
      return this;
   }

   addWaypoints(..._: never[]): this {
      logger.tWarn(tag('addWaypoints'), 'Waypoint does not exist in beatmap V1');
      return this;
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IEvent>>[]): this {
      for (const obj of data) this.basicEvents.push(new Event(obj));
      return this;
   }

   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute<IEvent>>[]): this {
      for (const obj of data) {
         this.basicEvents.push(new Event({ ...obj, value: obj.toggle ? 1 : 0 }));
      }
      return this;
   }

   addLightColorEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightColorEventBoxGroups'),
         'Light Color Event Box Group does not exist in beatmap V1',
      );
      return this;
   }

   addLightRotationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightRotationEventBoxGroups'),
         'Light Rotation Event Box Group does not exist in beatmap V1',
      );
      return this;
   }

   addLightTranslationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightTranslationEventBoxGroups'),
         'Light Translation Event Box Group does not exist in beatmap V1',
      );
      return this;
   }

   addFxEventBoxGroups(..._: never[]): this {
      logger.tWarn(tag('addFxEventBoxGroups'), 'FX Event Box Group does not exist in beatmap V1');
      return this;
   }

   isValid(): boolean {
      return (
         this.colorNotes.every((obj) => this.checkClass(Note, obj)) &&
         this.obstacles.every((obj) => this.checkClass(Obstacle, obj)) &&
         this.basicEvents.every((obj) => this.checkClass(Event, obj))
      );
   }
}
