import { IBaseObject } from './baseObject';

export interface IEventBoxGroup<T> extends IBaseObject {
   /** Group ID `<int>` of event box group */
   g: number;
   e: T[];
}
