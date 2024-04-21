import type { IArc } from '../../types/beatmap/v4/arc.ts';
import type { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';
import type { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapArc } from '../wrapper/arc.ts';
import type { IArcContainer } from '../../types/beatmap/container/v4.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import type { IColorNote } from '../../types/beatmap/v4/colorNote.ts';
import type { IObjectArc } from '../../types/beatmap/v4/object.ts';

/** Arc beatmap v4 class object. */
export class Arc extends WrapArc<IArcContainer> {
   static default: DeepRequiredIgnore<IArcContainer, 'customData'> = {
      object: {
         ai: 0,
         hb: 0,
         hi: 0,
         hr: 0,
         tb: 0,
         ti: 0,
         tr: 0,
         customData: {},
      },
      data: {
         m: 0,
         tm: 0,
         a: 0,
         customData: {},
      },
      headData: {
         c: 0,
         x: 0,
         y: 0,
         d: 0,
         a: 0,
         customData: {},
      },
      tailData: {
         c: 0,
         x: 0,
         y: 0,
         d: 0,
         a: 0,
         customData: {},
      },
   };

   static create(...data: Partial<IWrapArcAttribute<IArcContainer>>[]): Arc[] {
      const result: Arc[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapArcAttribute<IArcContainer>> = {}) {
      super();
      this._time = data.time ?? Arc.default.object.hb;
      this._laneRotation = data.laneRotation ?? Arc.default.object.hr;
      this._tailTime = data.tailTime ?? Arc.default.object.tb;
      this._tailLaneRotation = data.tailLaneRotation ?? Arc.default.object.tr;
      this._color = data.color ?? Arc.default.headData.c;
      this._posX = data.posX ?? Arc.default.headData.x;
      this._posY = data.posY ?? Arc.default.headData.y;
      this._direction = data.direction ?? Arc.default.headData.d;
      this._lengthMultiplier = data.lengthMultiplier ?? Arc.default.data.m;
      this._tailPosX = data.tailPosX ?? Arc.default.tailData.x;
      this._tailPosY = data.tailPosY ?? Arc.default.tailData.y;
      this._tailDirection = data.tailDirection ?? Arc.default.tailData.c;
      this._tailLengthMultiplier = data.tailLengthMultiplier ?? Arc.default.data.tm;
      this._midAnchor = data.midAnchor ?? Arc.default.data.a;
      this._customData = deepCopy(data.customData ?? Arc.default.data.customData);
   }

   static fromJSON(
      object: Partial<IObjectArc> = {},
      data: Partial<IArc> = {},
      headData: Partial<IColorNote> = {},
      tailData: Partial<IColorNote> = {},
   ): Arc {
      const d = new this();
      d._time = object.hb ?? Arc.default.object.hb;
      d._laneRotation = object.hr ?? Arc.default.object.hr;
      d._tailTime = object.tb ?? Arc.default.object.tb;
      d._tailLaneRotation = object.tr ?? Arc.default.object.tr;
      d._color = headData.c ?? Arc.default.headData.c;
      d._posX = headData.x ?? Arc.default.headData.x;
      d._posY = headData.y ?? Arc.default.headData.y;
      d._direction = headData.d ?? Arc.default.headData.d;
      d._lengthMultiplier = data.m ?? Arc.default.data.m;
      d._tailPosX = tailData.x ?? Arc.default.tailData.x;
      d._tailPosY = tailData.y ?? Arc.default.tailData.y;
      d._tailDirection = tailData.d ?? Arc.default.tailData.c;
      d._tailLengthMultiplier = data.tm ?? Arc.default.data.tm;
      d._midAnchor = data.a ?? Arc.default.data.a;
      d._customData = deepCopy(data.customData ?? Arc.default.data.customData);
      return d;
   }

   toJSON(): Required<IArcContainer> {
      return {
         object: {
            ai: 0,
            hb: this.time,
            hi: 0,
            hr: this.laneRotation,
            tb: this.tailTime,
            ti: 0,
            tr: this.tailLaneRotation,
            customData: {},
         },
         data: {
            m: this.lengthMultiplier,
            tm: this.tailLengthMultiplier,
            a: this.midAnchor,
            customData: deepCopy(this.customData),
         },
         headData: {
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            a: 0,
            customData: {},
         },
         tailData: {
            c: this.color,
            x: this.tailPosX,
            y: this.tailPosY,
            d: this.tailDirection,
            a: 0,
            customData: {},
         },
      };
   }

   get customData(): NonNullable<IArc['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IArc['customData']>) {
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
         case 'me':
         default:
            if (this.direction >= 1000) {
               return Math.abs(((this.direction % 1000) % 360) - 360);
            }
            return super.getAngle();
      }
   }

   getTailPosition(type?: ModType): Vector2 {
      switch (type) {
         case 'vanilla':
            return super.getTailPosition();
         case 'ne':
            if (this.customData.tailCoordinates) {
               return [this.customData.tailCoordinates[0], this.customData.tailCoordinates[1]];
            }
         /** falls through */
         case 'me':
         default:
            return [
               (this.tailPosX <= -1000
                  ? this.tailPosX / 1000 + 1
                  : this.tailPosX >= 1000
                    ? this.tailPosX / 1000 - 1
                    : this.tailPosX) - 2,
               this.tailPosY <= -1000
                  ? this.tailPosY / 1000
                  : this.tailPosY >= 1000
                    ? this.tailPosY / 1000
                    : this.tailPosY,
            ];
      }
   }

   getTailAngle(type?: ModType): number {
      switch (type) {
         case 'vanilla':
         case 'ne':
            return super.getTailAngle();
         case 'me':
            if (this.tailDirection >= 1000) {
               return Math.abs(((this.tailDirection % 1000) % 360) - 360);
            }
         /** falls through */
         default:
            return super.getTailAngle();
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
         Array.isArray(this.customData.tailCoordinates) ||
         Array.isArray(this.customData.worldRotation) ||
         typeof this.customData.worldRotation === 'number' ||
         typeof this.customData.link === 'string'
      );
   }
}
