import { WrapBaseObject } from './baseObject.ts';
import type { IWrapRotationEvent } from '../../types/beatmap/wrapper/rotationEvent.ts';

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

   setExecutionTime(value: IWrapRotationEvent['executionTime']): this {
      this.executionTime = value;
      return this;
   }
   setRotation(value: IWrapRotationEvent['rotation']): this {
      this.rotation = value;
      return this;
   }

   isValid(): boolean {
      return this.executionTime === 0 || this.executionTime === 1;
   }
}
