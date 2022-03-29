import { BasicEvent } from '../../../beatmap/v3/basicEvent';
import { BombNote } from '../../../beatmap/v3/bombNote';
import { BurstSlider } from '../../../beatmap/v3/burstSlider';
import { ColorBoostEvent } from '../../../beatmap/v3/colorBoostEvent';
import { ColorNote } from '../../../beatmap/v3/colorNote';
import { Slider } from '../../../beatmap/v3/slider';

interface ContainerBase {
    type: string;
}

interface NoteContainerNote extends ContainerBase {
    type: 'note';
    data: ColorNote;
}

interface NoteContainerSlider extends ContainerBase {
    type: 'slider';
    data: Slider;
}

interface NoteContainerBurstSlider extends ContainerBase {
    type: 'burstSlider';
    data: BurstSlider;
}

interface NoteContainerBomb extends ContainerBase {
    type: 'bomb';
    data: BombNote;
}

export type NoteContainer =
    | NoteContainerNote
    | NoteContainerSlider
    | NoteContainerBurstSlider
    | NoteContainerBomb;

interface EventContainerBasic {
    type: 'basicEvent';
    data: BasicEvent;
}

interface EventContainerBoost {
    type: 'boost';
    data: ColorBoostEvent;
}

export type EventContainer = EventContainerBasic | EventContainerBoost;