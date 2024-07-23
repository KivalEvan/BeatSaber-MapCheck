import { types } from 'bsmap';

export const enum ObjectContainerType {
   OBJECT = -1,
   COLOR,
   BOMB,
   ARC,
   CHAIN,
}

export interface IObjectContainerBase {
   readonly type: ObjectContainerType;
   readonly data: types.wrapper.IWrapBaseObject;
}

export interface IObjectContainerArc extends IObjectContainerBase {
   readonly type: ObjectContainerType.ARC;
   readonly data: types.wrapper.IWrapArc;
}

export interface IObjectContainerBomb extends IObjectContainerBase {
   readonly type: ObjectContainerType.BOMB;
   readonly data: types.wrapper.IWrapBombNote;
}

export interface IObjectContainerColor extends IObjectContainerBase {
   readonly type: ObjectContainerType.COLOR;
   readonly data: types.wrapper.IWrapColorNote;
}

export interface IObjectContainerChain extends IObjectContainerBase {
   readonly type: ObjectContainerType.CHAIN;
   readonly data: types.wrapper.IWrapChain;
}

export type IObjectContainer =
   | IObjectContainerColor
   | IObjectContainerBomb
   | IObjectContainerArc
   | IObjectContainerChain;
