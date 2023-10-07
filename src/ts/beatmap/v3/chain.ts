import { ModType } from '../../types/beatmap/shared/modCheck';
import { IChain } from '../../types/beatmap/v3/chain';
import { IWrapChainAttribute } from '../../types/beatmap/wrapper/chain';
import { Vector2 } from '../../types/vector';
import { deepCopy } from '../../utils/misc';
import { isVector3 } from '../../utils/vector';
import { WrapChain } from '../wrapper/chain';

/**
 * Chain beatmap v3 class object.
 *
 * Also known as burst slider internally.
 */
export class Chain extends WrapChain<IChain> {
   static default: Required<IChain> = {
      b: 0,
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      tb: 0,
      tx: 0,
      ty: 0,
      sc: 1,
      s: 1,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapChainAttribute<IChain>>);
   constructor(data: Partial<IChain>);
   constructor(data: Partial<IChain> & Partial<IWrapChainAttribute<IChain>>);
   constructor(data: Partial<IChain> & Partial<IWrapChainAttribute<IChain>> = {}) {
      super();

      this._time = data.b ?? data.time ?? data.tb ?? Chain.default.b;
      this._color = data.c ?? data.color ?? Chain.default.c;
      this._posX = data.x ?? data.posX ?? Chain.default.x;
      this._posY = data.y ?? data.posY ?? Chain.default.y;
      this._direction = data.d ?? data.direction ?? Chain.default.d;
      this._tailTime = data.tb ?? data.tailTime ?? data.b ?? Chain.default.tb;
      this._tailPosX = data.tx ?? data.tailPosX ?? Chain.default.tx;
      this._tailPosY = data.ty ?? data.tailPosY ?? Chain.default.ty;
      this._sliceCount = data.sc ?? data.sliceCount ?? Chain.default.sc;
      this._squish = data.s ?? data.squish ?? Chain.default.s;
      this._customData = deepCopy(data.customData ?? Chain.default.customData);
   }

   static create(): Chain[];
   static create(...data: Partial<IWrapChainAttribute<IChain>>[]): Chain[];
   static create(...data: Partial<IChain>[]): Chain[];
   static create(...data: (Partial<IChain> & Partial<IWrapChainAttribute<IChain>>)[]): Chain[];
   static create(...data: (Partial<IChain> & Partial<IWrapChainAttribute<IChain>>)[]): Chain[] {
      const result: Chain[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IChain {
      return {
         b: this.time,
         c: this.color,
         x: this.posX,
         y: this.posY,
         d: this.direction,
         tb: this.tailTime,
         tx: this.tailPosX,
         ty: this.tailPosY,
         sc: this.sliceCount,
         s: this.squish,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IChain['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IChain['customData']>) {
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
         case 'me':
            if (this.direction >= 1000) {
               return Math.abs(((this.direction % 1000) % 360) - 360);
            }
         /* falls through */
         case 'vanilla':
         case 'ne':
         default:
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
