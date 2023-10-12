import { IWrapLightRotationBase } from '../../types/beatmap/wrapper/lightRotationBase';
import { WrapBaseObject } from './baseObject';

/** Light rotation base beatmap class object. */
export abstract class WrapLightRotationBase<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapLightRotationBase<T>
{
   protected _previous!: IWrapLightRotationBase['previous'];
   protected _easing!: IWrapLightRotationBase['easing'];
   protected _loop!: IWrapLightRotationBase['loop'];
   protected _rotation!: IWrapLightRotationBase['rotation'];
   protected _direction!: IWrapLightRotationBase['direction'];

   get previous(): IWrapLightRotationBase['previous'] {
      return this._previous;
   }
   set previous(value: IWrapLightRotationBase['previous']) {
      this._previous = value;
   }
   get easing(): IWrapLightRotationBase['easing'] {
      return this._easing;
   }
   set easing(value: IWrapLightRotationBase['easing']) {
      this._easing = value;
   }
   get loop(): IWrapLightRotationBase['loop'] {
      return this._loop;
   }
   set loop(value: IWrapLightRotationBase['loop']) {
      this._loop = value;
   }
   get rotation(): IWrapLightRotationBase['rotation'] {
      return this._rotation;
   }
   set rotation(value: IWrapLightRotationBase['rotation']) {
      this._rotation = value;
   }
   get direction(): IWrapLightRotationBase['direction'] {
      return this._direction;
   }
   set direction(value: IWrapLightRotationBase['direction']) {
      this._direction = value;
   }

   setPrevious(value: IWrapLightRotationBase['previous']) {
      this.previous = value;
      return this;
   }
   setEasing(value: IWrapLightRotationBase['easing']) {
      this.easing = value;
      return this;
   }
   setLoop(value: IWrapLightRotationBase['loop']) {
      this.loop = value;
      return this;
   }
   setRotation(value: IWrapLightRotationBase['rotation']) {
      this.rotation = value;
      return this;
   }
   setDirection(value: IWrapLightRotationBase['direction']) {
      this.direction = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.previous === 0 || this.previous === 1) &&
         this.easing >= -1 &&
         this.easing <= 3 &&
         (this.loop === 0 || this.loop === 1) &&
         this.direction >= 0 &&
         this.direction <= 2
      );
   }
}
