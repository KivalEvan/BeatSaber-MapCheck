import { IObstacle } from '../../types/beatmap/v2/obstacle';
import { ObjectReturnFn } from '../../types/utils';
import { BeatmapObject } from './object';
import { deepCopy } from '../../utils/misc';

/** Object beatmap v2 class object. */
export class Obstacle extends BeatmapObject<IObstacle> {
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
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[] {
        const result: Obstacle[] = [];
        obstacles?.forEach((o) =>
            result.push(
                new this({
                    _time: o._time ?? Obstacle.default._time,
                    _type: o._type ?? Obstacle.default._type,
                    _lineIndex: o._lineIndex ?? Obstacle.default._lineIndex,
                    _lineLayer: o._lineLayer ?? Obstacle.default._lineLayer,
                    _duration: o._duration ?? Obstacle.default._duration,
                    _width: o._width ?? Obstacle.default._width,
                    _height: o._height ?? Obstacle.default._height,
                    _customData: o._customData ?? Obstacle.default._customData(),
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

    /** Position x `<int>` of obstacle.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: IObstacle['_lineIndex']) {
        this.data._lineIndex = value;
    }

    /** Position y `<int>` of obstacle.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: IObstacle['_lineLayer']) {
        this.data._lineLayer = value;
    }

    /** Type `<int>` of obstacle.
     * ```ts
     * 0 -> Full-height Wall
     * 1 -> Crouch Wall
     * 2 -> Freeform Wall
     * ```
     */
    get type() {
        return this.data._type;
    }
    set type(value: IObstacle['_type']) {
        this.data._type = value;
    }

    /** Duration `<float>` of obstacle.*/
    get duration() {
        return this.data._duration;
    }
    set duration(value: IObstacle['_duration']) {
        this.data._duration = value;
    }

    /** Width `<int>` of obstacle.
     * ---
     * Range: `none`
     */
    get width() {
        return this.data._width;
    }
    set width(value: IObstacle['_width']) {
        this.data._width = value;
    }

    /** Height `<int>` of obstacle.
     * ```ts
     * 1 -> Short
     * 2 -> Moderate
     * 3 -> Crouch
     * 4 -> Tall
     * 5 -> Full
     * ```
     * ---
     * Range: `1-5`
     */
    get height() {
        return this.data._height;
    }
    set height(value: IObstacle['_height']) {
        this.data._height = value;
    }

    setType(value: IObstacle['_type']) {
        this.type = value;
        return this;
    }
    setPosX(value: IObstacle['_lineIndex']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IObstacle['_lineLayer']) {
        this.posY = value;
        return this;
    }
    setDuration(value: IObstacle['_duration']) {
        this.duration = value;
        return this;
    }
    setWidth(value: IObstacle['_width']) {
        this.width = value;
        return this;
    }
    setHeight(value: IObstacle['_height']) {
        this.height = value;
        return this;
    }

    /** Get obstacle and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const obstaclePos = getPosition(wall);
     * ```
     */
    // FIXME: do i bother with Mapping Extension for obstacle Y position?
    getPosition(): [number, number] {
        if (this.customData._position) {
            return [this.customData._position[0], this.customData._position[1]];
        }
        return [
            (this.posX <= -1000 ? this.posX / 1000 : this.posX >= 1000 ? this.posX / 1000 : this.posX) - 2,
            this.type <= -1000 ? this.type / 1000 : this.type >= 1000 ? this.type / 1000 : this.type,
        ];
    }

    /** Check if obstacle is interactive.
     * ```ts
     * if (isInteractive(wall)) {}
     * ```
     */
    isInteractive(): boolean {
        return this.width >= 2 || this.posX === 1 || this.posX === 2;
    }

    /** Check if obstacle is crouch.
     * ```ts
     * if (isCrouch(wall)) {}
     * ```
     */
    isCrouch(): boolean {
        return this.type === 1 && (this.width > 2 || (this.width === 2 && this.posX === 1));
    }

    /** Check if obstacle has zero value.
     * ```ts
     * if (isZero(wall)) {}
     * ```
     */
    isZero(): boolean {
        return this.duration === 0 || this.width === 0;
    }

    /** Check if current obstacle is longer than previous obstacle.
     * ```ts
     * if (isLonger(currWall, prevWall)) {}
     * ```
     */
    isLonger(currObstacle: IObstacle, prevObstacle: IObstacle, offset = 0): boolean {
        return currObstacle._time + currObstacle._duration > prevObstacle._time + prevObstacle._duration + offset;
    }

    /** Check if obstacle has Chroma properties.
     * ```ts
     * if (hasChroma(wall)) {}
     * ```
     */
    hasChroma(): boolean {
        return Array.isArray(this.customData._color);
    }

    /** Check if obstacle has Noodle Extensions properties.
     * ```ts
     * if (hasNoodleExtensions(wall)) {}
     * ```
     */
    hasNoodleExtensions(): boolean {
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

    /** Check if obstacle has Mapping Extensions properties.
     * ```ts
     * if (hasMappingExtensions(wall)) {}
     * ```
     */
    hasMappingExtensions(): boolean {
        return this.width >= 1000 || this.type >= 1000 || this.posX > 3 || this.posX < 0;
    }

    /** Check if obstacle is a valid, vanilla obstacle.
     * ```ts
     * if (isValid(wall)) {}
     * ```
     */
    isValid(): boolean {
        return !this.hasMappingExtensions() && this.width > 0 && this.width <= 4;
    }
}
