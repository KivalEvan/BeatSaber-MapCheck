import logger from '../../logger';
import { ModType } from '../../types/beatmap/shared/modCheck';
import { INote } from '../../types/beatmap/v2/note';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import { ObjectReturnFn } from '../../types/utils';
import { Vector2 } from '../../types/vector';
import { deepCopy } from '../../utils/misc';
import { WrapColorNote } from '../wrapper/colorNote';

function tag(name: string): string[] {
    return ['beatmap', 'v2', 'note', name];
}

/** Note beatmap v2 class object. */
export class Note extends WrapColorNote<INote> {
    static default: ObjectReturnFn<INote> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _cutDirection: 0,
        _customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapColorNoteAttribute<INote>>);
    constructor(data: Partial<INote>);
    constructor(data: Partial<INote> & Partial<IWrapColorNoteAttribute<INote>>);
    constructor(data: Partial<INote> & Partial<IWrapColorNoteAttribute<INote>> = {}) {
        super();

        this._time = data.time ?? data._time ?? Note.default._time;
        this._posX = data.posX ?? data._lineIndex ?? Note.default._lineIndex;
        this._posY = data.posY ?? data._lineLayer ?? Note.default._lineLayer;
        this._type = data.type ?? data.color ?? data._type ?? Note.default._type;
        this._direction = data.direction ?? data._cutDirection ?? Note.default._cutDirection;
        this._customData = data.customData ?? data._customData ?? Note.default._customData();
    }

    static create(): Note[];
    static create(...data: Partial<IWrapColorNoteAttribute<INote>>[]): Note[];
    static create(...data: Partial<INote>[]): Note[];
    static create(...data: (Partial<INote> & Partial<IWrapColorNoteAttribute<INote>>)[]): Note[];
    static create(...data: (Partial<INote> & Partial<IWrapColorNoteAttribute<INote>>)[]): Note[] {
        const result: Note[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): INote {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _cutDirection: this.direction,
            _customData: deepCopy(this.customData),
        };
    }

    get color() {
        return this._type as 0;
    }
    set color(value: 0 | 1) {
        this._type = value;
    }

    get angleOffset() {
        return 0;
    }
    set angleOffset(_: number) {
        logger.tWarn(tag('customData'), 'Note angle offset does not exist in beatmap V2');
    }

    get customData(): NonNullable<INote['_customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<INote['_customData']>) {
        this._customData = value;
    }

    getPosition(type?: ModType): Vector2 {
        switch (type) {
            case 'vanilla':
                return super.getPosition();
            case 'ne':
                if (this.customData._position) {
                    return [this.customData._position[0], this.customData._position[1]];
                }
            /** falls through */
            case 'me':
            default:
                return [
                    (this.posX <= -1000
                        ? this.posX / 1000
                        : this.posX >= 1000
                        ? this.posX / 1000
                        : this.posX) - 2,
                    this.posY <= -1000
                        ? this.posY / 1000
                        : this.posY >= 1000
                        ? this.posY / 1000
                        : this.posY,
                ];
        }
    }

    getAngle(type?: ModType): number {
        switch (type) {
            case 'vanilla':
                return super.getAngle(type);
            case 'ne':
                if (this.customData._cutDirection) {
                    return this.customData._cutDirection > 0
                        ? this.customData._cutDirection % 360
                        : 360 + (this.customData._cutDirection % 360);
                }
            /* falls through */
            case 'me':
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return super.getAngle();
        }
    }

    isChroma(): boolean {
        return (
            Array.isArray(this.customData._color) ||
            typeof this.customData._disableSpawnEffect === 'boolean'
        );
    }

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
            Array.isArray(this.customData._rotation)
        );
    }
}
