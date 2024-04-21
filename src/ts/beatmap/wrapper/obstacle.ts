import type { ModType } from '../../types/beatmap/shared/modCheck.ts';
import type { IWrapObstacle } from '../../types/beatmap/wrapper/obstacle.ts';
import type { Vector2 } from '../../types/vector.ts';
import { LINE_COUNT } from '../shared/constants.ts';
import { WrapGridObject } from './gridObject.ts';

/** Obstacle beatmap class object. */
export abstract class WrapObstacle<T extends { [P in keyof T]: T[P] }>
   extends WrapGridObject<T>
   implements IWrapObstacle<T>
{
   protected _duration!: IWrapObstacle['duration'];
   protected _width!: IWrapObstacle['width'];
   protected _height!: IWrapObstacle['height'];

   get duration(): IWrapObstacle['duration'] {
      return this._duration;
   }
   set duration(value: IWrapObstacle['duration']) {
      this._duration = value;
   }
   get width(): IWrapObstacle['width'] {
      return this._width;
   }
   set width(value: IWrapObstacle['width']) {
      this._width = value;
   }
   get height(): IWrapObstacle['height'] {
      return this._height;
   }
   set height(value: IWrapObstacle['height']) {
      this._height = value;
   }

   setDuration(value: IWrapObstacle['duration']): this {
      this.duration = value;
      return this;
   }
   setWidth(value: IWrapObstacle['width']): this {
      this.width = value;
      return this;
   }
   setHeight(value: IWrapObstacle['height']): this {
      this.height = value;
      return this;
   }

   mirror(_flipAlt?: boolean, _flipNoodle?: boolean): this {
      this.posX = LINE_COUNT - 1 - (this.posX + this.width - 1);
      return this;
   }

   getPosition(_type?: ModType): Vector2 {
      return [this.posX - 2, this.posY - 0.5];
   }

   // FIXME: there are a lot more other variables
   isInteractive(_type?: ModType): boolean {
      return (
         (this.posX < 0 && this.width > 1 - this.posX) ||
         (this.posX === 0 && this.width > 1) ||
         this.posX === 1 ||
         this.posX === 2
      );
   }

   isLonger(compareTo: IWrapObstacle, prevOffset = 0, _type?: ModType): boolean {
      return this.time + this.duration > compareTo.time + compareTo.duration + prevOffset;
   }

   hasZero(): boolean {
      return this.duration === 0 || this.width === 0 || this.height === 0;
   }

   hasNegative(): boolean {
      return this.posY < 0 || this.duration < 0 || this.width < 0 || this.height < 0;
   }

   isValid(): boolean {
      return !this.isMappingExtensions() && !this.hasZero() && !this.hasNegative();
   }
}
