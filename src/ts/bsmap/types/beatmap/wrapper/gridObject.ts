import type { Vector2 } from '../../vector.ts';
import type { GetPositionFn, MirrorFn } from '../shared/functions.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapGridObjectAttribute extends IWrapBaseObjectAttribute {
   /**
    * Position x `<int>` of base obj.
    * ```ts
    * 0 -> Outer Left
    * 1 -> Middle Left
    * 2 -> Middle Right
    * 3 -> Outer Right
    * ```
    *
    * **RANGE:** `0-3`
    */
   posX: number;
   /**
    * Position y `<int>` of base obj.
    * ```ts
    * 0 -> Bottom row
    * 1 -> Middle row
    * 2 -> Top row
    * ```
    *
    * **RANGE:** `0-2`
    */
   posY: number;
   laneRotation: number;
}

export interface IWrapGridObject extends IWrapBaseObject, IWrapGridObjectAttribute {
   setPosX(value: number): this;
   setPosY(value: number): this;
   setLaneRotation(value: number): this;

   /**
    * Mirror a grid object, apply alternative flip and Noodle Extensions if available.
    * ```ts
    * obj.mirror(false, optionalFn);
    * ```
    *
    * Alternative flip is true by default. This implementation is typically used to flip color of note.
    */
   mirror(flipAlt?: boolean | null, fn?: MirrorFn<this>): this;

   /**
    * Get object position and return the Beatwalls' position x and y value in tuple.
    * ```ts
    * const objPos = obj.getPosition(optionalFn);
    * ```
    */
   getPosition(fn?: GetPositionFn<this>): Vector2;

   /**
    * Get two objects and return the distance between two objects.
    * ```ts
    * if (obj.getDistance(objCompare, optionalFn)) {}
    * ```
    */
   getDistance(compareTo: this, fn?: GetPositionFn<this>): number;
   getDistance(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): number;

   /**
    * Compare two objects and return if the objects is in vertical alignment.
    * ```ts
    * if (obj.isVertical(objCompare, optionalFn)) {}
    * ```
    */
   isVertical(compareTo: this, fn?: GetPositionFn<this>): boolean;
   isVertical(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;

   /**
    * Compare two objects and return if the objects is in horizontal alignment.
    * ```ts
    * if (obj.isHorizontal(objCompare, optionalFn)) {}
    * ```
    */
   isHorizontal(compareTo: this, fn?: GetPositionFn<this>): boolean;
   isHorizontal(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;

   /**
    * Compare two objects and return if the objects is in diagonal alignment.
    * ```ts
    * if (obj.isDiagonal(objCompare, optionalFn)) {}
    * ```
    */
   isDiagonal(compareTo: this, fn?: GetPositionFn<this>): boolean;
   isDiagonal(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;

   /**
    * Compare two  objects and return if the  objects is an inline.
    * ```ts
    * if (obj.isInline(objCompare, optionalLapping, optionalFn)) {}
    * ```
    */
   isInline(compareTo: this, lapping?: number | null, fn?: GetPositionFn<this>): boolean;
   isInline(
      compareTo: IWrapGridObject,
      lapping?: number | null,
      fn?: GetPositionFn<IWrapGridObject>,
   ): boolean;

   /**
    * Compare two objects and return if the objects is adjacent.
    * ```ts
    * if (obj.isAdjacent(objCompare, optionalFn)) {}
    * ```
    */
   isAdjacent(compareTo: this, fn?: GetPositionFn<this>): boolean;
   isAdjacent(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;

   /**
    * Compare two objects and return if the objects is a window.
    * ```ts
    * if (obj.isWindow(objCompare, optionalDistance, optionalFn)) {}
    * ```
    */
   isWindow(compareTo: this, distance?: number | null, fn?: GetPositionFn<this>): boolean;
   isWindow(
      compareTo: IWrapGridObject,
      distance?: number | null,
      fn?: GetPositionFn<IWrapGridObject>,
   ): boolean;

   /**
    * Compare two objects and return if the objects is a slanted window.
    * ```ts
    * if (obj.isSlantedWindow(objCompare, distance, optionalFn)) {}
    * ```
    */
   isSlantedWindow(compareTo: this, fn?: GetPositionFn<this>): boolean;
   isSlantedWindow(compareTo: IWrapGridObject, fn?: GetPositionFn<IWrapGridObject>): boolean;
}
