import type { IWrapEvent } from './event.ts';
import type { IWrapBombNote } from './bombNote.ts';
import type { IWrapChain } from './chain.ts';
import type { IWrapColorBoostEvent } from './colorBoostEvent.ts';
import type { IWrapColorNote } from './colorNote.ts';
import type { IWrapArc } from './arc.ts';

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
