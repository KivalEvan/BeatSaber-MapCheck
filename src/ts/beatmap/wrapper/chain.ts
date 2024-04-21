import { WrapBaseSlider } from './baseSlider.ts';
import type { IWrapChain } from '../../types/beatmap/wrapper/chain.ts';

/**
 * Chain beatmap class object.
 *
 * Also known as chain.
 */
export abstract class WrapChain<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseSlider<T>
   implements IWrapChain<T>
{
   protected _sliceCount!: IWrapChain['sliceCount'];
   protected _squish!: IWrapChain['squish'];

   get sliceCount(): IWrapChain['sliceCount'] {
      return this._sliceCount;
   }
   set sliceCount(value: IWrapChain['sliceCount']) {
      this._sliceCount = value;
   }
   get squish(): IWrapChain['squish'] {
      return this._squish;
   }
   set squish(value: IWrapChain['squish']) {
      this._squish = value;
   }

   setSliceCount(value: IWrapChain['sliceCount']): this {
      this.sliceCount = value;
      return this;
   }
   setSquish(value: IWrapChain['squish']): this {
      this.squish = value;
      return this;
   }

   isMappingExtensions(): boolean {
      return (
         this.posY > 2 ||
         this.posY < 0 ||
         this.posX <= -1000 ||
         this.posX >= 1000 ||
         (this.direction >= 1000 && this.direction <= 1360)
      );
   }

   isValid(): boolean {
      return (
         !(
            this.isMappingExtensions() ||
            this.isInverse() ||
            this.posX < 0 ||
            this.posX > 3 ||
            this.tailPosX < 0 ||
            this.tailPosX > 3
         ) && !(this.posX === this.tailPosX && this.posY === this.tailPosY)
      );
   }
}
