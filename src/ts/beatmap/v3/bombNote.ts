import type { IBombNote } from '../../types/beatmap/v3/bombNote.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapBombNote } from '../wrapper/bombNote.ts';
import type { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote.ts';
import { isVector3 } from '../../utils/vector.ts';

/** Bomb note beatmap v3 class object. */
export class BombNote extends WrapBombNote<IBombNote> {
   static default: Required<IBombNote> = {
      b: 0,
      x: 0,
      y: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapBombNoteAttribute<IBombNote>>[]): BombNote[] {
      const result: BombNote[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapBombNoteAttribute<IBombNote>> = {}) {
      super();
      this._time = data.time ?? BombNote.default.b;
      this._posX = data.posX ?? BombNote.default.x;
      this._posY = data.posY ?? BombNote.default.y;
      this._customData = deepCopy(data.customData ?? BombNote.default.customData);
   }

   static fromJSON(
      data: Partial<IBombNote> & Partial<IWrapBombNoteAttribute<IBombNote>> = {},
   ): BombNote {
      const d = new this();
      d._time = data.b ?? BombNote.default.b;
      d._posX = data.x ?? BombNote.default.x;
      d._posY = data.y ?? BombNote.default.y;
      d._customData = deepCopy(data.customData ?? BombNote.default.customData);
      return d;
   }

   toJSON(): Required<IBombNote> {
      return {
         b: this.time,
         x: this.posX,
         y: this.posY,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IBombNote['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IBombNote['customData']>) {
      this._customData = value;
   }

   mirror(_?: boolean, flipNoodle?: boolean): this {
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
      return super.mirror();
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
