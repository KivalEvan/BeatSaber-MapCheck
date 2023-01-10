import { Vector2 } from '../../types/vector';
import { IObstacle } from '../../types/beatmap/v2/obstacle';
import { IWrapObstacle } from '../../types/beatmap/wrapper/obstacle';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapObstacle } from '../wrapper/obstacle';

/** Object beatmap v2 class object. */
export class Obstacle extends WrapObstacle<Required<IObstacle>> {
    static default: ObjectReturnFn<Required<IObstacle>> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _duration: 1,
        _width: 1,
        _height: 1,
        _customData: () => {
            return {};
        },
    };

    protected constructor(data: Required<IObstacle>) {
        super(data);
    }

    static create(): Obstacle[];
    static create(...obstacles: PartialWrapper<IWrapObstacle<Required<IObstacle>>>[]): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[];
    static create(
        ...obstacles: (Partial<IObstacle> & PartialWrapper<IWrapObstacle<Required<IObstacle>>>)[]
    ): Obstacle[];
    static create(
        ...obstacles: (Partial<IObstacle> & PartialWrapper<IWrapObstacle<Required<IObstacle>>>)[]
    ): Obstacle[] {
        const result: Obstacle[] = [];
        obstacles?.forEach((o) =>
            result.push(
                new this({
                    _time: o.time ?? o._time ?? Obstacle.default._time,
                    _type: o._type ?? Obstacle.default._type,
                    _lineIndex: o.posX ?? o._lineIndex ?? Obstacle.default._lineIndex,
                    _lineLayer: o.posY ?? o._lineLayer ?? Obstacle.default._lineLayer,
                    _duration: o.duration ?? o._duration ?? Obstacle.default._duration,
                    _width: o.width ?? o._width ?? Obstacle.default._width,
                    _height: o.height ?? o._height ?? Obstacle.default._height,
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
                _lineLayer: Obstacle.default._lineLayer,
                _duration: Obstacle.default._duration,
                _width: Obstacle.default._width,
                _height: Obstacle.default._height,
                _customData: Obstacle.default._customData(),
            }),
        ];
    }

    toJSON(): Required<IObstacle> {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _duration: this.duration,
            _width: this.width,
            _height: this.height,
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

    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: IObstacle['_lineLayer']) {
        this.data._lineLayer = value;
    }

    get type() {
        return this.data._type;
    }
    set type(value: IObstacle['_type']) {
        this.data._type = value;
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
        return this.data._height;
    }
    set height(value: IObstacle['_height']) {
        this.data._height = value;
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
