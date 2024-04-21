import type { Vector2 } from '../../types/vector.ts';
import type { IObstacle } from '../../types/beatmap/v2/obstacle.ts';
import type { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapObstacle } from '../wrapper/obstacle.ts';
import type { ModType } from '../../types/beatmap/shared/modCheck.ts';

/** Obstacle beatmap v2 class object. */
export class Obstacle extends WrapObstacle<IObstacle> {
   static default: Required<IObstacle> = {
      _time: 0,
      _lineIndex: 0,
      _type: 0,
      _duration: 0,
      _width: 0,
      _customData: {},
   };

   protected _type: number;

   static create(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): Obstacle[] {
      const result: Obstacle[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapObstacleAttribute<IObstacle>> = {}) {
      super();
      this._time = data.time ?? Obstacle.default._time;
      if (data instanceof Obstacle) {
         this._type = data.type;
      } else {
         this._type =
            data.posY === 2 && data.height === 3
               ? 1
               : data.posY === 0 && data.height === 5
                 ? 0
                 : Obstacle.default._type;
      }
      this._posX = data.posX ?? Obstacle.default._lineIndex;
      this._duration = data.duration ?? Obstacle.default._duration;
      this._width = data.width ?? Obstacle.default._width;
      this._customData = deepCopy(data.customData ?? Obstacle.default._customData);
   }

   static fromJSON(data: Partial<IObstacle> = {}): Obstacle {
      const d = new this();
      d._time = data._time ?? Obstacle.default._time;
      d._type = data._type ?? Obstacle.default._type;
      d._posX = data._lineIndex ?? Obstacle.default._lineIndex;
      d._duration = data._duration ?? Obstacle.default._duration;
      d._width = data._width ?? Obstacle.default._width;
      d._customData = deepCopy(data._customData ?? Obstacle.default._customData);
      return d;
   }

   toJSON(): Required<IObstacle> {
      return {
         _time: this.time,
         _type: this.type,
         _lineIndex: this.posX,
         _duration: this.duration,
         _width: this.width,
         _customData: deepCopy(this.customData),
      };
   }

   get type(): Required<IObstacle>['_type'] {
      return this._type;
   }
   set type(value: Required<IObstacle>['_type']) {
      this._type = value;
   }

   get posY(): 0 | 2 {
      return this.type == 1 ? 2 : 0;
   }
   set posY(value: 0 | 2) {
      switch (value) {
         case 2:
            this.type = 1;
            break;
         default:
            this.type = 0;
      }
   }

   get height(): 3 | 5 {
      return this.type == 1 ? 3 : 5;
   }
   set height(value: 3 | 5) {
      switch (value) {
         case 3:
            this.type = 1;
            break;
         default:
            this.type = 0;
      }
   }

   get customData(): NonNullable<IObstacle['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IObstacle['_customData']>) {
      this._customData = value;
   }

   getPosition(type?: ModType): Vector2 {
      switch (type) {
         case 'vanilla':
            return super.getPosition();
         case 'ne':
            if (this.customData._position) {
               return [this.customData._position[0], this.customData._position[1]];
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
      return Array.isArray(this.customData._color);
   }

   isNoodleExtensions(): boolean {
      return (
         Array.isArray(this.customData._animation) ||
         typeof this.customData._fake === 'boolean' ||
         typeof this.customData._interactable === 'boolean' ||
         Array.isArray(this.customData._localRotation) ||
         typeof this.customData._noteJumpMovementSpeed === 'number' ||
         typeof this.customData._noteJumpStartBeatOffset === 'number' ||
         Array.isArray(this.customData._position) ||
         Array.isArray(this.customData._rotation) ||
         Array.isArray(this.customData._scale)
      );
   }

   isMappingExtensions(): boolean {
      return this.type > 1 || this.posX < 0 || this.posX > 3 || this.width < 0 || this.width > 3;
   }
}
