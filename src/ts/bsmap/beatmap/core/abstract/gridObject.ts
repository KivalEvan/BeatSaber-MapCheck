import { BaseObject } from './baseObject.ts';
import type { IWrapGridObject } from '../../../types/beatmap/wrapper/gridObject.ts';
import { LINE_COUNT } from '../../shared/constants.ts';
import type { Vector2 } from '../../../types/vector.ts';
import type { GetPositionFn, MirrorFn } from '../../../types/beatmap/shared/functions.ts';

/** Beatmap grid class object. */
export abstract class GridObject extends BaseObject implements IWrapGridObject {
   posX: IWrapGridObject['posX'] = 0;
   posY: IWrapGridObject['posY'] = 0;
   laneRotation: IWrapGridObject['laneRotation'] = 0;

   setPosX(value: this['posX']): this {
      this.posX = value;
      return this;
   }
   setPosY(value: this['posY']): this {
      this.posY = value;
      return this;
   }
   setLaneRotation(value: this['laneRotation']): this {
      this.laneRotation = value;
      return this;
   }

   mirror(_flipAlt?: boolean, fn?: MirrorFn<this>): this {
      fn?.(this);
      this.posX = LINE_COUNT - 1 - this.posX;
      return this;
   }

   getPosition(fn?: GetPositionFn<this>): Vector2 {
      return fn?.(this) ?? [this.posX - 2, this.posY];
   }

   getDistance(compareTo: typeof this, fn?: GetPositionFn<this>): number;
   getDistance(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): number;
   getDistance(compareTo: typeof this, fn?: GetPositionFn<this>): number {
      const [nX1, nY1] = this.getPosition(fn);
      const [nX2, nY2] = compareTo.getPosition(fn);
      return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
   }

   isVertical(compareTo: typeof this, fn?: GetPositionFn<this>): boolean;
   isVertical(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
   isVertical(compareTo: typeof this, fn?: GetPositionFn<this>): boolean {
      const [nX1] = this.getPosition(fn);
      const [nX2] = compareTo.getPosition(fn);
      const d = nX1 - nX2;
      return d > -0.001 && d < 0.001;
   }

   isHorizontal(compareTo: typeof this, fn?: GetPositionFn<this>): boolean;
   isHorizontal(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
   isHorizontal(compareTo: typeof this, fn?: GetPositionFn<this>): boolean {
      const [_, nY1] = this.getPosition(fn);
      const [_2, nY2] = compareTo.getPosition(fn);
      const d = nY1 - nY2;
      return d > -0.001 && d < 0.001;
   }

   isDiagonal(compareTo: typeof this, fn?: GetPositionFn<this>): boolean;
   isDiagonal(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
   isDiagonal(compareTo: typeof this, fn?: GetPositionFn<this>): boolean {
      const [nX1, nY1] = this.getPosition(fn);
      const [nX2, nY2] = compareTo.getPosition(fn);
      const dX = Math.abs(nX1 - nX2);
      const dY = Math.abs(nY1 - nY2);
      return dX === dY;
   }

   isInline(compareTo: typeof this, lapping?: number | null, fn?: GetPositionFn<this>): boolean;
   isInline(
      compareTo: IWrapGridObject,
      lapping?: number | null,
      fn?: GetPositionFn<IWrapGridObject>,
   ): boolean;
   isInline(compareTo: typeof this, lapping?: number | null, fn?: GetPositionFn<this>): boolean {
      lapping ??= 0.5;
      return this.getDistance(compareTo, fn) <= lapping;
   }

   isAdjacent(compareTo: typeof this, fn?: GetPositionFn<this>): boolean;
   isAdjacent(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
   isAdjacent(compareTo: typeof this, fn?: GetPositionFn<this>): boolean {
      const d = this.getDistance(compareTo, fn);
      return d > 0.499 && d < 1.001;
   }

   isWindow(compareTo: typeof this, distance?: number | null, fn?: GetPositionFn<this>): boolean;
   isWindow(
      compareTo: IWrapGridObject,
      distance?: number | null,
      fn?: GetPositionFn<IWrapGridObject>,
   ): boolean;
   isWindow(compareTo: typeof this, distance?: number | null, fn?: GetPositionFn<this>): boolean {
      distance ??= 1.8;
      return this.getDistance(compareTo, fn) > distance;
   }

   isSlantedWindow(compareTo: typeof this, fn?: GetPositionFn<this>): boolean;
   isSlantedWindow(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
   isSlantedWindow(compareTo: typeof this, fn?: GetPositionFn<this>): boolean {
      return (
         this.isWindow(compareTo, null, fn) &&
         !this.isDiagonal(compareTo, fn) &&
         !this.isHorizontal(compareTo, fn) &&
         !this.isVertical(compareTo, fn)
      );
   }
}
