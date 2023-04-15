import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapWaypoint } from '../wrapper/waypoint';

/** Waypoint beatmap v2 class object. */
export class Waypoint extends WrapWaypoint<Required<IWaypoint>> {
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
    static create(...waypoints: Partial<IWrapWaypointAttribute<Required<IWaypoint>>>[]): Waypoint[];
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[];
    static create(
        ...waypoints: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<Required<IWaypoint>>>)[]
    ): Waypoint[];
    static create(
        ...waypoints: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<Required<IWaypoint>>>)[]
    ): Waypoint[] {
        const result: Waypoint[] = [];
        waypoints?.forEach((w) =>
            result.push(
                new this({
                    _time: w.time ?? w._time ?? Waypoint.default._time,
                    _lineIndex: w.posX ?? w._lineIndex ?? Waypoint.default._lineIndex,
                    _lineLayer: w.posY ?? w._lineLayer ?? Waypoint.default._lineLayer,
                    _offsetDirection:
                        w.direction ?? w._offsetDirection ?? Waypoint.default._offsetDirection,
                    _customData: w.customData ?? w._customData ?? Waypoint.default._customData(),
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

    get time() {
        return this.data._time;
    }
    set time(value: IWaypoint['_time']) {
        this.data._time = value;
    }

    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: IWaypoint['_lineIndex']) {
        this.data._lineIndex = value;
    }

    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: IWaypoint['_lineLayer']) {
        this.data._lineLayer = value;
    }

    get direction() {
        return this.data._offsetDirection;
    }
    set direction(value: IWaypoint['_offsetDirection']) {
        this.data._offsetDirection = value;
    }

    get customData(): NonNullable<IWaypoint['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<IWaypoint['_customData']>) {
        this.data._customData = value;
    }
}
