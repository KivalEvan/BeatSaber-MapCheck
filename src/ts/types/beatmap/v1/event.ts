import { IBaseObject } from './object';

export interface IEvent extends IBaseObject {
   _type: number;
   _value: number;
}
