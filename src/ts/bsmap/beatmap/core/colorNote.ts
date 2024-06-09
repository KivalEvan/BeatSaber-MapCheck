import { NoteDirectionAngle } from '../shared/constants.ts';
import type {
   IWrapColorNote,
   IWrapColorNoteAttribute,
} from '../../types/beatmap/wrapper/colorNote.ts';
import { BaseNote } from './abstract/baseNote.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { GetAngleFn, MirrorFn } from '../../types/beatmap/shared/functions.ts';

export class ColorNote extends BaseNote implements IWrapColorNote {
   static defaultValue: IWrapColorNoteAttribute = {
      time: 0,
      posX: 0,
      posY: 0,
      color: 0,
      direction: 0,
      angleOffset: 0,
      laneRotation: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapColorNoteAttribute>[]): ColorNote[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapColorNoteAttribute> = {}) {
      super();
      this.time = data.time ?? ColorNote.defaultValue.time;
      this.posX = data.posX ?? ColorNote.defaultValue.posX;
      this.posY = data.posY ?? ColorNote.defaultValue.posY;
      this.color = data.color ?? ColorNote.defaultValue.color;
      this.direction = data.direction ?? ColorNote.defaultValue.direction;
      this.angleOffset = data.angleOffset ?? ColorNote.defaultValue.angleOffset;
      this.laneRotation = data.laneRotation ?? ColorNote.defaultValue.laneRotation;
      this.customData = deepCopy(data.customData ?? ColorNote.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              this.posX >= 0 &&
              this.posX <= 3 &&
              this.posY >= 0 &&
              this.posY <= 2 &&
              this.direction >= 0 &&
              this.direction <= 8;
   }

   angleOffset: IWrapColorNote['angleOffset'] = 0;

   setAngleOffset(value: this['angleOffset']): this {
      this.angleOffset = value;
      return this;
   }

   mirror(flipColor = true, fn?: MirrorFn<this>): this {
      fn?.(this);
      return super.mirror(flipColor);
   }

   getAngle(fn?: GetAngleFn<this>): number {
      return (
         fn?.(this) ??
         (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) +
            this.angleOffset
      );
   }
}
