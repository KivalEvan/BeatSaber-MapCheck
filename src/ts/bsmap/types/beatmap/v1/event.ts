import type { IBaseObject } from './object.ts';

export interface IEvent extends IBaseObject {
   _type: number;
   _value: number;
}
