import type { IItem } from './item.ts';

export interface IColorBoostEvent extends IItem {
   b?: 0 | 1; // int
}
