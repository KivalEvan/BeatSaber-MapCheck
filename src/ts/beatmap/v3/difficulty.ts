import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { Serializable } from '../shared/serializable';
import { BasicEvent } from './basicEvent';
import { BasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';
import { BombNote } from './bombNote';
import { BPMEvent } from './bpmEvent';
import { BurstSlider } from './burstSlider';
import { ColorBoostEvent } from './colorBoostEvent';
import { ColorNote } from './colorNote';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { Obstacle } from './obstacle';
import { RotationEvent } from './rotationEvent';
import { Slider } from './slider';
import { Waypoint } from './waypoint';
import { BeatPerMinute } from '../shared/bpm';
import { EventContainer, NoteContainer } from '../../types/beatmap/v3/container';
import { DeepPartial, LooseAutocomplete } from '../../types/utils';
import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent';
import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { IObstacle } from '../../types/beatmap/v3/obstacle';
import { ISlider } from '../../types/beatmap/v3/slider';
import { IBurstSlider } from '../../types/beatmap/v3/burstSlider';
import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { GenericFileName } from '../../types/beatmap/shared/info';

/** Difficulty beatmap v3 class object. */
export class Difficulty extends Serializable<IDifficulty> {
    private _fileName = 'UnnamedDifficulty.dat';

    version;
    bpmEvents: BPMEvent[];
    rotationEvents: RotationEvent[];
    colorNotes: ColorNote[];
    bombNotes: BombNote[];
    obstacles: Obstacle[];
    sliders: Slider[];
    burstSliders: BurstSlider[];
    waypoints: Waypoint[];
    basicBeatmapEvents: BasicEvent[];
    colorBoostBeatmapEvents: ColorBoostEvent[];
    lightColorEventBoxGroups: LightColorEventBoxGroup[];
    lightRotationEventBoxGroups: LightRotationEventBoxGroup[];
    basicEventTypesWithKeywords: BasicEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents;
    customData;
    protected constructor(data: Required<IDifficulty>) {
        super(data);
        this.version = data.version ?? '3.0.0';
        this.bpmEvents = data.bpmEvents?.map((obj) => BPMEvent.create(obj)[0]) ?? [];
        this.rotationEvents = data.rotationEvents?.map((obj) => RotationEvent.create(obj)[0]) ?? [];
        this.colorNotes = data.colorNotes?.map((obj) => ColorNote.create(obj)[0]) ?? [];
        this.bombNotes = data.bombNotes?.map((obj) => BombNote.create(obj)[0]) ?? [];
        this.obstacles = data.obstacles?.map((obj) => Obstacle.create(obj)[0]) ?? [];
        this.sliders = data.sliders?.map((obj) => Slider.create(obj)[0]) ?? [];
        this.burstSliders = data.burstSliders?.map((obj) => BurstSlider.create(obj)[0]) ?? [];
        this.waypoints = data.waypoints?.map((obj) => Waypoint.create(obj)[0]) ?? [];
        this.basicBeatmapEvents = data.basicBeatmapEvents?.map((obj) => BasicEvent.create(obj)[0]) ?? [];
        this.colorBoostBeatmapEvents = data.colorBoostBeatmapEvents?.map((obj) => ColorBoostEvent.create(obj)[0]) ?? [];
        this.lightColorEventBoxGroups =
            data.lightColorEventBoxGroups?.map((obj) => LightColorEventBoxGroup.create(obj)[0]) ?? [];
        this.lightRotationEventBoxGroups =
            data.lightRotationEventBoxGroups?.map((obj) => LightRotationEventBoxGroup.create(obj)[0]) ?? [];
        this.basicEventTypesWithKeywords = BasicEventTypesWithKeywords.create(data.basicEventTypesWithKeywords) ?? {
            d: [],
        };
        this.useNormalEventsAsCompatibleEvents = data.useNormalEventsAsCompatibleEvents ?? false;
        this.customData = data.customData ?? {};
    }

    static create(data: Partial<IDifficulty> = {}): Difficulty {
        return new this({
            version: data.version || '3.0.0',
            bpmEvents: data.bpmEvents ?? [],
            rotationEvents: data.rotationEvents ?? [],
            colorNotes: data.colorNotes ?? [],
            bombNotes: data.bombNotes ?? [],
            obstacles: data.obstacles ?? [],
            sliders: data.sliders ?? [],
            burstSliders: data.burstSliders ?? [],
            waypoints: data.waypoints ?? [],
            basicBeatmapEvents: data.basicBeatmapEvents ?? [],
            colorBoostBeatmapEvents: data.colorBoostBeatmapEvents ?? [],
            lightColorEventBoxGroups: data.lightColorEventBoxGroups ?? [],
            lightRotationEventBoxGroups: data.lightRotationEventBoxGroups ?? [],
            basicEventTypesWithKeywords: data.basicEventTypesWithKeywords ?? {
                d: [],
            },
            useNormalEventsAsCompatibleEvents: data.useNormalEventsAsCompatibleEvents ?? false,
            customData: data.customData ?? {},
        });
    }

    toJSON(): Required<IDifficulty> {
        return {
            version: this.version || '3.0.0',
            bpmEvents: this.bpmEvents.map((obj) => obj.toJSON()),
            rotationEvents: this.rotationEvents.map((obj) => obj.toJSON()),
            colorNotes: this.colorNotes.map((obj) => obj.toJSON()),
            bombNotes: this.bombNotes.map((obj) => obj.toJSON()),
            obstacles: this.obstacles.map((obj) => obj.toJSON()),
            sliders: this.sliders.map((obj) => obj.toJSON()),
            burstSliders: this.burstSliders.map((obj) => obj.toJSON()),
            waypoints: this.waypoints.map((obj) => obj.toJSON()),
            basicBeatmapEvents: this.basicBeatmapEvents.map((obj) => obj.toJSON()),
            colorBoostBeatmapEvents: this.colorBoostBeatmapEvents.map((obj) => obj.toJSON()),
            lightColorEventBoxGroups: this.lightColorEventBoxGroups.map((obj) => obj.toJSON()),
            lightRotationEventBoxGroups: this.lightRotationEventBoxGroups.map((obj) => obj.toJSON()),
            basicEventTypesWithKeywords: this.basicEventTypesWithKeywords.toJSON(),
            useNormalEventsAsCompatibleEvents: this.useNormalEventsAsCompatibleEvents,
            customData: deepCopy(this.customData),
        };
    }

    clone<U extends this>(): U {
        const fileName = this.fileName;
        return super.clone().setFileName(fileName) as U;
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
    nps = (duration: number): number => {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        return duration ? notes.length / duration : 0;
    };

    /** Calculate the peak by rolling average.
     * ```ts
     * const peakNPS = difficulty.peak(Difficulty, 10, BPM ?? 128);
     * ```
     */
    peak = (beat: number, bpm: BeatPerMinute | number): number => {
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
    };

    /** Get first interactible object beat time in beatmap.
     * ```ts
     * const firstInteractiveTime = difficulty.getFirstInteractiveTime(Difficulty);
     * ```
     */
    getFirstInteractiveTime = (): number => {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        let firstNoteTime = Number.MAX_VALUE;
        if (notes.length > 0) {
            firstNoteTime = notes[0].data.time;
        }
        const firstInteractiveObstacleTime = this.findFirstInteractiveObstacleTime();
        return Math.min(firstNoteTime, firstInteractiveObstacleTime);
    };

    /** Get last interactible object beat time in beatmap.
     * ```ts
     * const lastInteractiveTime = difficulty.getLastInteractiveTime(Difficulty);
     * ```
     */
    getLastInteractiveTime = (): number => {
        const notes = this.getNoteContainer().filter((n) => n.type !== 'bomb');
        let lastNoteTime = 0;
        if (notes.length > 0) {
            lastNoteTime = notes[notes.length - 1].data.time;
        }
        const lastInteractiveObstacleTime = this.findLastInteractiveObstacleTime();
        return Math.max(lastNoteTime, lastInteractiveObstacleTime);
    };

    /** Get first interactible obstacle beat time in beatmap.
     * ```ts
     * const firstInteractiveObstacleTime = difficulty.findFirstInteractiveObstacleTime(obstacles);
     * ```
     */
    findFirstInteractiveObstacleTime = (): number => {
        for (let i = 0, len = this.obstacles.length; i < len; i++) {
            if (this.obstacles[i].isInteractive()) {
                return this.obstacles[i].time;
            }
        }
        return Number.MAX_VALUE;
    };

    /** Get last interactible obstacle beat time in beatmap.
     * ```ts
     * const lastInteractiveObstacleTime = difficulty.findLastInteractiveObstacleTime(obstacles);
     * ```
     */
    findLastInteractiveObstacleTime = (): number => {
        let obstacleEnd = 0;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isInteractive()) {
                obstacleEnd = Math.max(obstacleEnd, this.obstacles[i].time + this.obstacles[i].duration);
            }
        }
        return obstacleEnd;
    };

    /** Get container of color notes, sliders, burst sliders, and bombs (in order).
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getNoteContainer = (): NoteContainer[] => {
        const nc: NoteContainer[] = [];
        this.colorNotes.forEach((n) => nc.push({ type: 'note', data: n }));
        this.sliders.forEach((s) => nc.push({ type: 'slider', data: s }));
        this.burstSliders.forEach((bs) => nc.push({ type: 'burstSlider', data: bs }));
        this.bombNotes.forEach((b) => nc.push({ type: 'bomb', data: b }));
        return nc.sort((a, b) => a.data.time - b.data.time);
    };

    /** Get container of basic events and boost events.
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getEventContainer = (): EventContainer[] => {
        const ec: EventContainer[] = [];
        this.basicBeatmapEvents.forEach((be) => ec.push({ type: 'basicEvent', data: be }));
        this.colorBoostBeatmapEvents.forEach((b) => ec.push({ type: 'boost', data: b }));
        return ec.sort((a, b) => a.data.time - b.data.time);
    };

    addBPMEvents = (...bpmEvents: (Partial<IBPMEvent> | BPMEvent)[]) => {
        this.bpmEvents.push(...bpmEvents.map((bpme) => (bpme instanceof BPMEvent ? bpme : BPMEvent.create(bpme)[0])));
    };
    addRotationEvents = (...rotationEvents: (Partial<IRotationEvent> | RotationEvent)[]) => {
        this.rotationEvents.push(
            ...rotationEvents.map((re) => (re instanceof RotationEvent ? re : RotationEvent.create(re)[0])),
        );
    };
    addColorNotes = (...colorNotes: (Partial<IColorNote> | ColorNote)[]) => {
        this.colorNotes.push(...colorNotes.map((cn) => (cn instanceof ColorNote ? cn : ColorNote.create(cn)[0])));
    };
    addBombNotes = (...bombNotes: (Partial<IBombNote> | BombNote)[]) => {
        this.bombNotes.push(...bombNotes.map((bn) => (bn instanceof BombNote ? bn : BombNote.create(bn)[0])));
    };
    addObstacles = (...obstacles: (Partial<IObstacle> | Obstacle)[]) => {
        this.obstacles.push(...obstacles.map((o) => (o instanceof Obstacle ? o : Obstacle.create(o)[0])));
    };
    addSliders = (...sliders: (Partial<ISlider> | Slider)[]) => {
        this.sliders.push(...sliders.map((s) => (s instanceof Slider ? s : Slider.create(s)[0])));
    };
    addBurstSliders = (...burstSliders: (Partial<IBurstSlider> | BurstSlider)[]) => {
        this.burstSliders.push(
            ...burstSliders.map((bs) => (bs instanceof BurstSlider ? bs : BurstSlider.create(bs)[0])),
        );
    };
    addWaypoints = (...waypoints: (Partial<IWaypoint> | Waypoint)[]) => {
        this.waypoints.push(...waypoints.map((w) => (w instanceof Waypoint ? w : Waypoint.create(w)[0])));
    };
    addBasicEvents = (...basicEvents: (Partial<IBasicEvent> | BasicEvent)[]) => {
        this.basicBeatmapEvents.push(
            ...basicEvents.map((be) => (be instanceof BasicEvent ? be : BasicEvent.create(be)[0])),
        );
    };
    addColorBoostEvents = (...colorBoostEvents: (Partial<IColorBoostEvent> | ColorBoostEvent)[]) => {
        this.colorBoostBeatmapEvents.push(
            ...colorBoostEvents.map((cbe) => (cbe instanceof ColorBoostEvent ? cbe : ColorBoostEvent.create(cbe)[0])),
        );
    };
    addLightColorEventBoxGroups = (
        ...lightColorEBGs: (DeepPartial<ILightColorEventBoxGroup> | LightColorEventBoxGroup)[]
    ) => {
        this.lightColorEventBoxGroups.push(
            ...lightColorEBGs.map((lcebg) =>
                lcebg instanceof LightColorEventBoxGroup ? lcebg : LightColorEventBoxGroup.create(lcebg)[0],
            ),
        );
    };
    addLightRotationEventBoxGroups = (
        ...lightRotationEBGs: (DeepPartial<ILightRotationEventBoxGroup> | LightRotationEventBoxGroup)[]
    ) => {
        this.lightRotationEventBoxGroups.push(
            ...lightRotationEBGs.map((lrebg) =>
                lrebg instanceof LightRotationEventBoxGroup ? lrebg : LightRotationEventBoxGroup.create(lrebg)[0],
            ),
        );
    };
}
