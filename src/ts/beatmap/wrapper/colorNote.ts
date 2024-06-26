import { NoteDirectionAngle } from '../shared/constants.ts';
import type { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote.ts';
import { WrapBaseNote } from './baseNote.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';

/** Color note beatmap class object. */
export abstract class WrapColorNote<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseNote<T>
   implements IWrapColorNote<T>
{
   protected _type!: IWrapColorNote['type'];
   protected _angleOffset: IWrapColorNote['angleOffset'] = 0;

   get type(): IWrapColorNote['type'] {
      return this._type;
   }
   set type(value: IWrapColorNote['type']) {
      this._type = value;
   }
   get angleOffset(): IWrapColorNote['angleOffset'] {
      return this._angleOffset;
   }
   set angleOffset(value: IWrapColorNote['angleOffset']) {
      this._angleOffset = value;
   }

   setType(value: IWrapColorNote['type']): this {
      this.type = value;
      return this;
   }
   setAngleOffset(value: IWrapColorNote['angleOffset']): this {
      this.angleOffset = value;
      return this;
   }

   mirror(flipColor = true, _flipNoodle?: boolean): this {
      return super.mirror(flipColor);
   }

   isNote(): boolean {
      return this.type === 0 || this.type === 1;
   }

   isBomb(): boolean {
      return this.type === 3;
   }

   getAngle(_type?: ModType): number {
      return (
         (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) +
         this.angleOffset
      );
   }

   isMappingExtensions(): boolean {
      return (
         this.posX > 3 ||
         this.posX < 0 ||
         this.posY > 2 ||
         this.posY < 0 ||
         (this.direction >= 1000 && this.direction <= 1360) ||
         (this.direction >= 2000 && this.direction <= 2360)
      );
   }
}
