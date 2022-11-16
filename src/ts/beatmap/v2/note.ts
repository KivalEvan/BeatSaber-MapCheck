import { INote } from '../../types/beatmap/v2/note';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapColorNote } from '../wrapper/colorNote';

/** Note beatmap v2 class object. */
export class Note extends WrapColorNote<Required<INote>> {
    static default: ObjectReturnFn<Required<INote>> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _cutDirection: 0,
        _customData: () => {
            return {};
        },
    };

    protected constructor(data: Required<INote>) {
        super(data);
    }

    static create(): Note[];
    static create(...notes: PartialWrapper<IWrapColorNote<Required<INote>>>[]): Note[];
    static create(...notes: Partial<INote>[]): Note[];
    static create(...notes: (Partial<INote> & PartialWrapper<IWrapColorNote<Required<INote>>>)[]): Note[];
    static create(...notes: (Partial<INote> & PartialWrapper<IWrapColorNote<Required<INote>>>)[]): Note[] {
        const result: Note[] = [];
        notes?.forEach((n) =>
            result.push(
                new this({
                    _time: n.time ?? n._time ?? Note.default._time,
                    _lineIndex: n.posX ?? n._lineIndex ?? Note.default._lineIndex,
                    _lineLayer: n.posY ?? n._lineLayer ?? Note.default._lineLayer,
                    _type: n.type ?? n._type ?? Note.default._type,
                    _cutDirection: n.direction ?? n._cutDirection ?? Note.default._cutDirection,
                    _customData: n.customData ?? n._customData ?? Note.default._customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _time: Note.default._time,
                _lineIndex: Note.default._lineIndex,
                _lineLayer: Note.default._lineLayer,
                _type: Note.default._type,
                _cutDirection: Note.default._cutDirection,
                _customData: Note.default._customData(),
            }),
        ];
    }

    toJSON(): Required<INote> {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _cutDirection: this.direction,
            _customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data._time;
    }
    set time(value: INote['_time']) {
        this.data._time = value;
    }

    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: INote['_lineIndex']) {
        this.data._lineIndex = value;
    }

    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: INote['_lineLayer']) {
        this.data._lineLayer = value;
    }

    get type() {
        return this.data._type;
    }
    set type(value: INote['_type']) {
        this.data._type = value;
    }

    get color() {
        return this.data._type as 0;
    }
    set color(value: 0 | 1) {
        this.data._type = value;
    }

    get direction() {
        return this.data._cutDirection;
    }
    set direction(value: INote['_cutDirection']) {
        this.data._cutDirection = value;
    }

    get angleOffset() {
        return 0;
    }
    set angleOffset(_: number) {
        // TODO: do some calculation with direction?
    }

    get customData(): NonNullable<INote['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<INote['_customData']>) {
        this.data._customData = value;
    }

    getPosition(type?: 'vanilla' | 'me' | 'ne'): [number, number] {
        if (this.customData._position) {
            return [this.customData._position[0], this.customData._position[1]];
        }
        return super.getPosition(type);
    }

    getAngle(type?: 'vanilla' | 'me' | 'ne'): number {
        if (this.customData._cutDirection) {
            return this.customData._cutDirection > 0
                ? this.customData._cutDirection % 360
                : 360 + (this.customData._cutDirection % 360);
        }
        return super.getAngle(type);
    }

    isChroma(): boolean {
        return Array.isArray(this.customData._color) || typeof this.customData._disableSpawnEffect === 'boolean';
    }

    // god i hate these
    isNoodleExtensions(): boolean {
        return (
            Array.isArray(this.customData._animation) ||
            typeof this.customData._cutDirection === 'number' ||
            typeof this.customData._disableNoteGravity === 'boolean' ||
            typeof this.customData._disableNoteLook === 'boolean' ||
            typeof this.customData._fake === 'boolean' ||
            Array.isArray(this.customData._flip) ||
            typeof this.customData._interactable === 'boolean' ||
            Array.isArray(this.customData._localRotation) ||
            typeof this.customData._noteJumpMovementSpeed === 'number' ||
            typeof this.customData._noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData._position) ||
            Array.isArray(this.customData._rotation) ||
            typeof this.customData._track === 'string'
        );
    }
}
