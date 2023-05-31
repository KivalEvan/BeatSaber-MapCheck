import { IWaypoint } from '../../types/beatmap/v2/waypoint';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapWaypoint } from '../wrapper/waypoint';

/** Waypoint beatmap v2 class object. */
export class Waypoint extends WrapWaypoint<IWaypoint> {
    static default: ObjectReturnFn<IWaypoint> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _offsetDirection: 0,
        _customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapWaypointAttribute<IWaypoint>>);
    constructor(data: Partial<IWaypoint>);
    constructor(data: Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>);
    constructor(data: Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>> = {}) {
        super();

        this._time = data.time ?? data._time ?? Waypoint.default._time;
        this._posX = data.posX ?? data._lineIndex ?? Waypoint.default._lineIndex;
        this._posY = data.posY ?? data._lineLayer ?? Waypoint.default._lineLayer;
        this._direction =
            data.direction ?? data._offsetDirection ?? Waypoint.default._offsetDirection;
        this._customData = data.customData ?? data._customData ?? Waypoint.default._customData();
    }

    static create(): Waypoint[];
    static create(...data: Partial<IWrapWaypointAttribute<IWaypoint>>[]): Waypoint[];
    static create(...data: Partial<IWaypoint>[]): Waypoint[];
    static create(
        ...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]
    ): Waypoint[];
    static create(
        ...data: (Partial<IWaypoint> & Partial<IWrapWaypointAttribute<IWaypoint>>)[]
    ): Waypoint[] {
        const result: Waypoint[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IWaypoint {
        return {
            _time: this.time,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _offsetDirection: this.direction,
            _customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IWaypoint['_customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IWaypoint['_customData']>) {
        this._customData = value;
    }
}
