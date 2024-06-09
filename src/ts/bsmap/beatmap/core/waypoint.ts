import { LINE_COUNT } from '../shared/constants.ts';
import type {
   IWrapWaypoint,
   IWrapWaypointAttribute,
} from '../../types/beatmap/wrapper/waypoint.ts';
import { GridObject } from './abstract/gridObject.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { MirrorFn } from '../../types/beatmap/shared/functions.ts';

export class Waypoint extends GridObject implements IWrapWaypoint {
   static defaultValue: IWrapWaypointAttribute = {
      time: 0,
      posX: 0,
      posY: 0,
      direction: 0,
      laneRotation: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapWaypointAttribute>[]): Waypoint[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapWaypointAttribute> = {}) {
      super();
      this.time = data.time ?? Waypoint.defaultValue.time;
      this.posX = data.posX ?? Waypoint.defaultValue.posX;
      this.posY = data.posY ?? Waypoint.defaultValue.posY;
      this.direction = data.direction ?? Waypoint.defaultValue.direction;
      this.laneRotation = data.laneRotation ?? Waypoint.defaultValue.laneRotation;
      this.customData = deepCopy(data.customData ?? Waypoint.defaultValue.customData);
   }

   direction: IWrapWaypoint['direction'] = 0;

   setDirection(value: this['direction']): this {
      this.direction = value;
      return this;
   }

   mirror(_flipAlt?: boolean, fn?: MirrorFn<this>): this {
      fn?.(this);
      this.posX = LINE_COUNT - 1 - this.posX;
      switch (this.direction) {
         case 2:
            this.direction = 3;
            break;
         case 3:
            this.direction = 2;
            break;
         case 6:
            this.direction = 7;
            break;
         case 7:
            this.direction = 6;
            break;
         case 4:
            this.direction = 5;
            break;
         case 5:
            this.direction = 4;
            break;
      }
      return this;
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              this.direction >= 0 &&
              this.direction <= 9 &&
              this.direction !== (8 as 0);
   }
}
