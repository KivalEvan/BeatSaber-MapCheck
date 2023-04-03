import { IWrapEvent, IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import { IWrapEventTypesWithKeywords } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { IWrapBombNote, IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote';
import { IWrapBPMEvent, IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent';
import {
    IWrapBurstSlider,
    IWrapBurstSliderAttribute,
} from '../../types/beatmap/wrapper/burstSlider';
import {
    IWrapColorBoostEvent,
    IWrapColorBoostEventAttribute,
} from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapColorNote, IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import {
    IWrapLightColorEventBoxGroup,
    IWrapLightColorEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import {
    IWrapLightRotationEventBoxGroup,
    IWrapLightRotationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import {
    IWrapLightTranslationEventBoxGroup,
    IWrapLightTranslationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';
import { IWrapObstacle, IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import {
    IWrapRotationEvent,
    IWrapRotationEventAttribute,
} from '../../types/beatmap/wrapper/rotationEvent';
import { IWrapSlider, IWrapSliderAttribute } from '../../types/beatmap/wrapper/slider';
import { IWrapWaypoint, IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { BeatPerMinute } from '../shared/bpm';
import {
    DeepPartialWrapper,
    LooseAutocomplete,
    ObtainCustomData,
    PartialWrapper,
} from '../../types/utils';
import { GenericFileName } from '../../types/beatmap/shared/info';
import { EventContainer, NoteContainer } from '../../types/beatmap/wrapper/container';
import { Version } from '../../types/beatmap/shared/version';
import { WrapBaseItem } from './baseItem';
import { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty';

/** Difficulty beatmap class object. */
export abstract class WrapDifficulty<T extends Record<keyof T, unknown>>
    extends WrapBaseItem<T>
    implements IWrapDifficulty<T>
{
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
    abstract eventTypesWithKeywords: IWrapEventTypesWithKeywords;
    abstract useNormalEventsAsCompatibleEvents: boolean;
    abstract customData: ObtainCustomData<T>;

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

    nps(duration: number): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        return duration ? notes.length / duration : 0;
    }

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

    getFirstInteractiveTime(): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'slider');
        let firstNoteTime = Number.MAX_VALUE;
        if (notes.length > 0) {
            firstNoteTime = notes[0].data.time;
        }
        const firstInteractiveObstacleTime = this.findFirstInteractiveObstacleTime();
        return Math.min(firstNoteTime, firstInteractiveObstacleTime);
    }

    getLastInteractiveTime(): number {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'slider');
        let lastNoteTime = 0;
        if (notes.length > 0) {
            lastNoteTime = notes[notes.length - 1].data.time;
        }
        const lastInteractiveObstacleTime = this.findLastInteractiveObstacleTime();
        return Math.max(lastNoteTime, lastInteractiveObstacleTime);
    }

    findFirstInteractiveObstacleTime(): number {
        for (let i = 0, len = this.obstacles.length; i < len; i++) {
            if (this.obstacles[i].isInteractive()) {
                return this.obstacles[i].time;
            }
        }
        return Number.MAX_VALUE;
    }

    findLastInteractiveObstacleTime(): number {
        let obstacleEnd = 0;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isInteractive()) {
                obstacleEnd = Math.max(
                    obstacleEnd,
                    this.obstacles[i].time + this.obstacles[i].duration,
                );
            }
        }
        return obstacleEnd;
    }

    getNoteContainer(): NoteContainer[] {
        const nc: NoteContainer[] = [];
        this.colorNotes.forEach((n) => nc.push({ type: 'note', data: n }));
        this.sliders.forEach((s) => nc.push({ type: 'slider', data: s }));
        this.burstSliders.forEach((bs) => nc.push({ type: 'burstSlider', data: bs }));
        this.bombNotes.forEach((b) => nc.push({ type: 'bomb', data: b }));
        return nc.sort((a, b) => a.data.time - b.data.time);
    }

    getEventContainer(): EventContainer[] {
        const ec: EventContainer[] = [];
        this.basicEvents.forEach((be) => ec.push({ type: 'basicEvent', data: be }));
        this.colorBoostEvents.forEach((b) => ec.push({ type: 'boost', data: b }));
        return ec.sort((a, b) => a.data.time - b.data.time);
    }

    abstract addBPMEvents(...bpmEvents: PartialWrapper<IWrapBPMEventAttribute>[]): void;
    abstract addRotationEvents(
        ...rotationEvents: PartialWrapper<IWrapRotationEventAttribute>[]
    ): void;
    abstract addColorNotes(...colorNotes: PartialWrapper<IWrapColorNoteAttribute>[]): void;
    abstract addBombNotes(...bombNotes: PartialWrapper<IWrapBombNoteAttribute>[]): void;
    abstract addObstacles(...obstacles: PartialWrapper<IWrapObstacleAttribute>[]): void;
    abstract addSliders(...sliders: PartialWrapper<IWrapSliderAttribute>[]): void;
    abstract addBurstSliders(...burstSliders: PartialWrapper<IWrapBurstSliderAttribute>[]): void;
    abstract addWaypoints(...waypoints: PartialWrapper<IWrapWaypointAttribute>[]): void;
    abstract addBasicEvents(...basicEvents: PartialWrapper<IWrapEventAttribute>[]): void;
    abstract addColorBoostEvents(
        ...colorBoostEvents: PartialWrapper<IWrapColorBoostEventAttribute>[]
    ): void;
    abstract addLightColorEventBoxGroups(
        ...lightColorEBGs: DeepPartialWrapper<IWrapLightColorEventBoxGroupAttribute>[]
    ): void;
    abstract addLightRotationEventBoxGroups(
        ...lightRotationEBGs: DeepPartialWrapper<IWrapLightRotationEventBoxGroupAttribute>[]
    ): void;
    abstract addLightTranslationEventBoxGroups(
        ...lightTranslationEBGs: DeepPartialWrapper<IWrapLightTranslationEventBoxGroupAttribute>[]
    ): void;
}
