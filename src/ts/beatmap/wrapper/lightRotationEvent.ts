import type { IWrapLightRotationEvent } from '../../types/beatmap/wrapper/lightRotationEvent.ts';
import { WrapBaseObject } from './baseObject.ts';

/** Light rotation base beatmap class object. */
export abstract class WrapLightRotationEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapLightRotationEvent<T>
{
   protected _previous!: IWrapLightRotationEvent['previous'];
   protected _easing!: IWrapLightRotationEvent['easing'];
   protected _loop!: IWrapLightRotationEvent['loop'];
   protected _rotation!: IWrapLightRotationEvent['rotation'];
   protected _direction!: IWrapLightRotationEvent['direction'];

   get previous(): IWrapLightRotationEvent['previous'] {
      return this._previous;
   }
   set previous(value: IWrapLightRotationEvent['previous']) {
      this._previous = value;
   }
   get easing(): IWrapLightRotationEvent['easing'] {
      return this._easing;
   }
   set easing(value: IWrapLightRotationEvent['easing']) {
      this._easing = value;
   }
   get loop(): IWrapLightRotationEvent['loop'] {
      return this._loop;
   }
   set loop(value: IWrapLightRotationEvent['loop']) {
      this._loop = value;
   }
   get rotation(): IWrapLightRotationEvent['rotation'] {
      return this._rotation;
   }
   set rotation(value: IWrapLightRotationEvent['rotation']) {
      this._rotation = value;
   }
   get direction(): IWrapLightRotationEvent['direction'] {
      return this._direction;
   }
   set direction(value: IWrapLightRotationEvent['direction']) {
      this._direction = value;
   }

   setPrevious(value: IWrapLightRotationEvent['previous']): this {
      this.previous = value;
      return this;
   }
   setEasing(value: IWrapLightRotationEvent['easing']): this {
      this.easing = value;
      return this;
   }
   setLoop(value: IWrapLightRotationEvent['loop']): this {
      this.loop = value;
      return this;
   }
   setRotation(value: IWrapLightRotationEvent['rotation']): this {
      this.rotation = value;
      return this;
   }
   setDirection(value: IWrapLightRotationEvent['direction']): this {
      this.direction = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.previous === 0 || this.previous === 1) &&
         this.easing >= -1 &&
         this.easing <= 103 &&
         (this.loop === 0 || this.loop === 1) &&
         this.direction >= 0 &&
         this.direction <= 2
      );
   }
}
