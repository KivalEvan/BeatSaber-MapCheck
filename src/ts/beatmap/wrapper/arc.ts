import { WrapBaseSlider } from './baseSlider.ts';
import { NoteDirectionAngle } from '../shared/constants.ts';
import type { IWrapArc } from '../../types/beatmap/wrapper/arc.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';

/**
 * Arc beatmap class object.
 *
 * Also known as arc.
 */
export abstract class WrapArc<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseSlider<T>
   implements IWrapArc<T>
{
   protected _lengthMultiplier!: IWrapArc['lengthMultiplier'];
   protected _tailLengthMultiplier!: IWrapArc['tailLengthMultiplier'];
   protected _tailDirection!: IWrapArc['tailDirection'];
   protected _midAnchor!: IWrapArc['midAnchor'];

   get lengthMultiplier(): IWrapArc['lengthMultiplier'] {
      return this._lengthMultiplier;
   }
   set lengthMultiplier(value: IWrapArc['lengthMultiplier']) {
      this._lengthMultiplier = value;
   }
   get tailLengthMultiplier(): IWrapArc['tailLengthMultiplier'] {
      return this._tailLengthMultiplier;
   }
   set tailLengthMultiplier(value: IWrapArc['tailLengthMultiplier']) {
      this._tailLengthMultiplier = value;
   }
   get tailDirection(): IWrapArc['tailDirection'] {
      return this._tailDirection;
   }
   set tailDirection(value: IWrapArc['tailDirection']) {
      this._tailDirection = value;
   }
   get midAnchor(): IWrapArc['midAnchor'] {
      return this._midAnchor;
   }
   set midAnchor(value: IWrapArc['midAnchor']) {
      this._midAnchor = value;
   }

   setLengthMultiplier(value: IWrapArc['lengthMultiplier']): this {
      this.lengthMultiplier = value;
      return this;
   }
   setTailLengthMultiplier(value: IWrapArc['tailLengthMultiplier']): this {
      this.tailLengthMultiplier = value;
      return this;
   }
   setTailDirection(value: IWrapArc['tailDirection']): this {
      this.tailDirection = value;
      return this;
   }
   setMidAnchor(value: IWrapArc['midAnchor']): this {
      this.midAnchor = value;
      return this;
   }

   mirror(flipColor = true, _flipNoodle?: boolean): this {
      switch (this.tailDirection) {
         case 2:
            this.tailDirection = 3;
            break;
         case 3:
            this.tailDirection = 2;
            break;
         case 6:
            this.tailDirection = 7;
            break;
         case 7:
            this.tailDirection = 6;
            break;
         case 4:
            this.tailDirection = 5;
            break;
         case 5:
            this.tailDirection = 4;
            break;
      }
      if (this.midAnchor) {
         this.midAnchor = this.midAnchor === 1 ? 2 : 1;
      }
      return super.mirror(flipColor);
   }

   getTailAngle(_type?: ModType): number {
      return NoteDirectionAngle[this.tailDirection as keyof typeof NoteDirectionAngle] || 0;
   }

   isMappingExtensions(): boolean {
      return (
         this.posY > 2 ||
         this.posY < 0 ||
         this.posX <= -1000 ||
         this.posX >= 1000 ||
         (this.direction >= 1000 && this.direction <= 1360) ||
         (this.tailDirection >= 1000 && this.tailDirection <= 1360)
      );
   }

   isValid(): boolean {
      return !(
         this.isMappingExtensions() ||
         this.isInverse() ||
         this.posX < 0 ||
         this.posX > 3 ||
         this.tailPosX < 0 ||
         this.tailPosX > 3 ||
         (this.posX === this.tailPosX && this.posY === this.tailPosY && this.time === this.tailTime)
      );
   }
}
