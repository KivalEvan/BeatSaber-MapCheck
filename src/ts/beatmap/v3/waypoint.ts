import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapWaypoint } from '../wrapper/waypoint';

/** Waypoint beatmap v3 class object. */
export class Waypoint extends WrapWaypoint<Required<IWaypoint>> {
    static default: ObjectReturnFn<Required<IWaypoint>> = {
        b: 0,
        x: 0,
        y: 0,
        d: 1,
        customData: () => {
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
                    b: w.time ?? w.b ?? Waypoint.default.b,
                    x: w.posX ?? w.x ?? Waypoint.default.x,
                    y: w.posY ?? w.y ?? Waypoint.default.y,
                    d: w.direction ?? w.d ?? Waypoint.default.d,
                    customData: w.customData ?? Waypoint.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: Waypoint.default.b,
                x: Waypoint.default.x,
                y: Waypoint.default.y,
                d: Waypoint.default.d,
                customData: Waypoint.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IWaypoint> {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IWaypoint['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: IWaypoint['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: IWaypoint['y']) {
        this.data.y = value;
    }

    get direction() {
        return this.data.d;
    }
    set direction(value: IWaypoint['d']) {
        this.data.d = value;
    }

    get customData(): NonNullable<IWaypoint['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IWaypoint['customData']>) {
        this.data.customData = value;
    }
}
