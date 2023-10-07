import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { deepCopy } from '../../utils/misc';
import { WrapBombNote } from '../wrapper/bombNote';
import { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote';
import { isVector3 } from '../../utils/vector';

/** Bomb note beatmap v3 class object. */
export class BombNote extends WrapBombNote<IBombNote> {
   static default: Required<IBombNote> = {
      b: 0,
      x: 0,
      y: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapBombNoteAttribute<IBombNote>>);
   constructor(data: Partial<IBombNote>);
   constructor(data: Partial<IBombNote> & Partial<IWrapBombNoteAttribute<IBombNote>>);
   constructor(data: Partial<IBombNote> & Partial<IWrapBombNoteAttribute<IBombNote>> = {}) {
      super();

      this._time = data.b ?? data.time ?? BombNote.default.b;
      this._posX = data.x ?? data.posX ?? BombNote.default.x;
      this._posY = data.y ?? data.posY ?? BombNote.default.y;
      this._customData = deepCopy(data.customData ?? BombNote.default.customData);
   }

   static create(): BombNote[];
   static create(...data: Partial<IWrapBombNoteAttribute<IBombNote>>[]): BombNote[];
   static create(...data: Partial<IBombNote>[]): BombNote[];
   static create(
      ...data: (Partial<IBombNote> & Partial<IWrapBombNoteAttribute<IBombNote>>)[]
   ): BombNote[];
   static create(
      ...data: (Partial<IBombNote> & Partial<IWrapBombNoteAttribute<IBombNote>>)[]
   ): BombNote[] {
      const result: BombNote[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IBombNote {
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

   mirror(_?: boolean, flipNoodle?: boolean) {
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
                     dp[0] = -dp[0];
                  });
               }
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
               if (isVector3(this.customData.animation.offsetPosition)) {
                  this.customData.animation.offsetPosition[0] =
                     -this.customData.animation.offsetPosition[0];
               } else {
                  this.customData.animation.offsetPosition.forEach((op) => {
                     op[0] = -op[0];
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
