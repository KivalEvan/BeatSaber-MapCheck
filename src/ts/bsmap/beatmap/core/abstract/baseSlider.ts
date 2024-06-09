import { LINE_COUNT } from '../../shared/constants.ts';
import type { IWrapBaseSlider } from '../../../types/beatmap/wrapper/baseSlider.ts';
import { BaseNote } from './baseNote.ts';
import type { Vector2 } from '../../../types/vector.ts';
import type { GetPositionFn, MirrorFn } from '../../../types/beatmap/shared/functions.ts';

/** Base slider beatmap class object. */
export abstract class BaseSlider extends BaseNote implements IWrapBaseSlider {
   tailTime: IWrapBaseSlider['tailTime'] = 0;
   tailPosX: IWrapBaseSlider['tailPosX'] = 0;
   tailPosY: IWrapBaseSlider['tailPosY'] = 0;
   tailLaneRotation: IWrapBaseSlider['tailLaneRotation'] = 0;

   setTailTime(value: this['tailTime']): this {
      this.tailTime = value;
      return this;
   }
   setTailPosX(value: this['tailPosX']): this {
      this.tailPosX = value;
      return this;
   }
   setTailPosY(value: this['tailPosY']): this {
      this.tailPosY = value;
      return this;
   }
   setTailLaneRotation(value: this['tailLaneRotation']): this {
      this.tailLaneRotation = value;
      return this;
   }

   mirror(flipColor = true, fn?: MirrorFn<this>): this {
      fn?.(this);
      this.tailPosX = LINE_COUNT - 1 - this.tailPosX;
      return super.mirror(flipColor);
   }

   getTailPosition(fn?: GetPositionFn<this>): Vector2 {
      return fn?.(this) ?? [this.tailPosX - 2, this.tailPosY];
   }

   isInverse(): boolean {
      return this.time > this.tailTime;
   }
}
