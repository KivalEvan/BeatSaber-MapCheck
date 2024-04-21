import type { ModType } from '../../types/beatmap/shared/modCheck.ts';
import type { IObstacle } from '../../types/beatmap/v4/obstacle.ts';
import type { IObstacleContainer } from '../../types/beatmap/container/v4.ts';
import type { IObjectLane } from '../../types/beatmap/v4/object.ts';
import type { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import type { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapObstacle } from '../wrapper/obstacle.ts';

/** Obstacle beatmap v4 class object. */
export class Obstacle extends WrapObstacle<IObstacleContainer> {
   static default: DeepRequiredIgnore<IObstacleContainer, 'customData'> = {
      object: {
         b: 0,
         i: 0,
         r: 0,
         customData: {},
      },
      data: {
         x: 0,
         y: 0,
         d: 0,
         w: 0,
         h: 0,
         customData: {},
      },
   };

   static create(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): Obstacle[] {
      const result: Obstacle[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapObstacleAttribute<IObstacleContainer>> = {}) {
      super();
      this._time = data.time ?? Obstacle.default.object.b;
      this._laneRotation = data.laneRotation ?? Obstacle.default.object.r;
      this._posX = data.posX ?? Obstacle.default.data.x;
      this._posY = data.posY ?? Obstacle.default.data.y;
      this._duration = data.duration ?? Obstacle.default.data.d;
      this._width = data.width ?? Obstacle.default.data.w;
      this._height = data.height ?? Obstacle.default.data.h;
      this._customData = deepCopy(data.customData ?? Obstacle.default.data.customData);
   }

   static fromJSON(object: Partial<IObjectLane> = {}, data: Partial<IObstacle> = {}): Obstacle {
      const d = new this();
      d._time = object.b ?? Obstacle.default.object.b;
      d._laneRotation = object.r ?? Obstacle.default.object.r;
      d._posX = data.x ?? Obstacle.default.data.x;
      d._posY = data.y ?? Obstacle.default.data.y;
      d._duration = data.d ?? Obstacle.default.data.d;
      d._width = data.w ?? Obstacle.default.data.w;
      d._height = data.h ?? Obstacle.default.data.h;
      d._customData = deepCopy(data.customData ?? Obstacle.default.data.customData);
      return d;
   }

   toJSON(): Required<IObstacleContainer> {
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
            d: this.duration,
            w: this.width,
            h: this.height,
            customData: deepCopy(this.customData),
         },
      };
   }

   get customData(): NonNullable<IObstacle['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IObstacle['customData']>) {
      this._customData = value;
   }

   mirror(_?: boolean, flipNoodle?: boolean): this {
      if (flipNoodle) {
         const width = this.customData.size?.[0] ?? this.width;
         if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
         }
         if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
               if (isVector3(this.customData.animation.definitePosition)) {
                  this.customData.animation.definitePosition[0] =
                     -this.customData.animation.definitePosition[0] - (this.posX + width - 1);
               } else {
                  this.customData.animation.definitePosition.forEach((dp) => {
                     if (Array.isArray(dp)) dp[0] = -dp[0] - (this.posX + width - 1);
                  });
               }
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
               if (isVector3(this.customData.animation.offsetPosition)) {
                  this.customData.animation.offsetPosition[0] =
                     -this.customData.animation.offsetPosition[0] - (this.posX + width - 1);
               } else {
                  this.customData.animation.offsetPosition.forEach((op) => {
                     if (Array.isArray(op)) op[0] = -op[0] - (this.posX + width - 1);
                  });
               }
            }
         }
      }
      return super.mirror();
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
               (this.posY <= -1000
                  ? this.posY / 1000
                  : this.posY >= 1000
                    ? this.posY / 1000
                    : this.posY) - 0.5,
            ];
      }
   }

   isChroma(): boolean {
      return Array.isArray(this.customData.color);
   }

   isNoodleExtensions(): boolean {
      return (
         Array.isArray(this.customData.animation) ||
         typeof this.customData.uninteractable === 'boolean' ||
         Array.isArray(this.customData.localRotation) ||
         typeof this.customData.noteJumpMovementSpeed === 'number' ||
         typeof this.customData.noteJumpStartBeatOffset === 'number' ||
         Array.isArray(this.customData.coordinates) ||
         Array.isArray(this.customData.worldRotation) ||
         Array.isArray(this.customData.size)
      );
   }

   isMappingExtensions(): boolean {
      return (
         this.posY < 0 ||
         this.posY > 2 ||
         this.posX <= -1000 ||
         this.posX >= 1000 ||
         this.width <= -1000 ||
         this.width >= 1000 ||
         this.height <= -1000 ||
         this.height >= 1000
      );
   }
}
