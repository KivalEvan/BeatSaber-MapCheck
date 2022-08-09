import { IWaypoint } from '../../types/beatmap/v3/waypoint';
import { ObjectReturnFn } from '../../types/utils';
import { LINE_COUNT } from '../shared/constants';
import { BaseObject } from './baseObject';
import { deepCopy } from '../../utils/misc';

/** Waypoint beatmap v3 class object. */
export class Waypoint extends BaseObject<IWaypoint> {
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
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[];
    static create(...waypoints: Partial<IWaypoint>[]): Waypoint[] {
        const result: Waypoint[] = [];
        waypoints?.forEach((w) =>
            result.push(
                new this({
                    b: w.b ?? Waypoint.default.b,
                    x: w.x ?? Waypoint.default.x,
                    y: w.y ?? Waypoint.default.y,
                    d: w.d ?? Waypoint.default.d,
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
        return this.data.x;
    }
    set posX(value: IWaypoint['x']) {
        this.data.x = value;
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
        return this.data.y;
    }
    set posY(value: IWaypoint['y']) {
        this.data.y = value;
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
        return this.data.d;
    }
    set direction(value: IWaypoint['d']) {
        this.data.d = value;
    }

    setPosX(value: IWaypoint['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IWaypoint['y']) {
        this.posY = value;
        return this;
    }
    setDirection(value: IWaypoint['d']) {
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
