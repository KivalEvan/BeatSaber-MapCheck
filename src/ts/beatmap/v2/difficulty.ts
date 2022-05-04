import { ICustomDataDifficultyV2 } from '../../types/beatmap/shared/customData';
import { IDifficultyData } from '../../types/beatmap/v2/difficulty';
import { Serializable } from '../shared/serializable';
import { Note } from './note';
import { Slider } from './slider';
import { Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';
import { SpecialEventsKeywordFilters } from './specialEventsKeywordFilters';
import { deepCopy } from '../../utils/misc';

export class DifficultyData extends Serializable<IDifficultyData> {
    version: `2.${0 | 2 | 4 | 5 | 6}.0`;
    notes: Note[];
    sliders: Slider[];
    obstacles: Obstacle[];
    events: Event[];
    waypoints: Waypoint[];
    specialEventsKeywordFilters?: SpecialEventsKeywordFilters;
    customData: ICustomDataDifficultyV2;
    private constructor(data: Required<IDifficultyData>) {
        super(data);
        this.version = '2.6.0';
        this.notes = data._notes.map((obj) => Note.create(obj));
        this.sliders = data._sliders.map((obj) => Slider.create(obj));
        this.obstacles = data._obstacles.map((obj) => Obstacle.create(obj));
        this.events = data._events.map((obj) => Event.create(obj));
        this.waypoints = data._waypoints.map((obj) => Waypoint.create(obj));
        this.specialEventsKeywordFilters = SpecialEventsKeywordFilters.create(
            data._specialEventsKeywordFilters
        );
        this.customData = data._customData;
    }

    static create(data: Partial<IDifficultyData> = {}): DifficultyData {
        return new DifficultyData({
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

    toObject(): IDifficultyData {
        return {
            _version: this.version || '2.6.0',
            _notes: this.notes.map((obj) => obj.toObject()),
            _sliders: this.sliders.map((obj) => obj.toObject()),
            _obstacles: this.obstacles.map((obj) => obj.toObject()),
            _events: this.events.map((obj) => obj.toObject()),
            _waypoints: this.waypoints.map((obj) => obj.toObject()),
            _specialEventsKeywordFilters: this.specialEventsKeywordFilters?.toObject(),
            _customData: deepCopy(this.customData),
        };
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
                obstacleEnd = Math.max(
                    obstacleEnd,
                    this.obstacles[i].time + this.obstacles[i].duration
                );
            }
        }
        return obstacleEnd;
    };

    addNotes = (...notes: Partial<IDifficultyData['_notes'][number]>[]) => {
        notes.forEach((n) => {
            this.notes.push(Note.create(n));
        });
    };
    addObstacles = (...obstacles: Partial<IDifficultyData['_obstacles'][number]>[]) => {
        obstacles.forEach((o) => {
            this.obstacles.push(Obstacle.create(o));
        });
    };
    addEvents = (...events: Partial<IDifficultyData['_events'][number]>[]) => {
        events.forEach((e) => {
            this.events.push(Event.create(e));
        });
    };
    addWaypoints = (...waypoints: Partial<IDifficultyData['_waypoints'][number]>[]) => {
        waypoints.forEach((w) => {
            this.waypoints.push(Waypoint.create(w));
        });
    };
    addSliders = (...sliders: Partial<IDifficultyData['_sliders'][number]>[]) => {
        sliders.forEach((s) => {
            this.sliders.push(Slider.create(s));
        });
    };
}
