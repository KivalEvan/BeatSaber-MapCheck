import type { IDifficulty } from '../../types/beatmap/v4/difficulty.ts';
import { BombNote } from './bombNote.ts';
import { Chain } from './chain.ts';
import { ColorNote } from './colorNote.ts';
import { Obstacle } from './obstacle.ts';
import { Arc } from './arc.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapDifficulty } from '../wrapper/difficulty.ts';
import type { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapChainAttribute } from '../../types/beatmap/wrapper/chain.ts';
import type { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import type { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import logger from '../../logger.ts';
import { DummySpecialEventsKeywordFilters } from './_specialEventsKeywordFilters.ts';
import type {
   IBombNoteContainer,
   ISpawnRotationContainer,
} from '../../types/beatmap/container/v4.ts';
import type { IObstacleContainer } from '../../types/beatmap/container/v4.ts';
import type { IArcContainer } from '../../types/beatmap/container/v4.ts';
import type { IColorNoteContainer } from '../../types/beatmap/container/v4.ts';
import type { IChainContainer } from '../../types/beatmap/container/v4.ts';
import type { IWrapDifficultyAttribute } from '../../types/beatmap/wrapper/difficulty.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { SpawnRotation } from './rotationEvent.ts';
import type { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent.ts';

function tag(name: string): string[] {
   return ['beatmap', 'v4', 'difficulty', name];
}

/** Difficulty beatmap v4 class object. */
export class Difficulty extends WrapDifficulty<IDifficulty> {
   static default: DeepRequiredIgnore<IDifficulty, 'customData'> = {
      version: '4.0.0',
      colorNotes: [],
      bombNotes: [],
      obstacles: [],
      chains: [],
      arcs: [],
      spawnRotations: [],
      colorNotesData: [],
      bombNotesData: [],
      obstaclesData: [],
      chainsData: [],
      arcsData: [],
      spawnRotationsData: [],
      customData: {},
   };

   readonly version = '4.0.0';
   bpmEvents: never[] = [];
   rotationEvents: SpawnRotation[] = [];
   colorNotes: ColorNote[];
   bombNotes: BombNote[];
   obstacles: Obstacle[];
   arcs: Arc[];
   chains: Chain[];
   waypoints: never[] = [];
   basicEvents: never[] = [];
   colorBoostEvents: never[] = [];
   lightColorEventBoxGroups: never[] = [];
   lightRotationEventBoxGroups: never[] = [];
   lightTranslationEventBoxGroups: never[] = [];
   fxEventBoxGroups: never[] = [];
   eventTypesWithKeywords: DummySpecialEventsKeywordFilters =
      new DummySpecialEventsKeywordFilters();
   useNormalEventsAsCompatibleEvents = false;

   static create(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}): Difficulty {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapDifficultyAttribute<IDifficulty>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data.colorNotes) {
         this.colorNotes = data.colorNotes.map((obj) => new ColorNote(obj));
      } else {
         this.colorNotes = Difficulty.default.colorNotes.map((obj) =>
            ColorNote.fromJSON(obj, Difficulty.default?.colorNotesData?.[obj?.i || 0]),
         );
      }
      if (data.bombNotes) {
         this.bombNotes = data.bombNotes.map((obj) => new BombNote(obj));
      } else {
         this.bombNotes = Difficulty.default.bombNotes.map((obj) =>
            BombNote.fromJSON(obj, Difficulty.default?.bombNotesData?.[obj?.i || 0]),
         );
      }
      if (data.obstacles) {
         this.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
      } else {
         this.obstacles = Difficulty.default.obstacles.map((obj) =>
            Obstacle.fromJSON(obj, Difficulty.default?.obstaclesData?.[obj?.i || 0]),
         );
      }
      if (data.arcs) this.arcs = data.arcs.map((obj) => new Arc(obj));
      else {
         this.arcs = (Difficulty.default?.arcs ?? Difficulty.default.arcs).map((obj) =>
            Arc.fromJSON(
               obj,
               Difficulty.default?.arcsData?.[obj?.ai || 0],
               Difficulty.default?.colorNotesData?.[obj?.hi || 0],
               Difficulty.default?.colorNotesData?.[obj?.ti || 0],
            ),
         );
      }
      if (data.chains) this.chains = data.chains.map((obj) => new Chain(obj));
      else {
         this.chains = Difficulty.default.chains.map((obj) =>
            Chain.fromJSON(
               obj,
               Difficulty.default?.colorNotesData?.[obj?.i || 0],
               Difficulty.default?.chainsData?.[obj?.ci || 0],
            ),
         );
      }
      this.customData = deepCopy(data.customData ?? Difficulty.default.customData);
   }

   static fromJSON(data: DeepPartial<IDifficulty> = {}): Difficulty {
      const d = new this();
      d.colorNotes = (data?.colorNotes ?? Difficulty.default.colorNotes).map((obj) =>
         ColorNote.fromJSON(obj, data?.colorNotesData?.[obj?.i || 0]),
      );
      d.bombNotes = (data?.bombNotes ?? Difficulty.default.bombNotes).map((obj) =>
         BombNote.fromJSON(obj, data?.bombNotesData?.[obj?.i || 0]),
      );
      d.obstacles = (data?.obstacles ?? Difficulty.default.obstacles).map((obj) =>
         Obstacle.fromJSON(obj, data?.obstaclesData?.[obj?.i || 0]),
      );
      d.arcs = (data?.arcs ?? Difficulty.default.arcs).map((obj) =>
         Arc.fromJSON(
            obj,
            data?.arcsData?.[obj?.ai || 0],
            data?.colorNotesData?.[obj?.hi || 0],
            data?.colorNotesData?.[obj?.ti || 0],
         ),
      );
      d.chains = (data?.chains ?? Difficulty.default.chains).map((obj) =>
         Chain.fromJSON(obj, data?.colorNotesData?.[obj?.i || 0], data?.chainsData?.[obj?.ci || 0]),
      );
      d.customData = deepCopy(data?.customData ?? Difficulty.default.customData);
      return d;
   }

   toJSON(): Required<IDifficulty> {
      const json: Required<IDifficulty> = {
         version: this.version,
         colorNotes: [],
         bombNotes: [],
         obstacles: [],
         chains: [],
         arcs: [],
         spawnRotations: [],
         colorNotesData: [],
         bombNotesData: [],
         obstaclesData: [],
         chainsData: [],
         arcsData: [],
         spawnRotationsData: [],
         customData: deepCopy(this.customData),
      };
      for (const obj of this.colorNotes) {
         const jsonObj = obj.toJSON();
         json.colorNotes.push(jsonObj.object);
         jsonObj.object.i = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.data);
      }
      for (const obj of this.bombNotes) {
         const jsonObj = obj.toJSON();
         json.bombNotes.push(jsonObj.object);
         jsonObj.object.i = json.bombNotesData.length;
         json.bombNotesData.push(jsonObj.data);
      }
      for (const obj of this.obstacles) {
         const jsonObj = obj.toJSON();
         json.obstacles.push(jsonObj.object);
         jsonObj.object.i = json.obstaclesData.length;
         json.obstaclesData.push(jsonObj.data);
      }
      for (const obj of this.arcs) {
         const jsonObj = obj.toJSON();
         json.arcs.push(jsonObj.object);
         jsonObj.object.ai = json.arcsData.length;
         json.arcsData.push(jsonObj.data);
         jsonObj.object.hi = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.headData);
         jsonObj.object.ti = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.tailData);
      }
      for (const obj of this.chains) {
         const jsonObj = obj.toJSON();
         json.chains.push(jsonObj.object);
         jsonObj.object.i = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.data);
         jsonObj.object.ci = json.chainsData.length;
         json.chainsData.push(jsonObj.chainData);
      }
      for (const obj of this.rotationEvents) {
         const jsonObj = obj.toJSON();
         json.spawnRotations.push(jsonObj.object);
         jsonObj.object.i = json.spawnRotationsData.length;
         json.spawnRotationsData.push(jsonObj.data);
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

      return this;
   }

   addBpmEvents(..._: never[]): this {
      logger.tWarn(tag('addBpmEvents'), 'BPM Event does not exist in difficulty V4');
      return this;
   }

   addRotationEvents(
      ...data: Partial<IWrapRotationEventAttribute<ISpawnRotationContainer>>[]
   ): this {
      for (const obj of data) this.rotationEvents.push(new SpawnRotation(obj));
      return this;
   }

   addColorNotes(...data: Partial<IWrapColorNoteAttribute<IColorNoteContainer>>[]): this {
      for (const obj of data) this.colorNotes.push(new ColorNote(obj));
      return this;
   }

   addBombNotes(...data: Partial<IWrapBombNoteAttribute<IBombNoteContainer>>[]): this {
      for (const obj of data) this.bombNotes.push(new BombNote(obj));
      return this;
   }

   addObstacles(...data: Partial<IWrapObstacleAttribute<IObstacleContainer>>[]): this {
      for (const obj of data) this.obstacles.push(new Obstacle(obj));
      return this;
   }

   addArcs(...data: Partial<IWrapArcAttribute<IArcContainer>>[]): this {
      for (const obj of data) this.arcs.push(new Arc(obj));
      return this;
   }

   addChains(...data: Partial<IWrapChainAttribute<IChainContainer>>[]): this {
      for (const obj of data) this.chains.push(new Chain(obj));
      return this;
   }

   addWaypoints(..._: never[]): this {
      logger.tWarn(tag('addWaypoints'), 'Waypoint does not exist in difficulty V4');
      return this;
   }

   addBasicEvents(..._: never[]): this {
      logger.tWarn(tag('addBasicEvents'), 'Basic Event does not exist in difficulty V4');
      return this;
   }

   addColorBoostEvents(..._: never[]): this {
      logger.tWarn(tag('addColorBoostEvents'), 'Color Boost Event does not exist in difficulty V4');
      return this;
   }

   addLightColorEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightColorEventBoxGroups'),
         'Light Color Event Box Group does not exist in difficulty V4',
      );
      return this;
   }

   addLightRotationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightRotationEventBoxGroups'),
         'Light Rotation Event Box Group does not exist in difficulty V4',
      );
      return this;
   }

   addLightTranslationEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addLightTranslationEventBoxGroups'),
         'Light Translation Event Box Group does not exist in difficulty V4',
      );
      return this;
   }

   addFxEventBoxGroups(..._: never[]): this {
      logger.tWarn(
         tag('addFxEventBoxGroups'),
         'FX Event Box Group does not exist in difficulty V4',
      );
      return this;
   }

   isValid(): boolean {
      return (
         this.colorNotes.every((obj) => this.checkClass(ColorNote, obj)) &&
         this.bombNotes.every((obj) => this.checkClass(BombNote, obj)) &&
         this.arcs.every((obj) => this.checkClass(Arc, obj)) &&
         this.chains.every((obj) => this.checkClass(Chain, obj)) &&
         this.obstacles.every((obj) => this.checkClass(Obstacle, obj))
      );
   }
}
