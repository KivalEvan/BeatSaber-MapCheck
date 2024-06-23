import { IWrapArc } from '../../bsmap/types/beatmap/wrapper/arc';
import { IWrapBombNote } from '../../bsmap/types/beatmap/wrapper/bombNote';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';
import { IWrapChain } from '../../bsmap/types/beatmap/wrapper/chain';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';

export const enum ObjectContainerType {
   OBJECT = -1,
   COLOR,
   BOMB,
   ARC,
   CHAIN,
}

export interface IObjectContainerBase {
   readonly type: ObjectContainerType;
   readonly data: IWrapBaseObject;
}

export interface IObjectContainerArc extends IObjectContainerBase {
   readonly type: ObjectContainerType.ARC;
   readonly data: IWrapArc;
}

export interface IObjectContainerBomb extends IObjectContainerBase {
   readonly type: ObjectContainerType.BOMB;
   readonly data: IWrapBombNote;
}

export interface IObjectContainerColor extends IObjectContainerBase {
   readonly type: ObjectContainerType.COLOR;
   readonly data: IWrapColorNote;
}

export interface IObjectContainerChain extends IObjectContainerBase {
   readonly type: ObjectContainerType.CHAIN;
   readonly data: IWrapChain;
}

export type IObjectContainer =
   | IObjectContainerColor
   | IObjectContainerBomb
   | IObjectContainerArc
   | IObjectContainerChain;
