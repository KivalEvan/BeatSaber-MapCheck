import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { ObjectReturnFn } from '../../types/utils';
import { LINE_COUNT } from '../shared/constants';
import { BeatmapObject } from './object';
import { deepCopy } from '../../utils/misc';

/** Waypoint beatmap v2 class object. */
export class Waypoint extends BeatmapObject<IWaypoint> {
    static default: ObjectReturnFn<Required<IWaypoint>> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _offsetDirection: 1,
        _customData: () => {
            return {};
        },
    };

    protected constructor(waypoint: Required<IWaypoint>) {
        super(waypoint);
    }

    static create(): Waypoint[];
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[];
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[] {
        const result: Waypoint[] = [];
        waypoints?.forEach((w) =>
            result.push(
                new this({
                    _time: w._time ?? Waypoint.default._time,
                    _lineIndex: w._lineIndex ?? Waypoint.default._lineIndex,
                    _lineLayer: w._lineLayer ?? Waypoint.default._lineLayer,
                    _offsetDirection: w._offsetDirection ?? Waypoint.default._offsetDirection,
                    _customData: w._customData ?? Waypoint.default._customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _time: Waypoint.default._time,
                _lineIndex: Waypoint.default._lineIndex,
                _lineLayer: Waypoint.default._lineLayer,
                _offsetDirection: Waypoint.default._offsetDirection,
                _customData: Waypoint.default._customData(),
            }),
        ];
    }

    toJSON(): Required<IWaypoint> {
        return {
            _time: this.time,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _offsetDirection: this.direction,
            _customData: deepCopy(this.customData),
        };
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
    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: IWaypoint['_lineIndex']) {
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
    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: IWaypoint['_lineLayer']) {
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

    setPosX(value: IWaypoint['_lineIndex']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IWaypoint['_lineLayer']) {
        this.posY = value;
        return this;
    }
    setDirection(value: IWaypoint['_offsetDirection']) {
        this.direction = value;
        return this;
    }

    mirror() {
        this.posX = LINE_COUNT - 1 - this.posX;
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
