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
   IWrapColorNote,
   IWrapColorNoteAttribute,
} from '../../types/beatmap/wrapper/colorNote.ts';
import type {
   IWrapObstacle,
   IWrapObstacleAttribute,
} from '../../types/beatmap/wrapper/obstacle.ts';
import type {
   IWrapRotationEvent,
   IWrapRotationEventAttribute,
} from '../../types/beatmap/wrapper/rotationEvent.ts';
import type { IWrapArc, IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { BaseItem } from './abstract/baseItem.ts';
import type {
   IWrapDifficulty,
   IWrapDifficultyAttribute,
} from '../../types/beatmap/wrapper/difficulty.ts';
import { sortNoteFn, sortObjectFn } from '../helpers/sort.ts';
import { BPMEvent } from './bpmEvent.ts';
import { RotationEvent } from './rotationEvent.ts';
import { ColorNote } from './colorNote.ts';
import { BombNote } from './bombNote.ts';
import { Obstacle } from './obstacle.ts';
import { Arc } from './arc.ts';
import { Chain } from './chain.ts';
import { deepCopy } from '../../utils/misc.ts';

export class Difficulty extends BaseItem implements IWrapDifficulty {
   static defaultValue: IWrapDifficultyAttribute = {
      bpmEvents: [],
      rotationEvents: [],
      colorNotes: [],
      bombNotes: [],
      obstacles: [],
      arcs: [],
      chains: [],
      customData: {},
   };

   static create(
      ...data: DeepPartialIgnore<IWrapDifficultyAttribute, 'customData'>[]
   ): Difficulty[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapDifficultyAttribute, 'customData'> = {}) {
      super();
      this.bpmEvents = (data.bpmEvents ?? Difficulty.defaultValue.bpmEvents).map(
         (e) => new BPMEvent(e),
      );
      this.rotationEvents = (data.rotationEvents ?? Difficulty.defaultValue.rotationEvents).map(
         (e) => new RotationEvent(e),
      );
      this.colorNotes = (data.colorNotes ?? Difficulty.defaultValue.colorNotes).map(
         (e) => new ColorNote(e),
      );
      this.bombNotes = (data.bombNotes ?? Difficulty.defaultValue.bombNotes).map(
         (e) => new BombNote(e),
      );
      this.obstacles = (data.obstacles ?? Difficulty.defaultValue.obstacles).map(
         (e) => new Obstacle(e),
      );
      this.arcs = (data.arcs ?? Difficulty.defaultValue.arcs).map((e) => new Arc(e));
      // shut the fuck up, ts, it's not that deep
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      this.chains = (data.chains ?? Difficulty.defaultValue.chains).map((e) => new Chain(e));
      this.customData = deepCopy(data.customData ?? Difficulty.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              this.bpmEvents.every((e) => e.isValid()) &&
              this.rotationEvents.every((e) => e.isValid()) &&
              this.colorNotes.every((e) => e.isValid()) &&
              this.bombNotes.every((e) => e.isValid()) &&
              this.obstacles.every((e) => e.isValid()) &&
              this.arcs.every((e) => e.isValid()) &&
              this.chains.every((e) => e.isValid());
   }

   bpmEvents: IWrapBPMEvent[];
   rotationEvents: IWrapRotationEvent[];
   colorNotes: IWrapColorNote[];
   bombNotes: IWrapBombNote[];
   obstacles: IWrapObstacle[];
   arcs: IWrapArc[];
   chains: IWrapChain[];

   sort(): this {
      this.bpmEvents.sort(sortObjectFn);
      this.rotationEvents.sort(sortObjectFn);
      this.colorNotes.sort(sortNoteFn);
      this.bombNotes.sort(sortNoteFn);
      this.obstacles.sort(sortObjectFn);
      this.arcs.sort(sortNoteFn);
      this.chains.sort(sortNoteFn);

      return this;
   }

   addBpmEvents(...data: DeepPartialIgnore<IWrapBPMEventAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.bpmEvents.push(new BPMEvent(d));
      }
      return this;
   }
   addRotationEvents(
      ...data: DeepPartialIgnore<IWrapRotationEventAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.rotationEvents.push(new RotationEvent(d));
      }
      return this;
   }
   addColorNotes(...data: DeepPartialIgnore<IWrapColorNoteAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.colorNotes.push(new ColorNote(d));
      }
      return this;
   }
   addBombNotes(...data: DeepPartialIgnore<IWrapBombNoteAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.bombNotes.push(new BombNote(d));
      }
      return this;
   }
   addObstacles(...data: DeepPartialIgnore<IWrapObstacleAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.obstacles.push(new Obstacle(d));
      }
      return this;
   }
   addArcs(...data: DeepPartialIgnore<IWrapArcAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.arcs.push(new Arc(d));
      }
      return this;
   }
   addChains(...data: DeepPartialIgnore<IWrapChainAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.chains.push(new Chain(d));
      }
      return this;
   }
}
