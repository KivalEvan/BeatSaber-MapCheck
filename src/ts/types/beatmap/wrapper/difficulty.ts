import { IWrapBPMEvent } from './bpmEvent';
import { IWrapRotationEvent } from './rotationEvent';
import { IWrapColorNote } from './colorNote';
import { IWrapBombNote } from './bombNote';
import { IWrapObstacle } from './obstacle';
import { IWrapSlider } from './slider';
import { IWrapBurstSlider } from './burstSlider';
import { IWrapWaypoint } from './waypoint';
import { IWrapEvent } from './event';
import { IWrapColorBoostEvent } from './colorBoostEvent';
import { IWrapLightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { IWrapLightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { IWrapLightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup';
import { IWrapEventTypesWithKeywords } from './eventTypesWithKeywords';
import { IWrapBaseItem } from './baseItem';
import { Version } from '../shared/version';
import { DeepPartialWrapper, LooseAutocomplete, PartialWrapper } from '../../utils';
import { GenericFileName } from '../shared/info';
import { EventContainer, NoteContainer } from './container';
import { BeatPerMinute } from '../../../beatmap/shared/bpm';

export interface IWrapDifficulty<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseItem<T> {
    version: Version;
    bpmEvents: IWrapBPMEvent[];
    rotationEvents: IWrapRotationEvent[];
    colorNotes: IWrapColorNote[];
    bombNotes: IWrapBombNote[];
    obstacles: IWrapObstacle[];
    sliders: IWrapSlider[];
    burstSliders: IWrapBurstSlider[];
    waypoints: IWrapWaypoint[];
    basicEvents: IWrapEvent[];
    colorBoostEvents: IWrapColorBoostEvent[];
    lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
    lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
    lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
    eventTypesWithKeywords: IWrapEventTypesWithKeywords;
    useNormalEventsAsCompatibleEvents: boolean;

    fileName: string;
    setFileName(fileName: LooseAutocomplete<GenericFileName>): this;

    /** Calculate note per second.
     * ```ts
     * const nps = difficulty.nps(Difficulty, 10);
     * ```
     * ---
     * **NOTE:** Duration can be either in any time type.
     */
    nps(duration: number): number;

    /** Calculate the peak by rolling average.
     * ```ts
     * const peakNPS = difficulty.peak(Difficulty, 10, BPM ?? 128);
     * ```
     */
    peak(beat: number, bpm: BeatPerMinute | number): number;

    /** Get first interactible object beat time in beatmap.
     * ```ts
     * const firstInteractiveTime = difficulty.getFirstInteractiveTime(Difficulty);
     * ```
     */
    getFirstInteractiveTime(): number;

    /** Get last interactible object beat time in beatmap.
     * ```ts
     * const lastInteractiveTime = difficulty.getLastInteractiveTime(Difficulty);
     * ```
     */
    getLastInteractiveTime(): number;

    /** Get first interactible obstacle beat time in beatmap.
     * ```ts
     * const firstInteractiveObstacleTime = difficulty.findFirstInteractiveObstacleTime(obstacles);
     * ```
     */
    findFirstInteractiveObstacleTime(): number;

    /** Get last interactible obstacle beat time in beatmap.
     * ```ts
     * const lastInteractiveObstacleTime = difficulty.findLastInteractiveObstacleTime(obstacles);
     * ```
     */
    findLastInteractiveObstacleTime(): number;

    /** Get container of color notes, sliders, burst sliders, and bombs (in order).
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getNoteContainer(): NoteContainer[];

    /** Get container of basic events and boost events.
     * ```ts
     * const noteCountainer = getNoteContainer(Difficulty);
     * ```
     */
    getEventContainer(): EventContainer[];

    addBPMEvents(...bpmEvents: Partial<IWrapBPMEvent>[]): void;
    addRotationEvents(...rotationEvents: PartialWrapper<IWrapRotationEvent>[]): void;
    addColorNotes(...colorNotes: PartialWrapper<IWrapColorNote>[]): void;
    addBombNotes(...bombNotes: PartialWrapper<IWrapBombNote>[]): void;
    addObstacles(...obstacles: PartialWrapper<IWrapObstacle>[]): void;
    addSliders(...sliders: PartialWrapper<IWrapSlider>[]): void;
    addBurstSliders(...burstSliders: PartialWrapper<IWrapBurstSlider>[]): void;
    addWaypoints(...waypoints: PartialWrapper<IWrapWaypoint>[]): void;
    addBasicEvents(...basicEvents: PartialWrapper<IWrapEvent>[]): void;
    addColorBoostEvents(...colorBoostEvents: PartialWrapper<IWrapColorBoostEvent>[]): void;
    addLightColorEventBoxGroups(...lightColorEBGs: DeepPartialWrapper<IWrapLightColorEventBoxGroup>[]): void;
    addLightRotationEventBoxGroups(...lightRotationEBGs: DeepPartialWrapper<IWrapLightRotationEventBoxGroup>[]): void;
    addLightTranslationEventBoxGroups(
        ...lightTranslationEBGs: DeepPartialWrapper<IWrapLightTranslationEventBoxGroup>[]
    ): void;
}
