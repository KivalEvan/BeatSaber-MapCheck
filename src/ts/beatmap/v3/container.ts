import { DifficultyData } from './difficulty';
import { BasicEvent } from './basicEvent';
import { BombNote } from './bombNote';
import { ColorBoostEvent } from './colorBoostEvent';
import { BurstSlider } from './burstSlider';
import { ColorNote } from './colorNote';
import { Slider } from './slider';

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

export type NoteContainer = (
    | NoteContainerNote
    | NoteContainerSlider
    | NoteContainerBurstSlider
    | NoteContainerBomb
)[];

interface EventContainerBasic {
    type: 'basicEvent';
    data: BasicEvent;
}

interface EventContainerBoost {
    type: 'boost';
    data: ColorBoostEvent;
}

export type EventContainer = (EventContainerBasic | EventContainerBoost)[];

/** Get container of color notes, sliders, burst sliders, and bombs.
 * ```ts
 * const noteCountainer = getNoteContainer(difficultyData);
 * ```
 */
export const getNoteContainer = (difficultyData: DifficultyData): NoteContainer => {
    const nc: NoteContainer = [];
    difficultyData.colorNotes.forEach((n) => nc.push({ type: 'note', data: n }));
    difficultyData.sliders.forEach((s) => nc.push({ type: 'slider', data: s }));
    difficultyData.burstSliders.forEach((bs) =>
        nc.push({ type: 'burstSlider', data: bs })
    );
    difficultyData.bombNotes.forEach((b) => nc.push({ type: 'bomb', data: b }));
    return nc.sort((a, b) => a.data.time - b.data.time);
};

/** Get container of basic events and boost events.
 * ```ts
 * const noteCountainer = getNoteContainer(difficultyData);
 * ```
 */
export const getEventContainer = (difficultyData: DifficultyData): EventContainer => {
    const ec: EventContainer = [];
    difficultyData.basicBeatmapEvents.forEach((be) =>
        ec.push({ type: 'basicEvent', data: be })
    );
    difficultyData.colorBoostBeatmapEvents.forEach((b) =>
        ec.push({ type: 'boost', data: b })
    );
    return ec.sort((a, b) => a.data.time - b.data.time);
};
