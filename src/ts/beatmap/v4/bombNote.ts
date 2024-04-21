import type { IBombNote } from '../../types/beatmap/v4/bombNote.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapBombNote } from '../wrapper/bombNote.ts';
import type { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote.ts';
import { isVector3 } from '../../utils/vector.ts';
import type { IBombNoteContainer } from '../../types/beatmap/container/v4.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import type { IObjectLane } from '../../types/beatmap/v4/object.ts';

/** Bomb note beatmap v4 class object. */
export class BombNote extends WrapBombNote<IBombNoteContainer> {
   static default: DeepRequiredIgnore<IBombNoteContainer, 'customData'> = {
      object: {
         b: 0,
         i: 0,
         r: 0,
         customData: {},
      },
      data: {
         x: 0,
         y: 0,
         customData: {},
      },
   };

   static create(...data: Partial<IWrapBombNoteAttribute<IBombNoteContainer>>[]): BombNote[] {
      const result: BombNote[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapBombNoteAttribute<IBombNoteContainer>> = {}) {
      super();
      this._time = data.time ?? BombNote.default.object.b;
      this._laneRotation = data.laneRotation ?? BombNote.default.object.r;
      this._posX = data.posX ?? BombNote.default.data.x;
      this._posY = data.posY ?? BombNote.default.data.y;
      this._customData = deepCopy(data.customData ?? BombNote.default.data.customData);
   }

   static fromJSON(object: Partial<IObjectLane> = {}, data: Partial<IBombNote> = {}): BombNote {
      const d = new this();
      d._time = object.b ?? BombNote.default.object.b;
      d._laneRotation = object.r ?? BombNote.default.object.r;
      d._posX = data.x ?? BombNote.default.data.x;
      d._posY = data.y ?? BombNote.default.data.y;
      d._customData = deepCopy(data.customData ?? BombNote.default.data.customData);
      return d;
   }

   toJSON(): Required<IBombNoteContainer> {
      return {
         object: {
            b: this.time,
            i: 0,
            r: this.laneRotation,
            customData: {},
         },
         data: {
            x: this.posX,
            y: this.posY,
            customData: deepCopy(this.customData),
         },
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
