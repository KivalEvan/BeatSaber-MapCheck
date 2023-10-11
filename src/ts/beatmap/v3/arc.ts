import { IArc } from '../../types/beatmap/v3/arc';
import { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc';
import { ModType } from '../../types/beatmap/shared/modCheck';
import { Vector2 } from '../../types/vector';
import { deepCopy } from '../../utils/misc';
import { isVector3 } from '../../utils/vector';
import { WrapArc } from '../wrapper/arc';

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

   constructor();
   constructor(data: Partial<IWrapArcAttribute<IArc>>);
   constructor(data: Partial<IArc>);
   constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>>);
   constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>> = {}) {
      super();

      this._time = data.b ?? data.time ?? Arc.default.b;
      this._color = data.c ?? data.color ?? Arc.default.c;
      this._posX = data.x ?? data.posX ?? Arc.default.x;
      this._posY = data.y ?? data.posY ?? Arc.default.y;
      this._direction = data.d ?? data.direction ?? Arc.default.d;
      this._lengthMultiplier = data.mu ?? data.lengthMultiplier ?? Arc.default.mu;
      this._tailTime = data.tb ?? data.tailTime ?? Arc.default.tb;
      this._tailPosX = data.tx ?? data.tailPosX ?? Arc.default.tx;
      this._tailPosY = data.ty ?? data.tailPosY ?? Arc.default.ty;
      this._tailDirection = data.tc ?? data.tailDirection ?? Arc.default.tc;
      this._tailLengthMultiplier = data.tmu ?? data.tailLengthMultiplier ?? Arc.default.tmu;
      this._midAnchor = data.m ?? data.midAnchor ?? Arc.default.m;
      this._customData = deepCopy(data.customData ?? Arc.default.customData);
   }

   static create(): Arc[];
   static create(...data: Partial<IWrapArcAttribute<IArc>>[]): Arc[];
   static create(...data: Partial<IArc>[]): Arc[];
   static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[];
   static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[] {
      const result: Arc[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
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

   mirror(flipColor = true, flipNoodle?: boolean) {
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

   getAngle(type?: ModType) {
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

   getTailAngle(type?: ModType) {
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
