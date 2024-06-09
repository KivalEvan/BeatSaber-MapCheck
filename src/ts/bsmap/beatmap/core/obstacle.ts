import type { GetPositionFn, MirrorFn } from '../../types/beatmap/shared/functions.ts';
import type {
   IWrapObstacle,
   IWrapObstacleAttribute,
} from '../../types/beatmap/wrapper/obstacle.ts';
import type { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { LINE_COUNT } from '../shared/constants.ts';
import { GridObject } from './abstract/gridObject.ts';

export class Obstacle extends GridObject implements IWrapObstacle {
   static defaultValue: IWrapObstacleAttribute = {
      time: 0,
      posX: 0,
      posY: 0,
      width: 0,
      height: 0,
      duration: 0,
      laneRotation: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapObstacleAttribute>[]): Obstacle[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapObstacleAttribute> = {}) {
      super();
      this.time = data.time ?? Obstacle.defaultValue.time;
      this.posX = data.posX ?? Obstacle.defaultValue.posX;
      this.posY = data.posY ?? Obstacle.defaultValue.posY;
      this.width = data.width ?? Obstacle.defaultValue.width;
      this.height = data.height ?? Obstacle.defaultValue.height;
      this.duration = data.duration ?? Obstacle.defaultValue.duration;
      this.laneRotation = data.laneRotation ?? Obstacle.defaultValue.laneRotation;
      this.customData = deepCopy(data.customData ?? Obstacle.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && !this.hasZero() && !this.hasNegative();
   }

   duration: IWrapObstacle['duration'] = 0;
   width: IWrapObstacle['width'] = 0;
   height: IWrapObstacle['height'] = 0;

   setDuration(value: this['duration']): this {
      this.duration = value;
      return this;
   }
   setWidth(value: this['width']): this {
      this.width = value;
      return this;
   }
   setHeight(value: this['height']): this {
      this.height = value;
      return this;
   }

   mirror(_flipAlt?: boolean, fn?: MirrorFn<this>): this {
      fn?.(this);
      this.posX = LINE_COUNT - 1 - (this.posX + this.width - 1);
      return this;
   }

   getPosition(fn?: GetPositionFn<this>): Vector2 {
      return fn?.(this) ?? [this.posX - 2, this.posY - 0.5];
   }

   // FIXME: there are a lot more other variables
   isInteractive(): boolean {
      return (
         (this.posX < 0 && this.width > 1 - this.posX) ||
         (this.posX === 0 && this.width > 1) ||
         this.posX === 1 ||
         this.posX === 2
      );
   }

   isLonger(compareTo: IWrapObstacle, prevOffset = 0): boolean {
      return this.time + this.duration > compareTo.time + compareTo.duration + prevOffset;
   }

   hasZero(): boolean {
      return this.duration === 0 || this.width === 0 || this.height === 0;
   }

   hasNegative(): boolean {
      return this.posY < 0 || this.duration < 0 || this.width < 0 || this.height < 0;
   }
}
