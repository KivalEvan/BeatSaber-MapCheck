import type { IObject } from './object.ts';
import type { IItem } from './item.ts';

export interface IEventBox extends IItem {
   /** Index `<int>` of typed event box array. */
   e?: number;
   /** Index `<int>` of index filter array. */
   f?: number;
   /** Index `<int>` of typed event array. */
   l?: IObject[];
}
