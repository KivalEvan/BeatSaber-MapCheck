import { IWrapArc } from '../../bsmap/types/beatmap/wrapper/arc';
import { IWrapBombNote } from '../../bsmap/types/beatmap/wrapper/bombNote';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';
import { IWrapChain } from '../../bsmap/types/beatmap/wrapper/chain';

export const enum NoteContainerType {
   COLOR,
   BOMB,
   ARC,
   CHAIN,
}

export interface INoteContainerBase {
   readonly beatTime: number;
   readonly secondTime: number;
}

export interface INoteContainerArc extends INoteContainerBase {
   readonly type: NoteContainerType.ARC;
   readonly data: IWrapArc;
}

export interface INoteContainerBomb extends INoteContainerBase {
   readonly type: NoteContainerType.BOMB;
   readonly data: IWrapBombNote;
}

export interface INoteContainerColor extends INoteContainerBase {
   readonly type: NoteContainerType.COLOR;
   readonly data: IWrapColorNote;
}

export interface INoteContainerChain extends INoteContainerBase {
   readonly type: NoteContainerType.CHAIN;
   readonly data: IWrapChain;
}

export type INoteContainer =
   | INoteContainerColor
   | INoteContainerBomb
   | INoteContainerArc
   | INoteContainerChain;
