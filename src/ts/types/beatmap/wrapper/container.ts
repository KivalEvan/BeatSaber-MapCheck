import { IWrapEvent } from './event';
import { IWrapBombNote } from './bombNote';
import { IWrapBurstSlider } from './burstSlider';
import { IWrapColorBoostEvent } from './colorBoostEvent';
import { IWrapColorNote } from './colorNote';
import { IWrapSlider } from './slider';

interface ContainerBase {
    type: string;
}

export interface NoteContainerNote extends ContainerBase {
    type: 'note';
    data: IWrapColorNote;
}

export interface NoteContainerSlider extends ContainerBase {
    type: 'slider';
    data: IWrapSlider;
}

export interface NoteContainerBurstSlider extends ContainerBase {
    type: 'burstSlider';
    data: IWrapBurstSlider;
}

export interface NoteContainerBomb extends ContainerBase {
    type: 'bomb';
    data: IWrapBombNote;
}

export type NoteContainer =
    | NoteContainerNote
    | NoteContainerSlider
    | NoteContainerBurstSlider
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
