import { IWrapEvent } from '../../types/beatmap/wrapper/event';
import { IWrapEventTypesWithKeywords } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { IWrapBombNote } from '../../types/beatmap/wrapper/bombNote';
import { IWrapBPMEvent } from '../../types/beatmap/wrapper/bpmEvent';
import { IWrapBurstSlider } from '../../types/beatmap/wrapper/burstSlider';
import { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';
import { IWrapLightColorEventBoxGroup } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { IWrapLightRotationEventBoxGroup } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IWrapLightTranslationEventBoxGroup } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';
import { IWrapObstacle } from '../../types/beatmap/wrapper/obstacle';
import { IWrapRotationEvent } from '../../types/beatmap/wrapper/rotationEvent';
import { IWrapSlider } from '../../types/beatmap/wrapper/slider';
import { IWrapWaypoint } from '../../types/beatmap/wrapper/waypoint';
import { BeatPerMinute } from '../shared/bpm';
import { DeepPartial, LooseAutocomplete } from '../../types/utils';
import { GenericFileName } from '../../types/beatmap/shared/info';
import { ICustomDataBase } from '../../types/beatmap/shared/customData';
import { EventContainer, NoteContainer } from '../../types/beatmap/wrapper/container';
import { Version } from '../../types/beatmap/shared/version';
import { WrapBaseItem } from './baseItem';

/** Difficulty beatmap class object. */
export abstract class WrapDifficulty<T extends Record<keyof T, unknown>> extends WrapBaseItem<T> {
    private _fileName = 'UnnamedDifficulty.dat';

    abstract version: Version;
    abstract bpmEvents: IWrapBPMEvent[];
    abstract rotationEvents: IWrapRotationEvent[];
    abstract colorNotes: IWrapColorNote[];
    abstract bombNotes: IWrapBombNote[];
    abstract obstacles: IWrapObstacle[];
    abstract sliders: IWrapSlider[];
    abstract burstSliders: IWrapBurstSlider[];
    abstract waypoints: IWrapWaypoint[];
    abstract basicEvents: IWrapEvent[];
    abstract colorBoostEvents: IWrapColorBoostEvent[];
    abstract lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
    abstract lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
    abstract lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
    abstract basicEventTypesWithKeywords: IWrapEventTypesWithKeywords;
    abstract useNormalEventsAsCompatibleEvents: boolean;
    abstract customData: ICustomDataBase;

    clone<U extends this>(): U {
        return super.clone().setFileName(this.fileName) as U;
    }

    set fileName(name: LooseAutocomplete<GenericFileName>) {
        this._fileName = name.trim();
    }
    get fileName(): string {
        return this._fileName;
    }

    setFileName(fileName: LooseAutocomplete<GenericFileName>) {
        this.fileName = fileName;
        return this;
    }

