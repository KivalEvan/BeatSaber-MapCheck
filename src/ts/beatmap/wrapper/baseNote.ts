import { NoteDirectionAngle } from '../shared/constants';
import { WrapGridObject } from './gridObject';
import { IWrapBaseNote } from '../../types/beatmap/wrapper/baseNote';
import { ModType } from '../../types/beatmap/shared/modCheck';

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

   setColor(value: IWrapBaseNote['color']) {
      this.color = value;
      return this;
   }
   setDirection(value: IWrapBaseNote['direction']) {
      this.direction = value;
      return this;
   }

   mirror(flipColor = true, _flipNoodle?: boolean) {
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

   isRed() {
      return this.color === 0;
   }

   isBlue() {
      return this.color === 1;
   }

   getAngle(_type?: ModType) {
      return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
   }

   isDouble(compareTo: IWrapBaseNote, tolerance = 0.01) {
      return (
         compareTo.time > this.time - tolerance &&
         compareTo.time < this.time + tolerance &&
         this.color !== compareTo.color
      );
   }

   isValidDirection() {
      return this.direction >= 0 && this.direction <= 8;
   }

   isValid() {
      return !this.isMappingExtensions() && this.isValidDirection();
   }
}
