import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { LINE_COUNT } from '../shared/constants';
import { BeatmapObject } from './object';

/** Waypoint beatmap object. */
export class Waypoint extends BeatmapObject<IWaypoint> {
    static default: Required<IWaypoint> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _offsetDirection: 1,
    };

    private constructor(waypoint: Required<IWaypoint>) {
        super(waypoint);
    }

    toObject(): IWaypoint {
        return {
            _time: this.time,
            _lineIndex: this.lineIndex,
            _lineLayer: this.lineLayer,
            _offsetDirection: this.direction,
        };
    }

    static create(): Waypoint;
    static create(waypoints: Partial<IWaypoint>): Waypoint;
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[];
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint | Waypoint[] {
        const result: Waypoint[] = [];
        waypoints?.forEach((w) =>
            result.push(
                new Waypoint({
                    _time: w._time ?? Waypoint.default._time,
                    _lineIndex: w._lineIndex ?? Waypoint.default._lineIndex,
                    _lineLayer: w._lineLayer ?? Waypoint.default._lineLayer,
                    _offsetDirection:
                        w._offsetDirection ?? Waypoint.default._offsetDirection,
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new Waypoint({
            _time: Waypoint.default._time,
            _lineIndex: Waypoint.default._lineIndex,
            _lineLayer: Waypoint.default._lineLayer,
            _offsetDirection: Waypoint.default._offsetDirection,
        });
    }

    /** Position x `<int>` of waypoint.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `unknown`
     */
    get lineIndex() {
        return this.data._lineIndex;
    }
    set lineIndex(value: IWaypoint['_lineIndex']) {
        this.data._lineIndex = value;
    }

    /** Position y `<int>` of waypoint.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `unknown`
     */
    get lineLayer() {
        return this.data._lineLayer;
    }
    set lineLayer(value: IWaypoint['_lineLayer']) {
        this.data._lineLayer = value;
    }

    /** Offset direction `<int>` of waypoint.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    get direction() {
        return this.data._offsetDirection;
    }
    set direction(value: IWaypoint['_offsetDirection']) {
        this.data._offsetDirection = value;
    }

    setLineIndex(value: IWaypoint['_lineIndex']) {
        this.lineIndex = value;
        return this;
    }
    setLineLayer(value: IWaypoint['_lineLayer']) {
        this.lineLayer = value;
        return this;
    }
    setDirection(value: IWaypoint['_offsetDirection']) {
        this.direction = value;
        return this;
    }

    mirror() {
        this.lineIndex = LINE_COUNT - 1 - this.lineIndex;
        switch (this.direction) {
            case 2:
                this.direction = 3;
                break;
            case 3:
                this.direction = 2;
                break;
            case 6:
                this.direction = 7;
                break;
            case 7:
                this.direction = 6;
                break;
            case 4:
                this.direction = 5;
                break;
            case 5:
                this.direction = 4;
                break;
        }
        return this;
    }
}
