import { Vector2 } from '../../types/vector';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapObstacle } from '../wrapper/obstacle';

/** Object beatmap v2 class object. */
export class Obstacle extends WrapObstacle<Required<IObstacle>> {
    static default: ObjectReturnFn<Required<IObstacle>> = {
        _time: 0,
        _lineIndex: 0,
        _type: 0,
        _duration: 1,
        _width: 1,
        _customData: () => {
            return {};
        },
    };

    protected constructor(data: Required<IObstacle>) {
        super(data);
    }

    static create(): Obstacle[];
    static create(...obstacles: Partial<IWrapObstacleAttribute<Required<IObstacle>>>[]): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[];
    static create(
        ...obstacles: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): Obstacle[];
    static create(
        ...obstacles: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): Obstacle[] {
        const result: Obstacle[] = [];
        obstacles?.forEach((o) =>
            result.push(
                new this({
                    _time: o.time ?? o._time ?? Obstacle.default._time,
                    _type: o._type ?? Obstacle.default._type,
                    _lineIndex: o.posX ?? o._lineIndex ?? Obstacle.default._lineIndex,
                    _duration: o.duration ?? o._duration ?? Obstacle.default._duration,
                    _width: o.width ?? o._width ?? Obstacle.default._width,
                    _customData: o.customData ?? o._customData ?? Obstacle.default._customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _time: Obstacle.default._time,
                _type: Obstacle.default._type,
                _lineIndex: Obstacle.default._lineIndex,
                _duration: Obstacle.default._duration,
                _width: Obstacle.default._width,
                _customData: Obstacle.default._customData(),
            }),
        ];
    }

    toJSON(): Required<IObstacle> {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.posX,
            _duration: this.duration,
            _width: this.width,
            _customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data._time;
    }
    set time(value: IObstacle['_time']) {
        this.data._time = value;
    }

    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: IObstacle['_lineIndex']) {
        this.data._lineIndex = value;
    }

    get type() {
        return this.data._type;
    }
    set type(value: IObstacle['_type']) {
        this.data._type = value;
    }

    get posY() {
        return this.type == 1 ? 0 : 2;
    }
    set posY(value: 0 | 2) {
        if (value != 0 && value != 2) {
            this.type = 0;
            return;
        }
    }

    get duration() {
        return this.data._duration;
    }
    set duration(value: IObstacle['_duration']) {
        this.data._duration = value;
    }

    get width() {
        return this.data._width;
    }
    set width(value: IObstacle['_width']) {
        this.data._width = value;
    }

    get height() {
        return this.type == 1 ? 3 : 5;
    }
    set height(value: 3 | 5) {
        if (value != 3 && value != 5) {
            this.type = 0;
            return;
        }
    }

    get customData(): NonNullable<IObstacle['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<IObstacle['_customData']>) {
        this.data._customData = value;
    }

    getPosition(): Vector2 {
        if (this.customData._position) {
            return [this.customData._position[0], this.customData._position[1]];
        }
        return super.getPosition();
    }

    isChroma(): boolean {
        return Array.isArray(this.customData._color);
    }

    isNoodleExtensions(): boolean {
        return (
            Array.isArray(this.customData._animation) ||
            typeof this.customData._fake === 'boolean' ||
            typeof this.customData._interactable === 'boolean' ||
            Array.isArray(this.customData._localRotation) ||
            typeof this.customData._noteJumpMovementSpeed === 'number' ||
            typeof this.customData._noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData._position) ||
            Array.isArray(this.customData._rotation) ||
            Array.isArray(this.customData._scale) ||
            typeof this.customData._track === 'string'
        );
    }
}
