// deno-lint-ignore-file no-explicit-any
import type { Vector2 } from '../../vector.ts';
import type { ModType } from '../shared/modCheck.ts';
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapGridObjectAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObjectAttribute<T> {
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
   /** V4 only features. */
   // FIXME: warn non-v4
   laneRotation: number;
}

export interface IWrapGridObject<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapGridObjectAttribute<T> {
   setPosX(value: number): this;
   setPosY(value: number): this;
   setLaneRotation(value: number): this;

   /**
    * Mirror a grid object, apply alternative flip and Noodle Extensions if available.
    * ```ts
    * obj.mirror();
    * ```
    *
    * Alternative flip is true by default. This implementation is typically used to flip color of note.
    */
   mirror(flipAlt?: boolean, flipNoodle?: boolean): this;

   /**
    * Get object position and return the Beatwalls' position x and y value in tuple.
    * ```ts
    * const objPos = obj.getPosition();
    * ```
    */
   getPosition(type?: ModType): Vector2;

   /**
    * Get two objects and return the distance between two objects.
    * ```ts
    * if (obj.getDistance(objCompare)) {}
    * ```
    */
   getDistance(compareTo: IWrapGridObject, type?: ModType): number;

   /**
    * Compare two objects and return if the objects is in vertical alignment.
    * ```ts
    * if (obj.isVertical(objCompare)) {}
    * ```
    */
   isVertical(compareTo: IWrapGridObject, type?: ModType): boolean;

   /**
    * Compare two objects and return if the objects is in horizontal alignment.
    * ```ts
    * if (obj.isHorizontal(objCompare)) {}
    * ```
    */
   isHorizontal(compareTo: IWrapGridObject, type?: ModType): boolean;

   /**
    * Compare two objects and return if the objects is in diagonal alignment.
    * ```ts
    * if (obj.isDiagonal(objCompare)) {}
    * ```
    */
   isDiagonal(compareTo: IWrapGridObject, type?: ModType): boolean;

   /**
    * Compare two  objects and return if the  objects is an inline.
    * ```ts
    * if (obj.isInline(objCompare)) {}
    * ```
    */
   isInline(compareTo: IWrapGridObject, lapping?: number | null, type?: ModType): boolean;

   /**
    * Compare two objects and return if the objects is adjacent.
    * ```ts
    * if (obj.isAdjacent(objCompare)) {}
    * ```
    */
   isAdjacent(compareTo: IWrapGridObject, type?: ModType): boolean;

   /**
    * Compare two objects and return if the objects is a window.
    * ```ts
    * if (obj.isWindow(objCompare)) {}
    * ```
    */
   isWindow(compareTo: IWrapGridObject, distance?: number | null, type?: ModType): boolean;

   /**
    * Compare two objects and return if the objects is a slanted window.
    * ```ts
    * if (obj.isSlantedWindow(objCompare)) {}
    * ```
    */
   isSlantedWindow(compareTo: IWrapGridObject, type?: ModType): boolean;
}
