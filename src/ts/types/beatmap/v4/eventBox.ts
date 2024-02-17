import { IObject } from './object';
import { IItem } from './item';

export interface IEventBox extends IItem {
   /** Index `<int>` of typed event box array. */
   e?: number;
   /** Index `<int>` of index filter array. */
   f?: number;
   /** Index `<int>` of typed event array. */
   l?: IObject[];
}
