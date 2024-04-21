import type { ModType } from '../../types/beatmap/shared/modCheck.ts';
import type { IChain } from '../../types/beatmap/v4/chain.ts';
import type { IColorNote } from '../../types/beatmap/v4/colorNote.ts';
import type { IChainContainer } from '../../types/beatmap/container/v4.ts';
import type { IObjectChain } from '../../types/beatmap/v4/object.ts';
import type { IWrapChainAttribute } from '../../types/beatmap/wrapper/chain.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import type { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapChain } from '../wrapper/chain.ts';

/**
 * Chain beatmap v4 class object.
 *
 * Also known as burst slider internally.
 */
export class Chain extends WrapChain<IChainContainer> {
   static default: DeepRequiredIgnore<IChainContainer, 'customData'> = {
      object: {
         hb: 0,
         hr: 0,
         tb: 0,
         tr: 0,
         i: 0,
         ci: 0,
         customData: {},
      },
      data: {
         c: 0,
         x: 0,
         y: 0,
         d: 0,
         a: 0,
         customData: {},
      },
      chainData: {
         tx: 0,
         ty: 0,
         c: 0,
         s: 0,
         customData: {},
      },
   };

   static create(...data: Partial<IWrapChainAttribute<IChainContainer>>[]): Chain[] {
      const result: Chain[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapChainAttribute<IChainContainer>> = {}) {
      super();
      this._time = data.time ?? Chain.default.object.hb;
      this._laneRotation = data.laneRotation ?? Chain.default.object.hr;
      this._tailTime = data.tailTime ?? Chain.default.object.tb;
      this._tailLaneRotation = data.tailLaneRotation ?? Chain.default.object.tr;
      this._color = data.color ?? Chain.default.data.c;
      this._posX = data.posX ?? Chain.default.data.x;
      this._posY = data.posY ?? Chain.default.data.y;
      this._direction = data.direction ?? Chain.default.data.d;
      this._tailTime = data.tailTime ?? Chain.default.object.tb;
      this._tailPosX = data.tailPosX ?? Chain.default.chainData.tx;
      this._tailPosY = data.tailPosY ?? Chain.default.chainData.ty;
      this._sliceCount = data.sliceCount ?? Chain.default.chainData.c;
      this._squish = data.squish ?? Chain.default.chainData.s;
      this._customData = deepCopy(data.customData ?? Chain.default.chainData.customData);
   }

   static fromJSON(
      object: Partial<IObjectChain> = {},
      data: Partial<IColorNote> = {},
      chainData: Partial<IChain> = {},
   ): Chain {
      const d = new this();
      d._time = object.hb ?? Chain.default.object.hb;
      d._laneRotation = object.hr ?? Chain.default.object.hr;
      d._tailTime = object.tb ?? Chain.default.object.tb;
      d._tailLaneRotation = object.tr ?? Chain.default.object.tr;
      d._color = data.c ?? Chain.default.data.c;
      d._posX = data.x ?? Chain.default.data.x;
      d._posY = data.y ?? Chain.default.data.y;
      d._direction = data.d ?? Chain.default.data.d;
      d._tailTime = object.tb ?? Chain.default.object.tb;
      d._tailPosX = chainData.tx ?? Chain.default.chainData.tx;
      d._tailPosY = chainData.ty ?? Chain.default.chainData.ty;
      d._sliceCount = chainData.c ?? Chain.default.chainData.c;
      d._squish = chainData.s ?? Chain.default.chainData.s;
      d._customData = deepCopy(chainData.customData ?? Chain.default.chainData.customData);
      return d;
   }

   toJSON(): Required<IChainContainer> {
      return {
         object: {
            hb: this.time,
            hr: this.laneRotation,
            tb: this.tailTime,
            tr: this.tailLaneRotation,
            i: 0,
            ci: 0,
            customData: {},
         },
         data: {
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            a: 0,
            customData: {},
         },
         chainData: {
            tx: this.tailPosX,
            ty: this.tailPosY,
            c: this.sliceCount,
            s: this.squish,
            customData: deepCopy(this.customData),
         },
      };
   }

   get customData(): NonNullable<IChain['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IChain['customData']>) {
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
