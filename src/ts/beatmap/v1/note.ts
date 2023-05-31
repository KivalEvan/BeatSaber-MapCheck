import logger from '../../logger';
import { ModType } from '../../types/beatmap/shared/modCheck';
import { INote } from '../../types/beatmap/v1/note';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote';
import { ObjectReturnFn } from '../../types/utils';
import { Vector2 } from '../../types/vector';
import { WrapColorNote } from '../wrapper/colorNote';

function tag(name: string): string[] {
    return ['beatmap', 'v1', 'note', name];
}

/** Note beatmap v1 class object. */
export class Note extends WrapColorNote<INote> {
    static default: ObjectReturnFn<INote> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _cutDirection: 0,
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
        logger.tWarn(tag('customData'), 'Note angle offset does not exist in beatmap V1');
    }

    get customData(): Record<string, never> {
        return {};
    }
    set customData(_: Record<string, never>) {
        logger.tWarn(tag('customData'), 'Note custom data does not exist in beatmap V1');
    }

    getPosition(type?: ModType): Vector2 {
        switch (type) {
            case 'vanilla':
            case 'ne':
                return super.getPosition();
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
            case 'ne':
                return super.getAngle(type);
            case 'me':
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return super.getAngle();
        }
    }
}
