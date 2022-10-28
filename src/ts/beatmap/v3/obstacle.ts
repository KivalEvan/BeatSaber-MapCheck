import { IObstacle } from '../../types/beatmap/v3/obstacle';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapObstacle } from '../wrapper/obstacle';

/** Obstacle beatmap v3 class object. */
export class Obstacle extends WrapObstacle<Required<IObstacle>> {
    static default: ObjectReturnFn<Required<IObstacle>> = {
        b: 0,
        x: 0,
        y: 0,
        d: 1,
        w: 1,
        h: 1,
        customData: () => {
            return {};
        },
    };

    protected constructor(obstacle: Required<IObstacle>) {
        super(obstacle);
    }

    static create(): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[] {
        const result: Obstacle[] = [];
        obstacles?.forEach((o) =>
            result.push(
                new this({
                    b: o.b ?? Obstacle.default.b,
                    x: o.x ?? Obstacle.default.x,
                    y: o.y ?? Obstacle.default.y,
                    d: o.d ?? Obstacle.default.d,
                    w: o.w ?? Obstacle.default.w,
                    h: o.h ?? Obstacle.default.h,
                    customData: o.customData ?? Obstacle.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: Obstacle.default.b,
                x: Obstacle.default.x,
                y: Obstacle.default.y,
                d: Obstacle.default.d,
                w: Obstacle.default.w,
                h: Obstacle.default.h,
                customData: Obstacle.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IObstacle> {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
            d: this.duration,
            w: this.width,
            h: this.height,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IObstacle['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: IObstacle['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: IObstacle['y']) {
        this.data.y = value;
    }

    get duration() {
        return this.data.d;
    }
    set duration(value: IObstacle['d']) {
        this.data.d = value;
    }

    get width() {
        return this.data.w;
    }
    set width(value: IObstacle['w']) {
        this.data.w = value;
    }

    get height() {
        return this.data.h;
    }
    set height(value: IObstacle['h']) {
        this.data.h = value;
    }

    get customData(): NonNullable<IObstacle['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IObstacle['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<IObstacle['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: IObstacle['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }

    mirror() {
        const width = this.customData.size?.[0] ?? this.width;
        if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
        }
        if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
                this.customData.animation.definitePosition.forEach((dp) => {
                    dp[0] = -dp[0] - (this.posX + width - 1);
                });
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
                this.customData.animation.offsetPosition.forEach((op) => {
                    op[0] = -op[0] - (this.posX + width - 1);
                });
                // fuck mirroring this tbh
            }
        }
        return super.mirror();
    }

    getPosition(): [number, number] {
        if (this.customData.coordinates) {
            return [this.customData.coordinates[0], this.customData.coordinates[1]];
        }
        return super.getPosition();
    }

    isChroma(): boolean {
        return Array.isArray(this.customData.color);
    }

    isNoodleExtensions(): boolean {
        return (
            Array.isArray(this.customData.animation) ||
            typeof this.customData.uninteractable === 'boolean' ||
            Array.isArray(this.customData.localRotation) ||
            typeof this.customData.noteJumpMovementSpeed === 'number' ||
            typeof this.customData.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData.coordinates) ||
            Array.isArray(this.customData.worldRotation) ||
            Array.isArray(this.customData.size) ||
            typeof this.customData.track === 'string'
        );
    }
}
