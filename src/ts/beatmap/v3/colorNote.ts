import type { IColorNote } from '../../types/beatmap/v3/colorNote.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapColorNote } from '../wrapper/colorNote.ts';
import type { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote.ts';
import { isVector3 } from '../../utils/vector.ts';
import type { Vector2 } from '../../types/vector.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';

/** Color note beatmap v3 class object. */
export class ColorNote extends WrapColorNote<IColorNote> {
   static default: Required<IColorNote> = {
      b: 0,
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      a: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapColorNoteAttribute<IColorNote>>[]): ColorNote[] {
      const result: ColorNote[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapColorNoteAttribute<IColorNote>> = {}) {
      super();
      this._time = data.time ?? ColorNote.default.b;
      this._posX = data.posX ?? ColorNote.default.x;
      this._posY = data.posY ?? ColorNote.default.y;
      this._color =
         data.color ??
         (data.type === 0 || data.type === 1 ? (data.type as 0) : ColorNote.default.c);
      this._direction = data.direction ?? ColorNote.default.d;
      this._angleOffset = data.angleOffset ?? ColorNote.default.a;
      this._customData = deepCopy(data.customData ?? ColorNote.default.customData);
   }

   static fromJSON(data: Partial<IColorNote> = {}): ColorNote {
      const d = new this();
      d._time = data.b ?? ColorNote.default.b;
      d._posX = data.x ?? ColorNote.default.x;
      d._posY = data.y ?? ColorNote.default.y;
      d._color = data.c ?? ColorNote.default.c;
      d._direction = data.d ?? ColorNote.default.d;
      d._angleOffset = data.a ?? ColorNote.default.a;
      d._customData = deepCopy(data.customData ?? ColorNote.default.customData);
      return d;
   }

   toJSON(): Required<IColorNote> {
      return {
         b: this.time,
         c: this.color,
         x: this.posX,
         y: this.posY,
         d: this.direction,
         a: this.angleOffset,
         customData: deepCopy(this.customData),
      };
   }

   get type(): Required<IColorNote>['c'] {
      return this._color;
   }
   set type(value: Required<IColorNote>['c']) {
      this._color = value;
   }

   get customData(): NonNullable<IColorNote['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IColorNote['customData']>) {
      this._customData = value;
   }

   mirror(flipColor = true, flipNoodle?: boolean): this {
      if (flipNoodle) {
         if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
         }
         if (this.customData.flip) {
            this.customData.flip[0] = -1 - this.customData.flip[0];
         }
         if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
               if (isVector3(this.customData.animation.definitePosition)) {
                  this.customData.animation.definitePosition[0] =
                     -this.customData.animation.definitePosition[0];
               } else {
                  this.customData.animation.definitePosition.forEach((dp) => {
                     if (Array.isArray(dp)) dp[0] = -dp[0];
                  });
               }
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
               if (isVector3(this.customData.animation.offsetPosition)) {
                  this.customData.animation.offsetPosition[0] =
                     -this.customData.animation.offsetPosition[0];
               } else {
                  this.customData.animation.offsetPosition.forEach((op) => {
                     if (Array.isArray(op)) op[0] = -op[0];
                  });
               }
            }
         }
      }
      return super.mirror(flipColor);
   }

   getPosition(type?: ModType): Vector2 {
      switch (type) {
         case 'vanilla':
            return super.getPosition();
         case 'ne':
            if (this.customData.coordinates) {
               return [this.customData.coordinates[0], this.customData.coordinates[1]];
            }
         /** falls through */
         case 'me':
         default:
            return [
               (this.posX <= -1000
                  ? this.posX / 1000 + 1
                  : this.posX >= 1000
                    ? this.posX / 1000 - 1
                    : this.posX) - 2,
               this.posY <= -1000
                  ? this.posY / 1000
                  : this.posY >= 1000
                    ? this.posY / 1000
                    : this.posY,
            ];
      }
   }

   getAngle(type?: ModType): number {
      switch (type) {
         case 'vanilla':
         case 'ne':
            return super.getAngle();
         /* falls through */
         case 'me':
         default:
            if (this.direction >= 1000) {
               return Math.abs(((this.direction % 1000) % 360) - 360);
            }
            return super.getAngle();
      }
   }

   isChroma(): boolean {
      return (
         Array.isArray(this.customData.color) ||
         typeof this.customData.spawnEffect === 'boolean' ||
         typeof this.customData.disableDebris === 'boolean'
      );
   }

   isNoodleExtensions(): boolean {
      return (
         Array.isArray(this.customData.animation) ||
         typeof this.customData.disableNoteGravity === 'boolean' ||
         typeof this.customData.disableNoteLook === 'boolean' ||
         typeof this.customData.disableBadCutDirection === 'boolean' ||
         typeof this.customData.disableBadCutSaberType === 'boolean' ||
         typeof this.customData.disableBadCutSpeed === 'boolean' ||
         Array.isArray(this.customData.flip) ||
         typeof this.customData.uninteractable === 'boolean' ||
         Array.isArray(this.customData.localRotation) ||
         typeof this.customData.noteJumpMovementSpeed === 'number' ||
         typeof this.customData.noteJumpStartBeatOffset === 'number' ||
         Array.isArray(this.customData.coordinates) ||
         Array.isArray(this.customData.worldRotation) ||
         typeof this.customData.worldRotation === 'number' ||
         typeof this.customData.link === 'string'
      );
   }
}
