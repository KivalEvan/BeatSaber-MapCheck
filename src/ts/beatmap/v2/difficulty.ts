import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Note } from './note';
import { Slider } from './slider';
import { Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';
import { SpecialEventsKeywordFilters } from './specialEventsKeywordFilters';
import { deepCopy } from '../../utils/misc';
import { INote } from '../../types/beatmap/v2/note';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import {
    IEvent,
    IEventBoost,
    IEventBPMChange,
    IEventLaneRotation,
} from '../../types/beatmap/v2/event';
import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { ISlider } from '../../types/beatmap/v2/slider';
import { WrapDifficulty } from '../wrapper/difficulty';
import logger from '../../logger';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapBombNoteAttribute } from '../../types/beatmap/wrapper/bombNote';
import { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent';
import { IWrapSliderAttribute } from '../../types/beatmap/wrapper/slider';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';

/** Difficulty beatmap v2 class object. */
export class Difficulty extends WrapDifficulty<Required<IDifficulty>> {
    version: `2.${0 | 2 | 4 | 5 | 6}.0`;
    bpmEvents: never[] = [];
    rotationEvents: never[] = [];
    colorNotes: Note[];
    bombNotes: never[] = [];
    obstacles: Obstacle[];
    sliders: Slider[];
    burstSliders: never[] = [];
    waypoints: Waypoint[];
    basicEvents: Event[];
    colorBoostEvents: never[] = [];
    lightColorEventBoxGroups: never[] = [];
    lightRotationEventBoxGroups: never[] = [];
    lightTranslationEventBoxGroups: never[] = [];
    eventTypesWithKeywords: SpecialEventsKeywordFilters;
    useNormalEventsAsCompatibleEvents = true;
    protected constructor(data: Required<IDifficulty>) {
        super(data);
        this.version = '2.6.0';
        this.colorNotes = data._notes.map((obj) => Note.create(obj)[0]);
        this.sliders = data._sliders.map((obj) => Slider.create(obj)[0]);
        this.obstacles = data._obstacles.map((obj) => Obstacle.create(obj)[0]);
        this.basicEvents = data._events.map((obj) => Event.create(obj)[0]);
        this.waypoints = data._waypoints.map((obj) => Waypoint.create(obj)[0]);
        this.eventTypesWithKeywords = SpecialEventsKeywordFilters.create(
            data._specialEventsKeywordFilters,
        );
        this.customData = data._customData;
    }

    static create(data: Partial<IDifficulty> = {}): Difficulty {
        return new this({
            _version: '2.6.0',
            _notes: data._notes ?? [],
            _sliders: data._sliders ?? [],
            _obstacles: data._obstacles ?? [],
            _events: data._events ?? [],
            _waypoints: data._waypoints ?? [],
            _specialEventsKeywordFilters: data._specialEventsKeywordFilters ?? {
                _keywords: [],
            },
            _customData: data._customData ?? {},
        });
    }

    toJSON(): Required<IDifficulty> {
        return {
            _version: '2.6.0',
            _notes: this.colorNotes.map((obj) => obj.toJSON()),
            _sliders: this.sliders.map((obj) => obj.toJSON()),
            _obstacles: this.obstacles.map((obj) => obj.toJSON()),
            _events: this.basicEvents.map((obj) => obj.toJSON()),
            _waypoints: this.waypoints.map((obj) => obj.toJSON()),
            _specialEventsKeywordFilters: this.eventTypesWithKeywords.toJSON(),
            _customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IDifficulty['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<IDifficulty['_customData']>) {
        this.data._customData = value;
    }

    addBPMEvents(...events: Partial<IWrapBPMEventAttribute>[]): void;
    addBPMEvents(...events: Partial<IEventBPMChange>[]): void;
    addBPMEvents(
        ...events: (Partial<IEventBPMChange> &
            Partial<IWrapBPMEventAttribute<Required<IEventBPMChange>>>)[]
    ): void;
    addBPMEvents(
        ...events: (Partial<IEventBPMChange> &
            Partial<IWrapBPMEventAttribute<Required<IEventBPMChange>>>)[]
    ): void {
        this.basicEvents.push(
            ...events.map((bpme) => {
                return bpme instanceof Event
                    ? bpme
                    : Event.create({ ...bpme, type: 100, value: bpme.bpm })[0];
            }),
        );
    }

    addRotationEvents(...events: Partial<IWrapRotationEventAttribute>[]): void;
    addRotationEvents(...events: Partial<IEventLaneRotation>[]): void;
    addRotationEvents(
        ...events: (Partial<IEventLaneRotation> &
            Partial<IWrapRotationEventAttribute<Required<IEventLaneRotation>>>)[]
    ): void;
    addRotationEvents(
        ...events: (Partial<IEventLaneRotation> &
            Partial<IWrapRotationEventAttribute<Required<IEventLaneRotation>>>)[]
    ): void {
        this.basicEvents.push(
            ...events.map((re) =>
                re instanceof Event
                    ? re
                    : Event.create({
                          ...re,
                          type:
                              typeof re.executionTime === 'number'
                                  ? re.executionTime === 0
                                      ? 14
                                      : 15
                                  : re._type,
                      })[0],
            ),
        );
        logger.warn('This may not work correctly');
    }

    addColorNotes(...colorNotes: Partial<IWrapColorNoteAttribute<Required<INote>>>[]): void;
    addColorNotes(...colorNotes: Partial<INote>[]): void;
    addColorNotes(
        ...colorNotes: (Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>>)[]
    ): void;
    addColorNotes(
        ...colorNotes: (Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>>)[]
    ): void {
        this.colorNotes.push(
            ...colorNotes.map((cn) => (cn instanceof Note ? cn : Note.create(cn)[0])),
        );
    }

    addBombNotes(...notes: Partial<IWrapBombNoteAttribute<Required<INote>>>[]): void;
    addBombNotes(...notes: Partial<INote>[]): void;
    addBombNotes(
        ...notes: (Partial<INote> & Partial<IWrapBombNoteAttribute<Required<INote>>>)[]
    ): void;
    addBombNotes(
        ...notes: (Partial<INote> & Partial<IWrapBombNoteAttribute<Required<INote>>>)[]
    ): void {
        this.colorNotes.push(
            ...notes.map((bn) => (bn instanceof Note ? bn : Note.create({ ...bn, type: 3 })[0])),
        );
    }

    addObstacles(...obstacles: Partial<IWrapObstacleAttribute<Required<IObstacle>>>[]): void;
    addObstacles(...obstacles: Partial<IObstacle>[]): void;
    addObstacles(
        ...obstacles: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): void;
    addObstacles(
        ...obstacles: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): void {
        this.obstacles.push(
            ...obstacles.map((o) => (o instanceof Obstacle ? o : Obstacle.create(o)[0])),
        );
    }

    addSliders(...sliders: Partial<IWrapSliderAttribute<Required<ISlider>>>[]): void;
    addSliders(...sliders: Partial<ISlider>[]): void;
    addSliders(
        ...sliders: (Partial<ISlider> & Partial<IWrapSliderAttribute<Required<ISlider>>>)[]
    ): void;
    addSliders(
        ...sliders: (Partial<ISlider> & Partial<IWrapSliderAttribute<Required<ISlider>>>)[]
    ): void {
        this.sliders.push(...sliders.map((s) => (s instanceof Slider ? s : Slider.create(s)[0])));
    }

    addBurstSliders(..._: never[]): void {
        logger.warn('Burst Slider does not exist in beatmap V2');
    }

    addWaypoints(...waypoints: Partial<IWrapWaypointAttribute<Required<IWaypoint>>>[]): void;
    addWaypoints(...waypoints: Partial<IWaypoint>[]): void;
    addWaypoints(
        ...waypoints: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<Required<IWaypoint>>>)[]
    ): void;
    addWaypoints(
        ...waypoints: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<Required<IWaypoint>>>)[]
    ): void {
        this.waypoints.push(
            ...waypoints.map((w) => (w instanceof Waypoint ? w : Waypoint.create(w)[0])),
        );
    }

    addBasicEvents(...basicEvents: Partial<IWrapEventAttribute<Required<IEvent>>>[]): void;
    addBasicEvents(...basicEvents: Partial<IEvent>[]): void;
    addBasicEvents(
        ...basicEvents: (Partial<IEvent> & Partial<IWrapEventAttribute<Required<IEvent>>>)[]
    ): void;
    addBasicEvents(
        ...basicEvents: (Partial<IEvent> & Partial<IWrapEventAttribute<Required<IEvent>>>)[]
    ): void {
        this.basicEvents.push(
            ...basicEvents.map((be) => (be instanceof Event ? be : Event.create(be)[0])),
        );
    }

    addColorBoostEvents(
        ...basicEvents: Partial<IWrapColorBoostEventAttribute<Required<IEventBoost>>>[]
    ): void;
    addColorBoostEvents(...basicEvents: Partial<IEventBoost>[]): void;
    addColorBoostEvents(
        ...basicEvents: (Partial<IEventBoost> &
            Partial<IWrapColorBoostEventAttribute<Required<IEventBoost>>>)[]
    ): void;
    addColorBoostEvents(
        ...basicEvents: (Partial<IEventBoost> &
            Partial<IWrapColorBoostEventAttribute<Required<IEventBoost>>>)[]
    ): void {
        this.basicEvents.push(
            ...basicEvents.map((e) =>
                e instanceof Event ? e : Event.create({ ...e, value: e.toggle ? 1 : e._value })[0],
            ),
        );
    }

    addLightColorEventBoxGroups(..._: never[]): void {
        logger.warn('Light Color Event Box Group does not exist in beatmap V2');
    }

    addLightRotationEventBoxGroups(..._: never[]): void {
        logger.warn('Light Rotation Event Box Group does not exist in beatmap V2');
    }

    addLightTranslationEventBoxGroups(..._: never[]): void {
        logger.warn('Light Translation Event Box Group does not exist in beatmap V2');
    }

    isValid(): boolean {
        throw new Error('Method not implemented.');
    }
}
