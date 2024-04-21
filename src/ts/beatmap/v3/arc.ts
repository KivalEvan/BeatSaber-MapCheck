import type { IArc } from '../../types/beatmap/v3/arc.ts';
import type { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';
import type { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapArc } from '../wrapper/arc.ts';

/**
 * Arc beatmap v3 class object.
 *
 * Also known as slider internally.
 */
export class Arc extends WrapArc<IArc> {
   static default: Required<IArc> = {
      b: 0,
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      mu: 0,
      tb: 0,
      tx: 0,
      ty: 0,
      tc: 0,
      tmu: 0,
      m: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapArcAttribute<IArc>>[]): Arc[] {
      const result: Arc[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapArcAttribute<IArc>> = {}) {
      super();
      this._time = data.time ?? Arc.default.b;
      this._color = data.color ?? Arc.default.c;
      this._posX = data.posX ?? Arc.default.x;
      this._posY = data.posY ?? Arc.default.y;
      this._direction = data.direction ?? Arc.default.d;
      this._lengthMultiplier = data.lengthMultiplier ?? Arc.default.mu;
      this._tailTime = data.tailTime ?? Arc.default.tb;
      this._tailPosX = data.tailPosX ?? Arc.default.tx;
      this._tailPosY = data.tailPosY ?? Arc.default.ty;
      this._tailDirection = data.tailDirection ?? Arc.default.tc;
      this._tailLengthMultiplier = data.tailLengthMultiplier ?? Arc.default.tmu;
      this._midAnchor = data.midAnchor ?? Arc.default.m;
      this._customData = deepCopy(data.customData ?? Arc.default.customData);
   }

   static fromJSON(data: Partial<IArc> = {}): Arc {
      const d = new this();
      d._time = data.b ?? Arc.default.b;
      d._color = data.c ?? Arc.default.c;
      d._posX = data.x ?? Arc.default.x;
      d._posY = data.y ?? Arc.default.y;
      d._direction = data.d ?? Arc.default.d;
      d._lengthMultiplier = data.mu ?? Arc.default.mu;
      d._tailTime = data.tb ?? Arc.default.tb;
      d._tailPosX = data.tx ?? Arc.default.tx;
      d._tailPosY = data.ty ?? Arc.default.ty;
      d._tailDirection = data.tc ?? Arc.default.tc;
      d._tailLengthMultiplier = data.tmu ?? Arc.default.tmu;
      d._midAnchor = data.m ?? Arc.default.m;
      d._customData = deepCopy(data.customData ?? Arc.default.customData);
      return d;
   }

   toJSON(): Required<IArc> {
      return {
         b: this.time,
         c: this.color,
         x: this.posX,
         y: this.posY,
         d: this.direction,
         mu: this.lengthMultiplier,
         tb: this.tailTime,
         tx: this.tailPosX,
         ty: this.tailPosY,
         tc: this.tailDirection,
         tmu: this.tailLengthMultiplier,
         m: this.midAnchor,
         customData: deepCopy(this.customData),
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
