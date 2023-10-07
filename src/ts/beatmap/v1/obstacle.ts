import { Vector2 } from '../../types/vector';
import { IObstacle } from '../../types/beatmap/v1/obstacle';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import { WrapObstacle } from '../wrapper/obstacle';
import { ModType } from '../../types/beatmap/shared/modCheck';
import logger from '../../logger';

function tag(name: string): string[] {
   return ['beatmap', 'v1', 'obstacle', name];
}

/** Obstacle beatmap v1 class object. */
export class Obstacle extends WrapObstacle<IObstacle> {
   static default: Required<IObstacle> = {
      _time: 0,
      _lineIndex: 0,
      _type: 0,
      _duration: 1,
      _width: 1,
   };

   protected _type: number;

   constructor();
   constructor(data: Partial<IWrapObstacleAttribute<IObstacle>>);
   constructor(data: Partial<IObstacle>);
   constructor(data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>);
   constructor(data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>> = {}) {
      super();

      this._time = data._time ?? data.time ?? Obstacle.default._time;
      this._type =
         data._type ??
         (data.posY === 2 && data.height === 3
            ? 1
            : data.posY === 0 && data.height === 5
            ? 0
            : Obstacle.default._type);
      this._posX = data._lineIndex ?? data.posX ?? Obstacle.default._lineIndex;
      this._duration = data._duration ?? data.duration ?? Obstacle.default._duration;
      this._width = data._width ?? data.width ?? Obstacle.default._width;
   }

   static create(): Obstacle[];
   static create(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): Obstacle[];
   static create(...data: Partial<IObstacle>[]): Obstacle[];
   static create(
      ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]
   ): Obstacle[];
   static create(
      ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]
   ): Obstacle[] {
      const result: Obstacle[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IObstacle {
      return {
         _time: this.time,
         _type: this.type,
         _lineIndex: this.posX,
         _duration: this.duration,
         _width: this.width,
      };
   }

   get type(): IObstacle['_type'] {
      return this._type;
   }
   set type(value: IObstacle['_type']) {
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

   get customData(): Record<string, never> {
      return {};
   }
   set customData(_: Record<string, never>) {
      logger.tWarn(tag('customData'), 'Obstacle custom data does not exist in beatmap V1');
   }

   getPosition(type?: ModType): Vector2 {
      switch (type) {
         case 'vanilla':
         case 'ne':
            return super.getPosition();
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

   isMappingExtensions(): boolean {
      return this.type > 2 || this.posX <= -1000 || this.posX >= 1000;
   }
}
