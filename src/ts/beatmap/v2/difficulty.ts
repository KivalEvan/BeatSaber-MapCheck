import { ICustomDataDifficulty } from '../../types/beatmap/v2/customData';
import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Serializable } from '../shared/serializable';
import { Note } from './note';
import { Slider } from './slider';
import { Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';
import { SpecialEventsKeywordFilters } from './specialEventsKeywordFilters';
import { deepCopy } from '../../utils/misc';
import { GenericFileName } from '../../types/beatmap/shared/info';
import { LooseAutocomplete } from '../../types/utils';
import { INote } from '../../types/beatmap/v2/note';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import { IEvent } from '../../types/beatmap/v2/event';
import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { ISlider } from '../../types/beatmap/v2/slider';

/** Difficulty beatmap v2 class object. */
export class Difficulty extends Serializable<IDifficulty> {
    private _fileName = 'UnnamedDifficulty.dat';

    version: `2.${0 | 2 | 4 | 5 | 6}.0`;
    notes: Note[];
    sliders: Slider[];
    obstacles: Obstacle[];
    events: Event[];
    waypoints: Waypoint[];
    specialEventsKeywordFilters: SpecialEventsKeywordFilters;
    customData: ICustomDataDifficulty;
    protected constructor(data: Required<IDifficulty>) {
        super(data);
        this.version = '2.6.0';
        this.notes = data._notes.map((obj) => Note.create(obj)[0]);
        this.sliders = data._sliders.map((obj) => Slider.create(obj)[0]);
        this.obstacles = data._obstacles.map((obj) => Obstacle.create(obj)[0]);
        this.events = data._events.map((obj) => Event.create(obj)[0]);
        this.waypoints = data._waypoints.map((obj) => Waypoint.create(obj)[0]);
        this.specialEventsKeywordFilters = SpecialEventsKeywordFilters.create(data._specialEventsKeywordFilters);
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
            _version: this.version || '2.6.0',
            _notes: this.notes.map((obj) => obj.toJSON()),
            _sliders: this.sliders.map((obj) => obj.toJSON()),
            _obstacles: this.obstacles.map((obj) => obj.toJSON()),
            _events: this.events.map((obj) => obj.toJSON()),
            _waypoints: this.waypoints.map((obj) => obj.toJSON()),
            _specialEventsKeywordFilters: this.specialEventsKeywordFilters.toJSON(),
            _customData: deepCopy(this.customData),
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

    getFirstInteractiveTime = (): number => {
        let firstNoteTime = Number.MAX_VALUE;
        if (this.notes.length > 0) {
            firstNoteTime = this.notes[0].time;
        }
        const firstInteractiveObstacleTime = this.findFirstInteractiveObstacleTime();
        return Math.min(firstNoteTime, firstInteractiveObstacleTime);
    };

    getLastInteractiveTime = (): number => {
        let lastNoteTime = 0;
        if (this.notes.length > 0) {
            lastNoteTime = this.notes[this.notes.length - 1].time;
        }
        const lastInteractiveObstacleTime = this.findLastInteractiveObstacleTime();
        return Math.max(lastNoteTime, lastInteractiveObstacleTime);
    };

    findFirstInteractiveObstacleTime = (): number => {
        for (let i = 0, len = this.obstacles.length; i < len; i++) {
            if (this.obstacles[i].isInteractive()) {
                return this.obstacles[i].time;
            }
        }
        return Number.MAX_VALUE;
    };

    findLastInteractiveObstacleTime = (): number => {
        let obstacleEnd = 0;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isInteractive()) {
                obstacleEnd = Math.max(obstacleEnd, this.obstacles[i].time + this.obstacles[i].duration);
            }
        }
        return obstacleEnd;
    };

    addNotes = (...notes: (Partial<INote> | Note)[]) => {
        this.notes.push(...notes.map((n) => (n instanceof Note ? n : Note.create(n)[0])));
    };
    addObstacles = (...obstacles: (Partial<IObstacle> | Obstacle)[]) => {
        this.obstacles.push(...obstacles.map((o) => (o instanceof Obstacle ? o : Obstacle.create(o)[0])));
    };
    addEvents = (...events: (Partial<IEvent> | Event)[]) => {
        this.events.push(...events.map((e) => (e instanceof Event ? e : Event.create(e)[0])));
    };
    addWaypoints = (...waypoints: (Partial<IWaypoint> | Waypoint)[]) => {
        this.waypoints.push(...waypoints.map((w) => (w instanceof Waypoint ? w : Waypoint.create(w)[0])));
    };
    addSliders = (...sliders: (Partial<ISlider> | Slider)[]) => {
        this.sliders.push(...sliders.map((s) => (s instanceof Slider ? s : Slider.create(s)[0])));
    };
}