    /** Calculate note per second.
     * ```ts
     * const nps = difficulty.nps(Difficulty, 10);
     * ```
     * ---
     * **Note:** Duration can be either in any time type.
     */
    nps(duration: number): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        return duration ? notes.length / duration : 0;
    }

    /** Calculate the peak by rolling average.
     * ```ts
     * const peakNPS = difficulty.peak(Difficulty, 10, BPM ?? 128);
     * ```
     */
    peak(beat: number, bpm: BeatPerMinute | number): number {
        let peakNPS = 0;
        let currentSectionStart = 0;
        bpm = typeof bpm === 'number' ? BeatPerMinute.create(bpm) : bpm;
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');

        for (let i = 0; i < notes.length; i++) {
            while (notes[i].data.time - notes[currentSectionStart].data.time > beat) {
                currentSectionStart++;
            }
            peakNPS = Math.max(peakNPS, (i - currentSectionStart + 1) / bpm.toRealTime(beat));
        }

        return peakNPS;
    }

    /** Get first interactible object beat time in beatmap.
     * ```ts
     * const firstInteractiveTime = difficulty.getFirstInteractiveTime(Difficulty);
     * ```
     */
    getFirstInteractiveTime(): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        let firstNoteTime = Number.MAX_VALUE;
        if (notes.length > 0) {
            firstNoteTime = notes[0].data.time;
        }
        const firstInteractiveObstacleTime = this.findFirstInteractiveObstacleTime();
        return Math.min(firstNoteTime, firstInteractiveObstacleTime);
    }

    /** Get last interactible object beat time in beatmap.
     * ```ts
     * const lastInteractiveTime = difficulty.getLastInteractiveTime(Difficulty);
     * ```
     */
    getLastInteractiveTime(): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        let lastNoteTime = 0;
        if (notes.length > 0) {
            lastNoteTime = notes[notes.length - 1].data.time;
        }
        const lastInteractiveObstacleTime = this.findLastInteractiveObstacleTime();
        return Math.max(lastNoteTime, lastInteractiveObstacleTime);
    }

    /** Get first interactible obstacle beat time in beatmap.
     * ```ts
     * const firstInteractiveObstacleTime = difficulty.findFirstInteractiveObstacleTime(obstacles);
     * ```
     */
    findFirstInteractiveObstacleTime(): number {
        for (let i = 0, len = this.obstacles.length; i < len; i++) {
            if (this.obstacles[i].isInteractive()) {
                return this.obstacles[i].time;
            }
        }
        return Number.MAX_VALUE;
    }

    /** Get last interactible obstacle beat time in beatmap.
     * ```ts
     * const lastInteractiveObstacleTime = difficulty.findLastInteractiveObstacleTime(obstacles);
     * ```
     */
    findLastInteractiveObstacleTime(): number {
        let obstacleEnd = 0;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isInteractive()) {
                obstacleEnd = Math.max(obstacleEnd, this.obstacles[i].time + this.obstacles[i].duration);
            }
        }
        return obstacleEnd;
    }

    /** Get container of color notes, sliders, burst sliders, and bombs (in order).
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getNoteContainer(): NoteContainer[] {
        const nc: NoteContainer[] = [];
        this.colorNotes.forEach((n) => nc.push({ type: 'note', data: n }));
        this.sliders.forEach((s) => nc.push({ type: 'slider', data: s }));
        this.burstSliders.forEach((bs) => nc.push({ type: 'burstSlider', data: bs }));
        this.bombNotes.forEach((b) => nc.push({ type: 'bomb', data: b }));
        return nc.sort((a, b) => a.data.time - b.data.time);
    }

    /** Get container of basic events and boost events.
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getEventContainer(): EventContainer[] {
        const ec: EventContainer[] = [];
        this.basicEvents.forEach((be) => ec.push({ type: 'basicEvent', data: be }));
        this.colorBoostEvents.forEach((b) => ec.push({ type: 'boost', data: b }));
        return ec.sort((a, b) => a.data.time - b.data.time);
    }

    abstract addBPMEvents(...bpmEvents: Partial<IWrapBPMEvent>[]): void;
    abstract addRotationEvents(...rotationEvents: Partial<IWrapRotationEvent>[]): void;
    abstract addColorNotes(...colorNotes: Partial<IWrapColorNote>[]): void;
    abstract addBombNotes(...bombNotes: Partial<IWrapBombNote>[]): void;
    abstract addObstacles(...obstacles: Partial<IWrapObstacle>[]): void;
    abstract addSliders(...sliders: Partial<IWrapSlider>[]): void;
    abstract addBurstSliders(...burstSliders: Partial<IWrapBurstSlider>[]): void;
    abstract addWaypoints(...waypoints: Partial<IWrapWaypoint>[]): void;
    abstract addBasicEvents(...basicEvents: Partial<IWrapEvent>[]): void;
    abstract addColorBoostEvents(...colorBoostEvents: Partial<IWrapColorBoostEvent>[]): void;
    abstract addLightColorEventBoxGroups(...lightColorEBGs: DeepPartial<IWrapLightColorEventBoxGroup>[]): void;
    abstract addLightRotationEventBoxGroups(...lightRotationEBGs: DeepPartial<IWrapLightRotationEventBoxGroup>[]): void;
}
