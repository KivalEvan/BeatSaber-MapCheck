import { IWrapEvent } from './event';
import { IWrapBombNote } from './bombNote';
import { IWrapChain } from './chain';
import { IWrapColorBoostEvent } from './colorBoostEvent';
import { IWrapColorNote } from './colorNote';
import { IWrapArc } from './arc';

interface ContainerBase {
   type: string;
}

export interface NoteContainerNote extends ContainerBase {
   type: 'note';
   data: IWrapColorNote;
}

export interface NoteContainerArc extends ContainerBase {
   type: 'arc';
   data: IWrapArc;
}

export interface NoteContainerChain extends ContainerBase {
   type: 'chain';
   data: IWrapChain;
}

export interface NoteContainerBomb extends ContainerBase {
   type: 'bomb';
   data: IWrapBombNote;
}

export type NoteContainer =
   | NoteContainerNote
   | NoteContainerArc
   | NoteContainerChain
   | NoteContainerBomb;

export interface EventContainerBasic {
   type: 'basicEvent';
   data: IWrapEvent;
}

export interface EventContainerBoost {
   type: 'boost';
   data: IWrapColorBoostEvent;
}

export type EventContainer = EventContainerBasic | EventContainerBoost;
