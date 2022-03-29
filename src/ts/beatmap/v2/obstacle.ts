import { IObstacle, ObstacleCount } from '../../types/beatmap/v2/obstacle';
import { ObjectToReturn } from '../../types/utils';
import { BeatmapObject } from './object';

export class Obstacle extends BeatmapObject<IObstacle> {
    static default: ObjectToReturn<Required<IObstacle>> = {
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

    private constructor(data: Required<IObstacle>) {
        super(data);
    }

    static create(): Obstacle;
    static create(notes: Partial<IObstacle>): Obstacle;
    static create(...notes: Partial<IObstacle>[]): Obstacle[];
    static create(...notes: Partial<IObstacle>[]): Obstacle | Obstacle[] {
        const result: Obstacle[] = [];
        notes?.forEach((n) =>
            result.push(
                new Obstacle({
                    _time: n._time ?? Obstacle.default._time,
                    _type: n._type ?? Obstacle.default._type,
                    _lineIndex: n._lineIndex ?? Obstacle.default._lineIndex,
                    _lineLayer: n._lineLayer ?? Obstacle.default._lineLayer,
                    _duration: n._duration ?? Obstacle.default._duration,
                    _width: n._width ?? Obstacle.default._width,
                    _height: n._height ?? Obstacle.default._height,
                    _customData: n._customData ?? Obstacle.default._customData(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new Obstacle({
            _time: Obstacle.default._time,
            _type: Obstacle.default._type,
            _lineIndex: Obstacle.default._lineIndex,
            _lineLayer: Obstacle.default._lineLayer,
            _duration: Obstacle.default._duration,
            _width: Obstacle.default._width,
            _height: Obstacle.default._height,
            _customData: Obstacle.default._customData(),
        });
    }

    toObject(): IObstacle {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.lineIndex,
            _lineLayer: this.lineLayer,
            _duration: this.duration,
            _width: this.width,
            _height: this.height,
            _customData: this.customData,
        };
    }

    /** Position x `<int>` of note.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get lineIndex() {
        return this.data._lineIndex;
    }
    set lineIndex(value: IObstacle['_lineIndex']) {
        this.data._lineIndex = value;
    }

    /** Position y `<int>` of note.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get lineLayer() {
        return this.data._lineLayer;
    }
    set lineLayer(value: IObstacle['_lineLayer']) {
        this.data._lineLayer = value;
    }

    /** Type `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * 3 -> Bomb
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

    get customData() {
        return this.data._customData;
    }
    set customData(value: typeof this.data._customData) {
        this.data._customData = value;
    }

    setType(value: IObstacle['_type']) {
        this.type = value;
        return this;
    }
    setLineIndex(value: IObstacle['_lineIndex']) {
        this.lineIndex = value;
        return this;
    }
    setLineLayer(value: IObstacle['_lineLayer']) {
        this.lineLayer = value;
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
    setCustomData(value: typeof this.data._customData) {
        this.customData = value;
        return this;
    }
    deleteCustomData() {
        this.customData = {};
        return this;
    }
    removeCustomData(key: string) {
        delete this.customData[key];
        return this;
    }
    // FIXME: deal with customdata later
    addCustomData(object: Record<string, unknown>) {
        this.customData = { ...this.customData, object };
        return this;
    }

    /** Get obstacle and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const obstaclePos = getPosition(wall);
     * ```
     */
    // FIXME: do i bother with Mapping Extension for obstacle Y position?
    getPosition = (): [number, number] => {
        if (this.customData?._position) {
            return [this.customData._position[0], this.customData._position[1]];
        }
        return [
            (this.lineIndex <= -1000
                ? this.lineIndex / 1000
                : this.lineIndex >= 1000
                ? this.lineIndex / 1000
                : this.lineIndex) - 2,
            this.type <= -1000
                ? this.type / 1000
                : this.type >= 1000
                ? this.type / 1000
                : this.type,
        ];
    };

    /** Check if obstacle is interactive.
     * ```ts
     * if (isInteractive(wall)) {}
     * ```
     */
    isInteractive = (): boolean => {
        return this.width >= 2 || this.lineIndex === 1 || this.lineIndex === 2;
    };

    /** Check if obstacle is crouch.
     * ```ts
     * if (isCrouch(wall)) {}
     * ```
     */
    isCrouch = (): boolean => {
        return (
            this.type === 1 &&
            (this.width > 2 || (this.width === 2 && this.lineIndex === 1))
        );
    };

    /** Check if obstacle has zero value.
     * ```ts
     * if (isZero(wall)) {}
     * ```
     */
    isZero = (): boolean => {
        return this.duration === 0 || this.width === 0;
    };

    /** Check if current obstacle is longer than previous obstacle.
     * ```ts
     * if (isLonger(currWall, prevWall)) {}
     * ```
     */
    isLonger = (
        currObstacle: IObstacle,
        prevObstacle: IObstacle,
        offset = 0
    ): boolean => {
        return (
            currObstacle._time + currObstacle._duration >
            prevObstacle._time + prevObstacle._duration + offset
        );
    };

    /** Check if obstacle has Chroma properties.
     * ```ts
     * if (hasChroma(wall)) {}
     * ```
     */
    hasChroma = (): boolean => {
        return Array.isArray(this.customData?._color);
    };

    /** Check if obstacle has Noodle Extensions properties.
     * ```ts
     * if (hasNoodleExtensions(wall)) {}
     * ```
     */
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData?._animation) ||
            typeof this.customData?._fake === 'boolean' ||
            typeof this.customData?._interactable === 'boolean' ||
            Array.isArray(this.customData?._localRotation) ||
            typeof this.customData?._noteJumpMovementSpeed === 'number' ||
            typeof this.customData?._noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData?._position) ||
            Array.isArray(this.customData?._rotation) ||
            Array.isArray(this.customData?._scale) ||
            typeof this.customData?._track === 'string'
        );
    };

    /** Check if obstacle has Mapping Extensions properties.
     * ```ts
     * if (hasMappingExtensions(wall)) {}
     * ```
     */
    hasMappingExtensions = (): boolean => {
        return (
            this.width >= 1000 ||
            this.type >= 1000 ||
            this.lineIndex > 3 ||
            this.lineIndex < 0
        );
    };

    /** Check if obstacle is a valid, vanilla obstacle.
     * ```ts
     * if (isValid(wall)) {}
     * ```
     */
    isValid = (): boolean => {
        return !this.hasMappingExtensions() && this.width > 0 && this.width <= 4;
    };

    /** Count number of type of obstacles with their properties in given array and return a obstacle count object.
     * ```ts
     * const list = count(walls);
     * console.log(list);
     * ```
     */
    count = (obstacles: IObstacle[]): ObstacleCount => {
        const obstacleCount: ObstacleCount = {
            total: 0,
            interactive: 0,
            crouch: 0,
            chroma: 0,
            noodleExtensions: 0,
            mappingExtensions: 0,
        };
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacleCount.total++;
            if (this.isInteractive()) {
                obstacleCount.interactive++;
            }
            if (this.isCrouch()) {
                obstacleCount.crouch++;
            }
            if (this.hasChroma()) {
                obstacleCount.chroma++;
            }
            if (this.hasNoodleExtensions()) {
                obstacleCount.noodleExtensions++;
            }
            if (this.hasMappingExtensions()) {
                obstacleCount.mappingExtensions++;
            }
        }
        return obstacleCount;
    };
}