import type { IItem } from './item.ts';

export interface IObject extends IItem {
   b?: number; // float
   i?: number; // int
}

export interface IObjectLane extends IObject {
   r?: number; // float
}

export interface IObjectChain extends IItem {
   hb?: number; // float
   hr?: number; // float
   tb?: number; // float
   tr?: number; // float
   i?: number; // int
   ci?: number; // int
}

export interface IObjectArc extends IItem {
   hb?: number; // float
   hi?: number; // int
   hr?: number; // float
   tb?: number; // float
   ti?: number; // int
   tr?: number; // float
   ai?: number; // int
}
