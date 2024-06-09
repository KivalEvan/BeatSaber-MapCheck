import { NoteDirectionAngle } from '../../shared/constants.ts';
import { GridObject } from './gridObject.ts';
import type { IWrapBaseNote } from '../../../types/beatmap/wrapper/baseNote.ts';
import type { GetAngleFn, MirrorFn } from '../../../types/beatmap/shared/functions.ts';

/** Color note beatmap class object. */
export abstract class BaseNote extends GridObject implements IWrapBaseNote {
   color: IWrapBaseNote['color'] = 0;
   direction: IWrapBaseNote['direction'] = 0;

   setColor(value: this['color']): this {
      this.color = value;
      return this;
   }
   setDirection(value: this['direction']): this {
      this.direction = value;
      return this;
   }

   mirror(flipColor = true, fn?: MirrorFn<this>): this {
      fn?.(this);
      if (flipColor) {
         this.color = ((1 + this.color) % 2) as typeof this.color;
      }
      switch (this.direction) {
         case 2:
            this.direction = 3;
            break;
         case 3:
            this.direction = 2;
            break;
         case 6:
            this.direction = 7;
            break;
         case 7:
            this.direction = 6;
            break;
         case 4:
            this.direction = 5;
            break;
         case 5:
            this.direction = 4;
            break;
      }
      return super.mirror(flipColor);
   }

   isRed(): boolean {
      return this.color === 0;
   }

   isBlue(): boolean {
      return this.color === 1;
   }

   getAngle(fn?: GetAngleFn<this>): number {
      return (
         fn?.(this) ?? (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0)
      );
   }

   isDouble(compareTo: IWrapBaseNote, tolerance = 0.01): boolean {
      return (
         compareTo.time > this.time - tolerance &&
         compareTo.time < this.time + tolerance &&
         this.color !== compareTo.color
      );
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && this.direction >= 0 && this.direction <= 8;
   }
}
