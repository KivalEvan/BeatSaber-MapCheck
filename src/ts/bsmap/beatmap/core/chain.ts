import { BaseSlider } from './abstract/baseSlider.ts';
import type { IWrapChain, IWrapChainAttribute } from '../../types/beatmap/wrapper/chain.ts';
import { deepCopy } from '../../utils/misc.ts';

export class Chain extends BaseSlider implements IWrapChain {
   static defaultValue: IWrapChainAttribute = {
      time: 0,
      posX: 0,
      posY: 0,
      color: 0,
      direction: 0,
      laneRotation: 0,
      tailTime: 0,
      tailPosX: 0,
      tailPosY: 0,
      tailLaneRotation: 0,
      sliceCount: 0,
      squish: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapChainAttribute>[]): Chain[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapChainAttribute> = {}) {
      super();
      this.time = data.time ?? Chain.defaultValue.time;
      this.posX = data.posX ?? Chain.defaultValue.posX;
      this.posY = data.posY ?? Chain.defaultValue.posY;
      this.color = data.color ?? Chain.defaultValue.color;
      this.direction = data.direction ?? Chain.defaultValue.direction;
      this.laneRotation = data.laneRotation ?? Chain.defaultValue.laneRotation;
      this.tailTime = data.tailTime ?? Chain.defaultValue.tailTime;
      this.tailPosX = data.tailPosX ?? Chain.defaultValue.tailPosX;
      this.tailPosY = data.tailPosY ?? Chain.defaultValue.tailPosY;
      this.tailLaneRotation = data.tailLaneRotation ?? Chain.defaultValue.tailLaneRotation;
      this.sliceCount = data.sliceCount ?? Chain.defaultValue.sliceCount;
      this.squish = data.squish ?? Chain.defaultValue.squish;
      this.customData = deepCopy(data.customData ?? Chain.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              (!this.isInverse() ||
                 this.posY >= 0 ||
                 this.posY <= 2 ||
                 this.tailPosY >= 0 ||
                 this.tailPosY <= 2);
   }

   sliceCount: IWrapChain['sliceCount'];
   squish: IWrapChain['squish'];

   setSliceCount(value: this['sliceCount']): this {
      this.sliceCount = value;
      return this;
   }
   setSquish(value: this['squish']): this {
      this.squish = value;
      return this;
   }
}
