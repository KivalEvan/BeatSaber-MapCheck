import { NoteDirectionAngle } from '../shared/constants.ts';
import { WrapGridObject } from './gridObject.ts';
import type { IWrapBaseNote } from '../../types/beatmap/wrapper/baseNote.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';

/** Color note beatmap class object. */
export abstract class WrapBaseNote<T extends { [P in keyof T]: T[P] }>
   extends WrapGridObject<T>
   implements IWrapBaseNote<T>
{
   protected _color!: IWrapBaseNote['color'];
   protected _direction!: IWrapBaseNote['direction'];

   get color(): IWrapBaseNote['color'] {
      return this._color;
   }
   set color(value: IWrapBaseNote['color']) {
      this._color = value;
   }
   get direction(): IWrapBaseNote['direction'] {
      return this._direction;
   }
   set direction(value: IWrapBaseNote['direction']) {
      this._direction = value;
   }

   setColor(value: IWrapBaseNote['color']): this {
      this.color = value;
      return this;
   }
   setDirection(value: IWrapBaseNote['direction']): this {
      this.direction = value;
      return this;
   }

   mirror(flipColor = true, _flipNoodle?: boolean): this {
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

   getAngle(_type?: ModType): number {
      return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
   }

   isDouble(compareTo: IWrapBaseNote, tolerance = 0.01): boolean {
      return (
         compareTo.time > this.time - tolerance &&
         compareTo.time < this.time + tolerance &&
         this.color !== compareTo.color
      );
   }

   isValidDirection(): boolean {
      return this.direction >= 0 && this.direction <= 8;
   }

   isValid(): boolean {
      return !this.isMappingExtensions() && this.isValidDirection();
   }
}
