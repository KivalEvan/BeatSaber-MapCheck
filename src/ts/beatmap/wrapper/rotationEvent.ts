import { WrapBaseObject } from './baseObject';
import { IWrapRotationEvent } from '../../types/beatmap/wrapper/rotationEvent';

/** Rotation event beatmap class object. */
export abstract class WrapRotationEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapRotationEvent<T>
{
   protected _executionTime!: IWrapRotationEvent['executionTime'];
   protected _rotation!: IWrapRotationEvent['rotation'];

   get executionTime(): IWrapRotationEvent['executionTime'] {
      return this._executionTime;
   }
   set executionTime(value: IWrapRotationEvent['executionTime']) {
      this._executionTime = value;
   }
   get rotation(): IWrapRotationEvent['rotation'] {
      return this._rotation;
   }
   set rotation(value: IWrapRotationEvent['rotation']) {
      this._rotation = value;
   }

   setExecutionTime(value: IWrapRotationEvent['executionTime']) {
      this.executionTime = value;
      return this;
   }
   setRotation(value: IWrapRotationEvent['rotation']) {
      this.rotation = value;
      return this;
   }

   isValid(): boolean {
      return this.executionTime === 0 || this.executionTime === 1;
   }
}
